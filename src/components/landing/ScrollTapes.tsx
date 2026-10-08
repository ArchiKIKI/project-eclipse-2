import { useEffect, useRef } from "react"
import Icon from "@/components/ui/icon"

const TICKS =
  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 1px, transparent 1px 10px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 2px, transparent 2px 50px)"

export default function ScrollTapes() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      rootRef.current?.style.setProperty("--p", String(progress))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{ ["--p" as string]: 0 }}
    >
      <div className="absolute left-3 xl:left-6 top-[18vh] bottom-[12vh] w-9">
        <div
          className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 rounded-sm border border-white/60 bg-[#7A7FEE] shadow-md overflow-hidden"
          style={{ backgroundImage: TICKS, backgroundPosition: "right top", backgroundSize: "60% 100%", backgroundRepeat: "repeat-y" }}
        >
          <div className="absolute inset-x-0 top-0 bg-black/25" style={{ height: "calc(var(--p) * 100%)" }} />
        </div>
        <div
          className="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7A7FEE] text-white shadow-lg"
          style={{ top: "calc(var(--p) * 100%)" }}
        >
          <Icon name="Cog" size={22} style={{ transform: "rotate(calc(var(--p) * 900deg))" }} />
        </div>
      </div>
    </div>
  )
}
