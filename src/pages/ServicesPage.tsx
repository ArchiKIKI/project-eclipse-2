import { Helmet } from "react-helmet-async"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import Icon from "@/components/ui/icon"

const services = [
  {
    id: 1,
    title: "Строительный контроль",
    description: "Комплексный контроль качества строительства на всех этапах: от нулевого цикла до сдачи объекта. Проверяем соответствие работ проекту, нормам и стандартам — защищаем ваши интересы.",
    icon: "ShieldCheck",
    featured: true,
  },
  {
    id: 2,
    title: "Технический надзор",
    description: "Авторский и технический надзор за ходом строительства. Контроль применяемых материалов, технологий и сроков выполнения работ.",
    icon: "Eye",
    featured: false,
  },
  {
    id: 3,
    title: "Строительная экспертиза",
    description: "Независимая строительно-техническая экспертиза объектов. Оценка качества выполненных работ, выявление дефектов и нарушений.",
    icon: "Search",
    featured: false,
  },
  {
    id: 4,
    title: "Проектирование",
    description: "Разработка проектной и рабочей документации для объектов строительства различного назначения в соответствии с нормами и стандартами.",
    icon: "PenTool",
    featured: false,
  },
  {
    id: 5,
    title: "Инженерные изыскания",
    description: "Геодезические, геологические и экологические изыскания для подготовки к строительству и проектированию.",
    icon: "MapPin",
    featured: false,
  },
  {
    id: 6,
    title: "Сметное дело",
    description: "Составление смет, проверка и экспертиза сметной документации. Ценообразование в строительстве по актуальным нормативам.",
    icon: "Calculator",
    featured: false,
  },
  {
    id: 7,
    title: "Консультации и сопровождение",
    description: "Юридическое и техническое сопровождение строительных проектов, консультации по нормативной базе и согласованиям.",
    icon: "MessageSquare",
    featured: false,
  },
  {
    id: 8,
    title: "3D-печать и сканирование",
    description: "Печатаем детали по вашей 3D-модели на принтере QIDI Q2, а также выезжаем со сканером Creality CR-Scan Ferret Pro, чтобы снять цифровую копию физической детали для последующей печати.",
    icon: "Box",
    featured: false,
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <Helmet>
        <title>Услуги — строительный контроль и надзор в Перми</title>
        <meta name="description" content="Строительный контроль, технический надзор, экспертиза, проектирование, инженерные изыскания, сметное дело и 3D-печать в Перми. Защищаем интересы заказчика." />
        <meta property="og:title" content="Услуги — строительный контроль и надзор в Перми" />
        <meta property="og:description" content="Строительный контроль и технический надзор в Перми. Полный спектр услуг для заказчиков строительства." />
        <link rel="canonical" href="/services" />
      </Helmet>
      <Header />
      <div className="container pt-4 pb-16">
        <section className="my-8">
          <h1 className="text-black dark:text-white mb-4 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
            Наши
            <span className="block text-[#7A7FEE]">услуги</span>
          </h1>
          <p className="mb-12 max-w-2xl text-gray-700 dark:text-gray-300">
            Центр Строительного Инжиниринга — профессиональный строительный контроль и технический надзор в Перми. Работаем на стороне заказчика, обеспечивая качество на каждом этапе.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`card p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${service.featured ? "md:col-span-2 lg:col-span-3 border-2 border-[#7A7FEE]" : ""}`}
              >
                <div className={`${service.featured ? "bg-[#7A7FEE]" : "bg-[#7A7FEE]"} w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon name={service.icon} fallback="CircleDot" size={22} className="text-white" />
                </div>
                {service.featured && (
                  <span className="inline-block text-xs font-semibold text-[#7A7FEE] border border-[#7A7FEE] rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
                    Основная услуга
                  </span>
                )}
                <h3 className={`font-semibold mb-2 text-black dark:text-white ${service.featured ? "text-2xl" : "text-xl"}`}>{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 card p-8 shadow-md hover:shadow-lg transition-shadow duration-300 text-center">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Нужна консультация?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Свяжитесь с нами — обсудим ваш проект и подберём оптимальное решение.
            </p>
            <a
              href="https://mail.yandex.ru/compose?to=csiperm@yandex.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Icon name="Mail" size={16} />
              Связаться с нами
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}
