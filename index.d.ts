type BBox = [number, number, number, number]
type Format = 'jpg' | 'png'

interface Layer {
  title: string
  identifier: string
  format: Format
  formats: string[]
  abstract: string
  minzoom: number
  maxzoom: number
  bbox: BBox
}

interface Service {
  type: string
  version: string
  title: string
  abstract: string
  fees: string
}

interface Url {
  getCapabilities: string
  slippy: string
  host: string
}

interface WMS {
  service: {
    type: 'OGC WMS'
    version: '1.0.0' | '1.1.0' | '1.1.1' | '1.3.0'
    title: string
  }
  layer: Layer,
  url: WMSUrl
}

interface WMSUrl extends Url {
  onlineResource: string
}

interface WMTS {
  service: {
    type: 'OGC WMTS'
    version: '1.0.0'
    title: string
    abstract: string
    fees: string
  }
  layer: WMTSLayer,
  url: WMTSUrl
}

interface WMTSUrl extends Url {
  getTile: string
  resourceURL: string
}

interface WMTSLayer extends Layer {
  tileMatrixSets: string[]
}

/**
 * Parse OGC WMTS Service Metadata
 */
export function wmts(xml: string | Document): WMTS

/**
 * Parse OGC WMS Service Metadata
 */
export function wms(xml: string | Document): WMS

/**
 * Parse OGC Service Information
 */
export function service(xml: string | Document): Service
