type BBox = [number, number, number, number]

interface Layer {
  title: string
  identifier: string
  format: string
  abstract: string
  resourceURL: string
  minzoom: string
  maxzoom: string
  bbox: BBox
  tileMatrixSets: string[]
}

interface Service {
  type: string
  version: string
  title: string
}

interface URL {
  protocol: string
  port: string
  host: string
  auth: string
  getCapabilities: string
  getTile: string
  query: string
}

interface Metadata {
  layer: Layer,
  service: Service,
  url: URL
}

export function wmts (xml: string): Metadata
