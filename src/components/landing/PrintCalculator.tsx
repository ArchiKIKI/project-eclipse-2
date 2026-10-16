import { useMemo, useState } from "react"
import Icon from "@/components/ui/icon"
import { toast } from "@/hooks/use-toast"
import { analyzeModel, MeshStats } from "@/lib/meshAnalysis"
import { FLOW_MM3_PER_SEC, MACHINE_HOUR_RATE, MAX_BUILD_MM, printMaterials, SETUP_HOURS } from "@/lib/printPricing"

const fieldCls =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
const infills = [10, 20, 40, 60, 100]

export default function PrintCalculator() {
  const [stats, setStats] = useState<MeshStats | null>(null)
  const [fileName, setFileName] = useState("")
  const [manualWeight, setManualWeight] = useState("")
  const [materialId, setMaterialId] = useState(printMaterials[0].id)
  const [infill, setInfill] = useState(20)
  const [quantity, setQuantity] = useState(1)
  const [busy, setBusy] = useState(false)

  const material = printMaterials.find((m) => m.id === materialId) || printMaterials[0]

  const handleFile = async (f: File | null) => {
    if (!f) return
    if (f.size > 25 * 1024 * 1024) {
      toast({ title: "Файл слишком большой", description: "Максимум 25 МБ", variant: "destructive" })
      return
    }
    setBusy(true)
    try {
      const s = await analyzeModel(f)
      setStats(s)
      setFileName(f.name)
      setManualWeight("")
    } catch {
      setStats(null)
      setFileName("")
      toast({
        title: "Не удалось прочитать файл",
        description: "Загрузите STL, 3MF, OBJ или ZIP либо введите вес детали вручную",
        variant: "destructive",
      })
    } finally {
      setBusy(false)
    }
  }

  const result = useMemo(() => {
    let weight = 0
    if (stats) {
      const volume = stats.volumeMm3 / 1000
      const area = stats.areaMm2 / 100
      const shell = Math.min(volume, area * 0.12)
      weight = (shell + (volume - shell) * (infill / 100)) * material.density
    } else if (Number(manualWeight) > 0) {
      weight = Number(manualWeight)
    }
    if (!weight) return null
    const hours = (weight / material.density) * 1000 / FLOW_MM3_PER_SEC / 3600
    const materialCost = weight * material.pricePerGram * quantity
    const machineCost = (hours * quantity + SETUP_HOURS) * MACHINE_HOUR_RATE
    return { weight, hours, materialCost, machineCost, total: materialCost + machineCost }
  }, [stats, manualWeight, material, infill, quantity])

  const fits =
    !stats ||
    [...stats.size].sort((a, b) => b - a).every((v, i) => v <= [...MAX_BUILD_MM].sort((a, b) => b - a)[i])

  return (
    <section className="py-16 bg-gray-50 dark:bg-[#161616]">
      <div className="container">
        <div className="section-label">Калькулятор</div>
        <h2 className="text-black dark:text-white mb-3 max-w-xl">Рассчитайте стоимость печати</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
          Загрузите модель в формате STL, 3MF, OBJ или ZIP-архив с ними, и мы оценим вес и цену. Расчёт примерный, точную стоимость назовём после проверки файла.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-5xl">
          <div className="lg:col-span-3 card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Файл модели (STL, 3MF, OBJ или ZIP-архив)</label>
              <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-[#7A7FEE] transition-colors">
                <Icon name={busy ? "Loader" : "Upload"} size={18} className="text-[#7A7FEE] flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {busy ? "Анализируем..." : fileName || "Нажмите, чтобы загрузить файл"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    handleFile(e.target.files?.[0] || null)
                    e.target.value = ""
                  }}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                Файл обрабатывается в вашем браузере и никуда не отправляется. Размеры считаются в миллиметрах.
              </p>
            </div>

            {!stats && (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">
                  Или укажите примерный вес детали, г
                </label>
                <input
                  type="number"
                  min={1}
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className={fieldCls}
                  placeholder="Например: 80"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Материал</label>
                <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className={fieldCls}>
                  {printMaterials.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} — {m.pricePerGram} ₽/г</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Количество, шт</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className={fieldCls}
                />
              </div>
            </div>

            {stats && (
              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Заполнение</label>
                <div className="flex flex-wrap gap-2">
                  {infills.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setInfill(v)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                        infill === v
                          ? "bg-[#7A7FEE] text-white border-[#7A7FEE]"
                          : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-[#7A7FEE]"
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 card p-6 flex flex-col justify-center">
            {result ? (
              <>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Примерная стоимость</div>
                <div className="text-3xl font-semibold text-black dark:text-white mb-4">
                  {Math.round(result.total * 0.9).toLocaleString("ru-RU")} – {Math.round(result.total * 1.2).toLocaleString("ru-RU")} ₽
                </div>
                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <li>Вес одной детали: ≈ {Math.round(result.weight)} г</li>
                  <li>Материал: {material.name}, {material.pricePerGram} ₽/г</li>
                  {stats && (
                    <li>
                      Размер: {stats.size.map((v) => Math.round(v)).join(" × ")} мм
                    </li>
                  )}
                  <li>Время печати: ≈ {result.hours < 1 ? `${Math.round(result.hours * 60)} мин` : `${result.hours.toFixed(1)} ч`} на деталь</li>
                  <li>Пластик: {Math.round(result.materialCost).toLocaleString("ru-RU")} ₽</li>
                  <li>Работа принтера ({MACHINE_HOUR_RATE} ₽/ч): {Math.round(result.machineCost).toLocaleString("ru-RU")} ₽</li>
                </ul>
                {!fits && (
                  <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                    Деталь больше области печати принтера (270×270×256 мм). Её придётся печатать по частям.
                  </p>
                )}
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Без учёта поддержек, постобработки и доработки модели.
                </p>
              </>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-sm text-center">
                <Icon name="Calculator" size={32} className="mx-auto mb-3 text-[#7A7FEE]" />
                Загрузите файл или укажите вес детали, и здесь появится расчёт.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
