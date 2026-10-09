import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useLocation } from "react-router-dom"
import Icon from "@/components/ui/icon"

function SpoolSvg() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: "rotate(calc(var(--p) * 1800deg))" }}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <path d="M12 6v4M17.2 15l-3.5-2M6.8 15l3.5-2" strokeWidth="1.6" />
    </svg>
  )
}

function PoleSvg() {
  return (
    <svg width="34" height="84" viewBox="0 0 34 84" fill="none" className="drop-shadow-lg">
      <rect x="15" y="14" width="4" height="62" fill="#7A7FEE" stroke="white" strokeWidth="1.2" />
      <path d="M15 24h4M15 34h4M15 44h4M15 54h4M15 64h4" stroke="white" strokeWidth="1.4" />
      <path d="M15 76h4l-2 7z" fill="white" />
      <path d="M5 12Q5 3 17 3Q29 3 29 12Z" fill="white" stroke="#7A7FEE" strokeWidth="1.2" />
      <rect x="4" y="11" width="26" height="5" rx="2" fill="#7A7FEE" stroke="white" strokeWidth="1.2" />
      <circle cx="17" cy="13.5" r="1" fill="white" />
    </svg>
  )
}

const TRACK = {
  className: "w-5 rounded-full border-2 border-white/80 bg-white/15 shadow-md",
}

const wave = (color: string) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 14' preserveAspectRatio='none'><path d='M0 7 Q5 0 10 7 T20 7 V14 H0 Z' fill='${color}'/></svg>")`

const BUBBLES = [
  { left: "20%", size: 4, duration: "3.2s", delay: "0s" },
  { left: "60%", size: 3, duration: "2.6s", delay: "0.8s" },
  { left: "40%", size: 5, duration: "3.8s", delay: "1.6s" },
  { left: "70%", size: 3, duration: "3s", delay: "2.2s" },
  { left: "30%", size: 3, duration: "2.8s", delay: "1.1s" },
]

const WAVE_FRONT = wave("%237A7FEE")
const WAVE_BACK = wave("%23A9ADF7")

const HANDLE_ICONS: Record<string, string> = {
  "/services": "HardHat",
  "/laboratory": "FlaskConical",
  "/scan-order": "ScanLine",
  "/equipment": "Wrench",
  "/certificates": "Award",
  "/contacts": "Phone",
}

function Handle({ pathname }: { pathname: string }) {
  if (pathname === "/print-order") return <SpoolSvg />
  const name = HANDLE_ICONS[pathname]
  if (name) return <Icon name={name} fallback="Cog" size={22} />
  return <Icon name="Cog" size={22} style={{ transform: "rotate(calc(var(--p) * 900deg))" }} />
}

export default function ScrollTapes() {
  const { pathname } = useLocation()
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
    const ratio = Math.min(1, Math.max(0, 1 - (clientY - rect.top) / rect.height))
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
          className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden ${TRACK.className}`}
        >
          <div className="absolute inset-x-0 bottom-0" style={{ height: "calc(var(--p) * 100%)" }}>
            <div className="absolute inset-x-0 top-0 bottom-0 bg-[#7A7FEE]" />
            {BUBBLES.map((b, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white/70 animate-[bubble-rise_linear_infinite]"
                style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.duration, animationDelay: b.delay }}
              />
            ))}
            <div
              className="absolute inset-x-0 -top-[7px] h-[14px] animate-[water-wave_2.4s_linear_infinite] [animation-direction:reverse]"
              style={{ backgroundImage: WAVE_BACK, backgroundSize: "20px 100%", backgroundRepeat: "repeat-x", opacity: "min(1, calc(var(--p) * 40))" }}
            />
            <div
              className="absolute inset-x-0 -top-[7px] h-[14px] animate-[water-wave_1.4s_linear_infinite]"
              style={{ backgroundImage: WAVE_FRONT, backgroundSize: "20px 100%", backgroundRepeat: "repeat-x", opacity: "min(1, calc(var(--p) * 40))" }}
            />
          </div>
        </div>
        {pathname === "/geodesy" ? (
          <div
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 text-white transition-transform ${
              dragging ? "scale-110" : ""
            }`}
            style={{ top: "calc((1 - var(--p)) * 100%)", marginTop: "-42px" }}
          >
            <PoleSvg />
          </div>
        ) : (
          <div
            className={`pointer-events-none absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7A7FEE] text-white shadow-lg transition-transform ${
              dragging ? "scale-110" : ""
            }`}
            style={{ top: "calc((1 - var(--p)) * 100%)" }}
          >
            <Handle pathname={pathname} />
          </div>
        )}
      </div>
    </div>
  )
}
