export interface PrintMaterial {
  id: string
  name: string
  pricePerGram: number
  density: number
}

export const printMaterials: PrintMaterial[] = [
  { id: "pla", name: "PLA пластик", pricePerGram: 12, density: 1.24 },
  { id: "abs", name: "ABS пластик", pricePerGram: 15, density: 1.04 },
  { id: "petg", name: "PETG пластик", pricePerGram: 15, density: 1.27 },
  { id: "pa", name: "Нейлон (PA)", pricePerGram: 30, density: 1.14 },
]

export const MIN_PRINT_ORDER = 500
export const SCAN_VISIT_PRICE = 8000
export const MAX_BUILD_MM = [270, 270, 256]
