import type { ChangeEvent, InputHTMLAttributes } from "react"

const PREFIX = "+7"
const MAX_DIGITS = 10

export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1)
  digits = digits.slice(0, MAX_DIGITS)
  if (!digits) return ""

  let result = `${PREFIX} (${digits.slice(0, 3)}`
  if (digits.length >= 3) result += ")"
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`
  return result
}

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: string
  onChange: (value: string) => void
}

export default function PhoneInput({ value, onChange, ...rest }: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    if (next.length < value.length) {
      const digits = next.replace(/\D/g, "")
      if (digits.length <= 1) {
        onChange("")
        return
      }
      let formatted = formatPhone(next)
      if (formatted === value) formatted = formatPhone(next.slice(0, -1).replace(/\D*$/, "") || "")
      onChange(formatted)
      return
    }
    onChange(formatPhone(next))
  }

  const handleFocus = () => {
    if (!value) onChange("+7 (9")
  }

  const handleBlur = () => {
    if (value.replace(/\D/g, "").length <= 2) onChange("")
  }

  return (
    <input
      {...rest}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      maxLength={18}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  )
}
