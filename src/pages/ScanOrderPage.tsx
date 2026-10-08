import { useState } from "react"
import { Helmet } from "react-helmet-async"
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
import PhoneInput from "@/components/landing/PhoneInput"
import Icon from "@/components/ui/icon"
import { toast } from "@/hooks/use-toast"
import func2url from "../../backend/func2url.json"

export default function ScanOrderPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast({ title: "Заполните имя, телефон и адрес", variant: "destructive" })
      return
    }
    if (phone.replace(/\D/g, "").length !== 11) {
      toast({ title: "Введите номер телефона полностью", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(func2url.orders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_type: "scan",
          name,
          phone,
          email,
          address,
          preferred_date: preferredDate,
          comment,
        }),
      })

      if (!res.ok) throw new Error("Ошибка отправки")

      setSuccess(true)
      setName("")
      setPhone("")
      setEmail("")
      setAddress("")
      setPreferredDate("")
      setComment("")
    } catch {
      toast({ title: "Не удалось отправить заявку", description: "Попробуйте позже или позвоните нам", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Заказать выезд на 3D-сканирование — Центр Строительного Инжиниринга</title>
        <meta name="description" content="Закажите выезд специалиста с 3D-сканером для оцифровки детали и последующей печати." />
      </Helmet>
      <main className="min-h-screen bg-white dark:bg-[#111111]">
        <Header />
        <div className="container py-12">
          <div className="section-label">Заказ сканирования</div>
          <h1 className="text-black dark:text-white mb-4 text-3xl md:text-4xl font-medium leading-tight">
            Заказать выезд на 3D-сканирование
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-10">
            Приедем к вам с 3D-сканером, снимем деталь и подготовим цифровую модель для последующей печати. Укажите адрес и удобное время — мы согласуем визит.
          </p>

          {success ? (
            <div className="card p-8 max-w-xl text-center">
              <div className="w-14 h-14 bg-[#7A7FEE] rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={26} className="text-white" />
              </div>
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">Заявка отправлена!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Мы свяжемся с вами по телефону, чтобы согласовать дату и время выезда.
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
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Адрес выезда *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                  placeholder="Город, улица, дом"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Желаемая дата и время</label>
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
                  placeholder="Например: завтра после 15:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black dark:text-white mb-1.5">Комментарий к заказу</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7A7FEE] resize-none"
                  placeholder="Опишите деталь, которую нужно отсканировать, её примерный размер..."
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
