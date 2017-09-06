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
  type: 'OGC WMTS' | 'OGC WMS'
  version: '1.3.0' | '1.0.0'
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
  resourceURL: string
  host: string
}

interface Metadata<T extends Service> {
  layer: Layer,
  service: T,
  url: URL
}

/**
 * Parse OGC WMTS Service Metadata
 */
export function wmts (xml: string | Document): Metadata<WMTS>

/**
 * Parse OGC Service Information
 */
export function service (xml: string | Document): Service
