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
  className: "w-5 rounded-b-full rounded-t-md border-2 border-white/80 bg-white/15 shadow-md",
  fill: "bg-[#7A7FEE]",
}

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
          className={`pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 overflow-hidden ${TRACK.className}`}
        >
          <div className={`absolute inset-x-0 top-0 ${TRACK.fill}`} style={{ height: "calc(var(--p) * 100%)" }} />
        </div>
        {pathname === "/geodesy" ? (
          <div
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 text-white transition-transform ${
              dragging ? "scale-110" : ""
            }`}
            style={{ top: "calc(var(--p) * 100%)", marginTop: "-42px" }}
          >
            <PoleSvg />
          </div>
        ) : (
          <div
            className={`pointer-events-none absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7A7FEE] text-white shadow-lg transition-transform ${
              dragging ? "scale-110" : ""
            }`}
            style={{ top: "calc(var(--p) * 100%)" }}
          >
            <Handle pathname={pathname} />
          </div>
        )}
      </div>
    </div>
  )
}
