import { useCallback, useEffect, useRef, useState } from "react"
import Icon from "@/components/ui/icon"

const TICKS =
  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 1px, transparent 1px 10px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 2px, transparent 2px 50px)"

const OFFSET = 90

interface Mark {
  label: string
  target: number
  position: number
}

export default function ScrollTapes() {
  const rootRef = useRef<HTMLDivElement>(null)
  const marksRef = useRef<Mark[]>([])
  const [marks, setMarks] = useState<Mark[]>([])
  const [active, setActive] = useState(0)

  const collect = useCallback(() => {
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    if (max <= 0) {
      marksRef.current = []
      setMarks([])
      return
    }
    const found: Mark[] = []
    document.querySelectorAll<HTMLElement>("main h1, main h2, main h3").forEach((el) => {
      const label = el.textContent?.replace(/\s+/g, " ").trim()
      if (!label || el.offsetParent === null) return
      const top = el.getBoundingClientRect().top + window.scrollY
      const target = Math.min(max, Math.max(0, top - OFFSET))
      const prev = found[found.length - 1]
      if (prev && Math.abs(prev.target - target) < max * 0.025) return
      found.push({ label, target, position: target / max })
    })
    marksRef.current = found
    setMarks(found)
  }, [])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      rootRef.current?.style.setProperty("--p", String(progress))
      let idx = 0
      marksRef.current.forEach((m, i) => {
        if (window.scrollY >= m.target - 20) idx = i
      })
      setActive(idx)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    const onLayout = () => {
      collect()
      onScroll()
    }

    onLayout()
    const observer = new ResizeObserver(onLayout)
    observer.observe(document.body)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onLayout)
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onLayout)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [collect])

  const goTo = (target: number) => window.scrollTo({ top: target, behavior: "smooth" })

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{ ["--p" as string]: 0 }}
    >
      <div className="absolute left-3 xl:left-6 top-[18vh] bottom-[12vh] w-9">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 rounded-sm border border-white/60 bg-[#7A7FEE] shadow-md overflow-hidden"
          style={{ backgroundImage: TICKS, backgroundPosition: "right top", backgroundSize: "60% 100%", backgroundRepeat: "repeat-y" }}
        >
          <div className="absolute inset-x-0 top-0 bg-black/25" style={{ height: "calc(var(--p) * 100%)" }} />
        </div>

        {marks.map((m, i) => (
          <button
            key={`${m.target}-${i}`}
            type="button"
            onClick={() => goTo(m.target)}
            aria-label={m.label}
            className="group pointer-events-auto absolute left-1/2 z-10 flex h-5 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ top: `${m.position * 100}%` }}
          >
            <span
              className={`block h-2.5 w-2.5 rotate-45 border border-white transition-all group-hover:scale-150 ${
                i === active ? "bg-white" : "bg-[#3F43A8]"
              }`}
            />
            <span className="pointer-events-none absolute left-full ml-3 max-w-[240px] translate-x-[-4px] whitespace-nowrap overflow-hidden text-ellipsis rounded-md border border-[#7A7FEE] bg-[#111111] px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition-all group-hover:translate-x-0 group-hover:opacity-100">
              {m.label}
            </span>
          </button>
        ))}

        <div
          aria-hidden="true"
          className="absolute left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7A7FEE] text-white shadow-lg"
          style={{ top: "calc(var(--p) * 100%)" }}
        >
          <Icon name="Cog" size={22} style={{ transform: "rotate(calc(var(--p) * 900deg))" }} />
        </div>
      </div>
    </div>
  )
}
