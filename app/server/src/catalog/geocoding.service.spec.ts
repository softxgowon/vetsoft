import { GeocodingService } from './geocoding.service';

const config = { get: (_key: string, fallback: string) => fallback };

describe('GeocodingService', () => {
  let service: GeocodingService;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    service = new GeocodingService(config as never);
    fetchMock = jest.fn();
    global.fetch = fetchMock as never;
  });

  it('возвращает координаты из первого результата nominatim', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ lat: '58.5215', lon: '31.2755' }] });

    const point = await service.geocode('г. Великий Новгород, ул. Кочетова, дом 16/46');

    expect(point).toEqual({ lat: 58.5215, lon: 31.2755 });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain('nominatim.openstreetmap.org/search');
    expect(url).toContain(encodeURIComponent('г. Великий Новгород, ул. Кочетова, дом 16/46'));
    expect((options.headers as Record<string, string>)['User-Agent']).toContain('VetSoft');
  });

  it('кэширует результат и не делает повторный запрос для того же адреса', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ lat: '1', lon: '2' }] });

    await service.geocode('адрес');
    await service.geocode('адрес');

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('делает новый запрос, если адрес изменился', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [{ lat: '1', lon: '2' }] });

    await service.geocode('адрес A');
    await service.geocode('адрес B');

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('возвращает null и не падает, если nominatim ничего не нашел', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => [] });
    await expect(service.geocode('несуществующий адрес')).resolves.toBeNull();
  });

  it('возвращает null и не падает при сетевой ошибке', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    await expect(service.geocode('адрес')).resolves.toBeNull();
  });

  it('возвращает null и не падает при не-200 ответе', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 429 });
    await expect(service.geocode('адрес')).resolves.toBeNull();
  });

  it('параллельные запросы для одного адреса переиспользуют один и тот же вызов fetch', async () => {
    let resolveFetch!: (value: unknown) => void;
    fetchMock.mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));

    const first = service.geocode('адрес');
    const second = service.geocode('адрес');
    resolveFetch({ ok: true, json: async () => [{ lat: '1', lon: '2' }] });

    await Promise.all([first, second]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
