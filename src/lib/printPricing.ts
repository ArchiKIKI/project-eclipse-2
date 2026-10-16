export interface PrintMaterial {
  id: string
  name: string
  group: string
  pricePerGram: number
  density: number
}

export const printMaterials: PrintMaterial[] = [
  { id: "pla", name: "PLA", group: "PLA", pricePerGram: 12, density: 1.24 },
  { id: "pla-plus", name: "PLA+", group: "PLA", pricePerGram: 13, density: 1.24 },
  { id: "pla-matte", name: "PLA матовый", group: "PLA", pricePerGram: 14, density: 1.24 },
  { id: "pla-silk", name: "PLA Silk (шёлк)", group: "PLA", pricePerGram: 15, density: 1.24 },
  { id: "pla-cf", name: "PLA-CF (карбон)", group: "PLA", pricePerGram: 25, density: 1.3 },
  { id: "petg", name: "PETG", group: "PETG", pricePerGram: 15, density: 1.27 },
  { id: "petg-cf", name: "PETG-CF (карбон)", group: "PETG", pricePerGram: 25, density: 1.3 },
  { id: "abs", name: "ABS", group: "ABS", pricePerGram: 15, density: 1.04 },
  { id: "pc", name: "PC (поликарбонат)", group: "PC", pricePerGram: 30, density: 1.2 },
  { id: "tpu95", name: "TPU 95A", group: "TPU", pricePerGram: 25, density: 1.21 },
  { id: "tpu85", name: "TPU 85A", group: "TPU", pricePerGram: 30, density: 1.2 },
]

export const PRINTER_COST = 80000
export const PRINTER_LIFE_MONTHS = 36
export const MAINTENANCE_PER_MONTH = 3000
export const WORK_HOURS_PER_MONTH = 300
export const ELECTRICITY_PER_HOUR = 2

export const MACHINE_HOUR_RATE = Math.round(
  (PRINTER_COST / PRINTER_LIFE_MONTHS + MAINTENANCE_PER_MONTH) / WORK_HOURS_PER_MONTH + ELECTRICITY_PER_HOUR
)

export const FLOW_MM3_PER_SEC = 10
export const SETUP_HOURS = 0.25

export const SCAN_VISIT_PRICE = 8000
export const MAX_BUILD_MM = [270, 270, 256]
