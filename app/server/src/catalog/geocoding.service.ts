import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface GeoPoint {
  lat: number;
  lon: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

// бесплатный геокодер nominatim (openstreetmap) превращает текстовый адрес клиники в координаты для карты.
// используем политику nominatim как есть: свой user-agent, не больше одного запроса на адрес, результат кэшируем
// в памяти на все время работы процесса, чтобы не дергать сервис на каждый запрос к /clinic
@Injectable()
export class GeocodingService implements OnApplicationBootstrap {
  private readonly log = new Logger(GeocodingService.name);
  private cache: GeoPoint | null = null;
  private cachedForAddress: string | null = null;
  private inFlight: Promise<GeoPoint | null> | null = null;

  constructor(private readonly config: ConfigService) {}

  // прогреваем кэш при старте приложения, чтобы первый же запрос с сайта не ждал внешний сервис
  async onApplicationBootstrap(): Promise<void> {
    const address = this.config.get<string>('CLINIC_ADDRESS', 'г. Великий Новгород, ул. Кочетова, дом 16/46');
    await this.geocode(address);
  }

  async geocode(address: string): Promise<GeoPoint | null> {
    if (this.cachedForAddress === address) return this.cache;
    if (this.inFlight) return this.inFlight;

    this.inFlight = this.fetchFromNominatim(address);
    try {
      const point = await this.inFlight;
      this.cache = point;
      this.cachedForAddress = address;
      return point;
    } finally {
      this.inFlight = null;
    }
  }

  private async fetchFromNominatim(address: string): Promise<GeoPoint | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch(url, {
        headers: {
          // nominatim требует идентифицировать приложение в user-agent, анонимные запросы могут быть заблокированы
          'User-Agent': 'VetSoft/1.0 (клиника, геокодирование адреса для карты; mail@vetsoft.local)',
          'Accept-Language': 'ru',
        },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`nominatim вернул статус ${response.status}`);
      const rows = (await response.json()) as NominatimResult[];
      const first = rows[0];
      if (!first) {
        this.log.warn(`nominatim не нашел координаты для адреса: ${address}`);
        return null;
      }
      return { lat: parseFloat(first.lat), lon: parseFloat(first.lon) };
    } catch (error) {
      this.log.warn(`не удалось определить координаты через nominatim: ${(error as Error).message}`);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
}
