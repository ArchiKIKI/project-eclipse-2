import { createElement, useEffect, useState } from "react"

export default function ScanModelViewer() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    import("@google/model-viewer").then(() => setReady(true))
  }, [])

  return (
    <div className="card p-6 md:p-8 max-w-4xl mb-8">
      <div className="section-label">Результат сканирования</div>
      <div className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1a1a1a] h-[320px] md:h-[420px]">
        {ready ? (
          createElement("model-viewer", {
            src: "/models/scan-sample.glb",
            alt: "Отсканированная 3D-модель моста",
            "camera-controls": true,
            "auto-rotate": true,
            "touch-action": "pan-y",
            "shadow-intensity": "1",
            "camera-orbit": "-35deg 72deg auto",
            "interaction-prompt": "none",
            style: { width: "100%", height: "100%", "--poster-color": "transparent" },
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">Загрузка модели...</div>
        )}
      </div>
    </div>
  )
}
