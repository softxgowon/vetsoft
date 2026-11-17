// сопоставление ключей картинок из каталога (приходят с бэкенда) с файлами ассетов
import uslugi1 from '~/assets/images/uslugi/uslugi-1.png'
import uslugi2 from '~/assets/images/uslugi/uslugi2.png'
import uslugi3 from '~/assets/images/uslugi/uslugi3.png'
import uslugi4 from '~/assets/images/uslugi/uslugi4.png'
import uslugi5 from '~/assets/images/uslugi/uslugi5.png'
import heroBanner from '~/assets/images/HeroBanner.png'
import oarit from '~/assets/images/OARIT.png'
import special from '~/assets/images/Special.png'
import zooLand from '~/assets/images/ZooLand.png'
import history from '~/assets/images/history.png'
import surgery from '~/assets/images/surgery.png'
import therapy from '~/assets/images/therapy.png'

const IMAGES: Record<string, string> = {
  'uslugi-1': uslugi1,
  uslugi2,
  uslugi3,
  uslugi4,
  uslugi5,
  HeroBanner: heroBanner,
  OARIT: oarit,
  Special: special,
  ZooLand: zooLand,
  history,
  surgery,
  therapy,
}

export const imageByKey = (key: string | null | undefined): string => IMAGES[key ?? ''] ?? uslugi1
