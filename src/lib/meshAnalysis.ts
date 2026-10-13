export interface MeshStats {
  volumeMm3: number
  areaMm2: number
  size: [number, number, number]
}

type Tri = [number, number, number, number, number, number, number, number, number]

function compute(tris: Tri[]): MeshStats {
  let vol = 0
  let area = 0
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const t of tris) {
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = t
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6
    const ux = bx - ax, uy = by - ay, uz = bz - az
    const vx = cx - ax, vy = cy - ay, vz = cz - az
    const nx = uy * vz - uz * vy
    const ny = uz * vx - ux * vz
    const nz = ux * vy - uy * vx
    area += Math.sqrt(nx * nx + ny * ny + nz * nz) / 2
    for (let i = 0; i < 9; i += 3) {
      for (let k = 0; k < 3; k++) {
        const v = t[i + k]
        if (v < min[k]) min[k] = v
        if (v > max[k]) max[k] = v
      }
    }
  }
  if (!tris.length) throw new Error("empty")
  return {
    volumeMm3: Math.abs(vol),
    areaMm2: area,
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
  }
}

function parseStl(buf: ArrayBuffer): Tri[] {
  const view = new DataView(buf)
  if (buf.byteLength > 84) {
    const n = view.getUint32(80, true)
    if (84 + n * 50 === buf.byteLength) {
      const tris: Tri[] = []
      for (let i = 0; i < n; i++) {
        const o = 84 + i * 50 + 12
        const t = [] as unknown as Tri
        for (let k = 0; k < 9; k++) t[k] = view.getFloat32(o + k * 4, true)
        tris.push(t)
      }
      return tris
    }
  }
  const text = new TextDecoder().decode(buf)
  const re = /vertex\s+(\S+)\s+(\S+)\s+(\S+)/g
  const pts: number[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) pts.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]))
  const tris: Tri[] = []
  for (let i = 0; i + 8 < pts.length; i += 9) tris.push(pts.slice(i, i + 9) as Tri)
  return tris
}

function parseObj(buf: ArrayBuffer): Tri[] {
  const lines = new TextDecoder().decode(buf).split(/\r?\n/)
  const verts: number[][] = []
  const tris: Tri[] = []
  for (const line of lines) {
    if (line.startsWith("v ")) {
      const p = line.trim().split(/\s+/).slice(1, 4).map(Number)
      verts.push(p)
    } else if (line.startsWith("f ")) {
      const idx = line
        .trim()
        .split(/\s+/)
        .slice(1)
        .map((s) => {
          const i = parseInt(s.split("/")[0], 10)
          return i < 0 ? verts.length + i : i - 1
        })
      for (let i = 1; i + 1 < idx.length; i++) {
        const a = verts[idx[0]], b = verts[idx[i]], c = verts[idx[i + 1]]
        if (a && b && c) tris.push([...a, ...b, ...c] as Tri)
      }
    }
  }
  return tris
}

export async function analyzeModel(file: File): Promise<MeshStats> {
  const buf = await file.arrayBuffer()
  const ext = file.name.split(".").pop()?.toLowerCase()
  const tris = ext === "obj" ? parseObj(buf) : parseStl(buf)
  return compute(tris)
}
