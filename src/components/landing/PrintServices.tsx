import Icon from "@/components/ui/icon"

const services = [
  {
    id: 1,
    title: "Печать по вашему файлу",
    description: "Пришлите готовую 3D-модель в формате STL или OBJ — рассчитаем стоимость и напечатаем деталь в нужном материале и цвете.",
    icon: "FileUp",
  },
  {
    id: 2,
    title: "3D-сканирование на выезде",
    description: "Нет модели, но есть физическая деталь? Приедем со сканером Creality CR-Scan Ferret Pro, снимем точную копию и подготовим файл для печати.",
    icon: "ScanLine",
  },
  {
    id: 3,
    title: "Помощь с моделированием",
    description: "Поможем доработать модель, устраним ошибки геометрии и подберём оптимальные параметры печати под вашу задачу.",
    icon: "PenTool",
  },
]

export default function PrintServices() {
  return (
    <section id="print-services" className="my-20">
      <div className="section-label">Как мы работаем</div>
      <h2 className="text-black dark:text-white mb-6 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
        Печатаем и сканируем
        <span className="block text-[#7A7FEE]">быстро и точно</span>
      </h2>
      <p className="mb-12 max-w-2xl text-gray-700 dark:text-gray-300">
        От готового 3D-файла до сканирования физического объекта — берём на себя всю технологическую цепочку, вы получаете готовую деталь.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-[#7A7FEE] w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Icon name={service.icon} fallback="CircleDot" className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">{service.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}