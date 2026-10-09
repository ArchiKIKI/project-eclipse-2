import Icon from "@/components/ui/icon"
import printingImg from "@/assets/qidi-q2-printing.jpg"
import nozzleImg from "@/assets/qidi-q2-nozzle.jpg"
import scannerImg from "@/assets/creality-ferret-pro.jpg"
import examplesImg from "@/assets/qidi-q2-examples.jpg"

const formats = [
  {
    id: 1,
    icon: "Layers",
    title: "FDM-печать пластиком",
    desc: "PLA, ABS, PETG, нейлон — прочные функциональные детали, корпуса, крепёж, прототипы на принтере QIDI Q2.",
    image: printingImg,
    cta: "Заказать печать",
    link: "#order-form",
  },
  {
    id: 2,
    icon: "Flame",
    title: "Инженерные пластики",
    desc: "Печать нагруженных деталей при температуре сопла до 370°C в подогреваемой камере — для PA, PC и композитов.",
    image: nozzleImg,
    cta: "Заказать печать",
    link: "#order-form",
  },
  {
    id: 3,
    icon: "ScanLine",
    title: "Выезд для 3D-сканирования",
    desc: "Приедем со сканером Creality CR-Scan Ferret Pro, отсканируем деталь любой формы и подготовим цифровую модель для печати или реставрации. Стоимость выезда — 15 000 ₽.",
    image: scannerImg,
    cta: "Заказать выезд",
    link: "/scan-order",
  },
  {
    id: 4,
    icon: "Package",
    title: "Готовые изделия на заказ",
    desc: "Печатаем прототипы, сувениры, декор и функциональные детали любой сложности под ваш проект.",
    image: examplesImg,
    cta: "Смотреть примеры",
    link: "/services",
  },
]

export default function PrintFormats() {
  return (
    <section className="py-16 bg-white dark:bg-[#111111]">
      <div className="container">
        <div className="section-label">Форматы работы</div>
        <div className="mb-10">
          <h2 className="text-black dark:text-white">Выберите формат сотрудничества</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formats.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 hover:border-[#7A7FEE] transition-colors duration-300 overflow-hidden shadow-sm hover:shadow-md rounded-2xl">
              <div className="relative h-48 overflow-hidden bg-[#1c1c1c]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute top-0 left-0 w-1 h-full bg-[#7A7FEE]" />
                <div className="absolute top-4 right-4 w-9 h-9 bg-[#7A7FEE] rounded-lg flex items-center justify-center">
                  <Icon name={item.icon} fallback="Check" size={16} className="text-white" />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-black dark:text-white font-bold text-base mb-2 group-hover:text-[#7A7FEE] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-1">{item.desc}</p>
                <a
                  href={item.link}
                  className="mt-4 flex items-center gap-1.5 text-[#7A7FEE] text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all"
                >
                  {item.cta}
                  <Icon name="ArrowRight" size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}