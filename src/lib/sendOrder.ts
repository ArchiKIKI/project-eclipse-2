export const WEB3FORMS_ACCESS_KEY = "ВСТАВЬТЕ_КЛЮЧ_WEB3FORMS"

export async function sendOrder(subject: string, fields: Record<string, string | number | undefined>) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject,
      from_name: "Сайт ЦСИ",
      ...fields,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) throw new Error("Ошибка отправки")
}
