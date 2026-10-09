import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import Icon from "@/components/ui/icon"

export interface ServiceDetailProps {
  path: string
  metaTitle: string
  metaDescription: string
  titleTop: string
  titleAccent: string
  intro: string
  deviceName: string
  deviceType: string
  deviceText: string
  images: string[]
  workTitle: string
  works: { icon: string; title: string; text: string }[]
  benefits: string[]
}

export default function ServiceDetail(p: ServiceDetailProps) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <Helmet>
        <title>{p.metaTitle}</title>
        <meta name="description" content={p.metaDescription} />
        <meta property="og:title" content={p.metaTitle} />
        <link rel="canonical" href={p.path} />
      </Helmet>
      <Header />
      <div className="container pt-4 pb-16">
        <section className="my-8">
          <h1 className="text-black dark:text-white mb-4 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
            {p.titleTop}
            <span className="block text-[#7A7FEE]">{p.titleAccent}</span>
          </h1>
          <p className="mb-12 max-w-2xl text-gray-700 dark:text-gray-300">{p.intro}</p>

          <div className="card p-6 md:p-8 shadow-md mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border-2 border-[#7A7FEE]">
            <div>
              <span className="inline-block text-xs font-semibold text-[#7A7FEE] border border-[#7A7FEE] rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
                {p.deviceType}
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-3">{p.deviceName}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{p.deviceText}</p>
            </div>
            <div className={`grid gap-4 ${p.images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
              {p.images.map((src, i) => (
                <div key={i} className="rounded-xl bg-white overflow-hidden flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700">
                  <img src={src} alt={p.deviceName} className="w-full h-56 md:h-64 object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white mb-6">{p.workTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {p.works.map((w) => (
              <div key={w.title} className="card p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-[#7A7FEE] w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Icon name={w.icon} fallback="CircleDot" size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">{w.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{w.text}</p>
              </div>
            ))}
          </div>

          <div className="card p-6 md:p-8 shadow-md mb-12">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">Что вы получаете</h2>
            <ul className="space-y-3">
              {p.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm md:text-base">
                  <Icon name="CircleCheck" size={20} className="text-[#7A7FEE] shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-8 shadow-md text-center">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Нужна консультация?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Свяжитесь с нами — обсудим задачу и рассчитаем стоимость.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://mail.yandex.ru/compose?to=csiperm@yandex.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Icon name="Mail" size={16} />
                Связаться с нами
              </a>
              <Link to="/services" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-[#7A7FEE] text-[#7A7FEE] hover:bg-[#7A7FEE] hover:text-white transition-colors text-sm font-medium">
                Все услуги
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
