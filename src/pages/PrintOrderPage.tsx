import { useState } from "react"
import { Helmet } from "react-helmet-async"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import PhoneInput from "@/components/landing/PhoneInput"
import PrintHero from "@/components/landing/PrintHero"
import PrintServices from "@/components/landing/PrintServices"
import PrintFormats from "@/components/landing/PrintFormats"
import PrintGallery from "@/components/landing/PrintGallery"
import PrintPriceList from "@/components/landing/PrintPriceList"
import PrintCallToAction from "@/components/landing/PrintCallToAction"
import Icon from "@/components/ui/icon"
import { toast } from "@/hooks/use-toast"
import func2url from "../../backend/func2url.json"

const materials = ["PLA пластик", "ABS пластик", "PETG пластик", "Нейлон (PA)", "Другое / не знаю"]
const colors = ["Белый", "Чёрный", "Серый", "Красный", "Синий", "Жёлтый", "Прозрачный", "Другой / не важно"]

export default function PrintOrderPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [material, setMaterial] = useState(materials[0])
  const [color, setColor] = useState(colors[0])
  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fileToBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(",")[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(f)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Заполните имя и телефон", variant: "destructive" })
      return
    }
    if (phone.replace(/\D/g, "").length !== 11) {
      toast({ title: "Введите номер телефона полностью", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      let file_base64: string | undefined
      let file_name: string | undefined
      if (file) {
        file_base64 = await fileToBase64(file)
        file_name = file.name
      }

      const res = await fetch(func2url.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_type: "print",
          name,
          phone,
          email,
          material,
          color,
          quantity,
          comment,
          file_base64,
          file_name,
        }),
      })

      if (!res.ok) throw new Error("Ошибка отправки")

      setSuccess(true)
      setName("")
      setPhone("")
      setEmail("")
      setMaterial(materials[0])
      setColor(colors[0])
      setQuantity(1)
      setComment("")
      setFile(null)
    } catch {
      toast({ title: "Не удалось отправить заявку", description: "Попробуйте позже или позвоните нам", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>3D печать — Центр Строительного Инжиниринга</title>
        <meta name="description" content="Закажите печать детали на 3D-принтере QIDI Q2. Загрузите модель, выберите материал и цвет — рассчитаем стоимость и напечатаем." />
      </Helmet>
      <main className="min-h-screen bg-white dark:bg-[#111111]">
        <Header />
        <div className="container pt-4">
          <PrintHero />
          <PrintServices />
        </div>
        <PrintFormats />
        <PrintGallery />
        <PrintPriceList />
        <div className="container">
          <PrintCallToAction />
        </div>

        <div id="order-form" className="container py-12 scroll-mt-20">
          <div className="section-label">Заказ печати</div>
          <h2 className="text-black dark:text-white mb-4 text-3xl md:text-4xl font-medium leading-tight">
            Заказать 3D-печать детали
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-10">
            Заполните форму — приложите файл модели, если он у вас есть, укажите материал и цвет. Мы свяжемся с вами для подтверждения заказа и расчёта стоимости.
          </p>

          {success ? (
            <div className="card p-8 max-w-xl text-center">
              <div className="w-14 h-14 bg-[#7A7FEE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={26} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Заявка отправлена!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Мы скоро свяжемся с вами по указанному телефону для уточнения деталей заказа.
              </p>
              <button onClick={() => setSuccess(false)} className="btn-primary">
                Оформить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 md:p-8 max-w-2xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Имя *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Телефон *</label>
                  <PhoneInput
                    value={phone}
                    onChange={setPhone}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                    placeholder="+7 900 000 00 00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">3D-модель или архив с файлами</label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-[#7A7FEE] transition-colors">
                  <Icon name="Upload" size={18} className="text-[#7A7FEE] flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                    {file ? file.name : "Нажмите, чтобы прикрепить файл (необязательно)"}
                  </span>
                  <input
                    type="file"
                    accept=".stl,.obj,.step,.stp,.3mf,.zip,.rar,.7z,.tar,.gz"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      if (f && f.size > 25 * 1024 * 1024) {
                        toast({ title: "Файл слишком большой", description: "Максимальный размер файла — 25 МБ", variant: "destructive" })
                        e.target.value = ""
                        return
                      }
                      setFile(f)
                    }}
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  Поддерживаются форматы: STL, OBJ, STEP, 3MF, а также архивы ZIP, RAR, 7Z, TAR.GZ. Максимум 25 МБ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Материал</label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                  >
                    {materials.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Цвет</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                  >
                    {colors.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Количество экземпляров</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full md:w-40 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Комментарий к заказу</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE] resize-none"
                  placeholder="Дополнительные пожелания, сроки, размеры..."
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full md:w-auto disabled:opacity-60">
                {loading ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
        <Footer />
      </main>
    </>
  )
}