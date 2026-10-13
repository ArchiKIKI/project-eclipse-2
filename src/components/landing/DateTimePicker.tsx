import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Icon from "@/components/ui/icon"

const times = Array.from({ length: 21 }, (_, i) => {
  const h = 9 + Math.floor(i / 2)
  const m = i % 2 === 0 ? "00" : "30"
  return `${String(h).padStart(2, "0")}:${m}`
})

interface Props {
  value: string
  onChange: (value: string) => void
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!value) {
      setDate(undefined)
      setTime("")
    }
  }, [value])

  const update = (d?: Date, t?: string) => {
    if (d && t) onChange(`${format(d, "dd.MM.yyyy")} в ${t}`)
    else onChange("")
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#7A7FEE]"
        >
          <span className={value ? "text-black dark:text-white" : "text-gray-400"}>
            {value || "Выберите дату и время"}
          </span>
          <Icon name="CalendarDays" size={18} className="text-gray-500" />
        </button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-auto max-w-[95vw] max-h-[95vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 opacity-100">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="text-black dark:text-white">Дата и время визита</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          locale={ru}
          weekStartsOn={1}
          selected={date}
          onSelect={(d) => {
            setDate(d)
            update(d, time)
          }}
          disabled={{ before: today }}
          className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white"
          classNames={{
            day_selected:
              "bg-[#7A7FEE] text-white hover:bg-[#7A7FEE] hover:text-white focus:bg-[#7A7FEE] focus:text-white",
            day_today: "border border-[#7A7FEE] text-black dark:text-white",
          }}
        />
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <div className="text-sm font-medium mb-2 text-black dark:text-white">Время</div>
          <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTime(t)
                  update(date, t)
                }}
                className={`px-2 py-1.5 rounded-md text-sm border transition-colors ${
                  time === t
                    ? "bg-[#7A7FEE] text-white border-[#7A7FEE]"
                    : "border-gray-300 dark:border-gray-700 text-black dark:text-white hover:border-[#7A7FEE]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!value}
            onClick={() => setOpen(false)}
            className="btn-primary w-full mt-3 disabled:opacity-60"
          >
            Готово
          </button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  )
}