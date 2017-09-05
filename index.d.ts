type BBox = [number, number, number, number]

interface Layer {
  title: string
  identifier: string
  format: string
  abstract: string
  resourceURL: string
  minzoom: number
  maxzoom: number
  bbox: BBox
  tileMatrixSets: string[]
}

interface Service {
  version: string
  type: string
  title: string
}

interface WMTS extends Service {
  type: 'OGC WMTS'
  version: '1.0.0'
}

interface WMS extends Service {
  type: 'OGC WMS'
  version: '1.3.0'
}

interface URL {
  getCapabilities: string
  getTile: string
  protocol: string
  port: number
  host: string
  auth: string
  query: string
}

interface Metadata<T extends Service> {
  layer: Layer,
  service: T,
  url: URL
}

export function wmts (xml: string): Metadata<WMTS>
