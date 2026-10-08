import ContactFormButton from "./ContactFormButton"

export default function Hero() {
  return (
    <section id="hero" className="card my-8 relative overflow-hidden shadow-md">
      <div className="p-8 md:p-10 lg:p-12 flex flex-col md:flex-row items-start">
        <div className="w-full md:w-3/5 z-10">
          <h1 className="text-black dark:text-white text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
            Строительный инжиниринг
            <span className="block text-[#7A7FEE] dark:text-[#7A7FEE]">на высшем</span>
            уровне
          </h1>
          <p className="my-6 text-sm md:text-base max-w-md text-gray-700 dark:text-gray-300">
            Осуществляем строительный контроль и технический надзор на каждом этапе строительства. Проверяем соответствие проекту, нормам и стандартам качества — защищаем ваши интересы как заказчика.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="/services" className="btn-primary">
              Наши услуги
            </a>
            <a href="/contacts" className="btn-secondary text-black dark:text-white">
              Связаться с нами
            </a>
          </div>
        </div>

        <div className="hidden md:block md:w-2/5 md:absolute md:right-0 md:top-0 md:bottom-0 md:flex md:items-center">
          <div className="hero-wave-wrap">
            <img src="/purple-circle-wave-static.png" alt="" aria-hidden="true" className="hero-wave-glow md:object-cover md:object-left" />
            <img src="/purple-circle-wave-static.png" alt="" aria-hidden="true" className="hero-wave-orbit md:object-cover md:object-left" />
            <span className="hero-wave-ring" />
            <span className="hero-wave-ring hero-wave-ring-2" />
            <span className="hero-wave-ring hero-wave-ring-3" />
            <img
              src="/purple-circle-wave-static.png"
              alt="Purple Wave"
              className="hero-wave-main w-full h-auto md:h-full md:w-auto md:object-cover md:object-left"
            />
          </div>
        </div>
      </div>
    </section>
  )
}