import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import Icon from "@/components/ui/icon"

const TICKS =
  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 1px, transparent 1px 10px), repeating-linear-gradient(to bottom, rgba(255,255,255,0.85) 0 2px, transparent 2px 50px)"

export default function ScrollTapes() {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

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

  const scrollToPointer = (clientY: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * max, behavior: "instant" as ScrollBehavior })
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    scrollToPointer(e.clientY)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging) scrollToPointer(e.clientY)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    setDragging(false)
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{ ["--p" as string]: 0 }}
    >
      <div
        ref={trackRef}
        role="slider"
        aria-label="Прокрутка страницы"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        className={`pointer-events-auto absolute left-1 xl:left-4 top-[18vh] bottom-[12vh] w-12 touch-none select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 rounded-sm border border-white/60 bg-[#7A7FEE] shadow-md overflow-hidden"
          style={{ backgroundImage: TICKS, backgroundPosition: "right top", backgroundSize: "60% 100%", backgroundRepeat: "repeat-y" }}
        >
          <div className="absolute inset-x-0 top-0 bg-black/25" style={{ height: "calc(var(--p) * 100%)" }} />
        </div>
        <div
          className={`pointer-events-none absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7A7FEE] text-white shadow-lg transition-transform ${
            dragging ? "scale-110" : ""
          }`}
          style={{ top: "calc(var(--p) * 100%)" }}
        >
          <Icon name="Cog" size={22} style={{ transform: "rotate(calc(var(--p) * 900deg))" }} />
        </div>
      </div>
    </div>
  )
}
