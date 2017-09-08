const xpath = require('xpath')
const URL = require('url')
const service = require('./service')
const createDocument = require('./utils').createDocument

// Use OGC namespace
const select = xpath.useNamespaces({
  'ows': 'http://www.opengis.net/ows/1.1',
  'xlink': 'http://www.w3.org/1999/xlink'
})

/**
 * @typedef {'png'|'jpg'} Format
 */

/**
 * @typedef {[number, number, number, number]} BBox
 */

/**
 * @typedef {('OGC WMTS'|'OGC WMS')} ServiceType
 */

/**
 * @typedef {('1.0.0'|'1.3.0'|'1.1.0'|'1.1.1')} ServiceVersion
 */

/**
 * WMS Metadata
 *
 * @typedef {Object} Metadata
 * @property {Layer} layer
 * @property {Service} service
 * @property {URL} url
 */

/**
 * WMS Metadata.Layer
 *
 * @typedef {Object} Layer
 * @property {string} title
 * @property {string} identifier
 * @property {Format} format
 * @property {string[]} formats
 * @property {string} abstract
 * @property {number} minzoom
 * @property {number} maxzoom
 * @property {BBox} bbox
 */

/**
 * WMS Metadata.Service
 *
 * @typedef {Object} Service
 * @property {string} type
 * @property {string} version
 * @property {string} title
 */

 /**
 * WMS Metadata.Layer.URL
 *
 * @typedef {Object} URL
 * @property {string} onlineResource
 * @property {string} getCapabilities
 * @property {string} slippy
 * @property {string} host
 */

/**
 * Select BBox
 *
 * @param {Document} doc
 * @returns {BBox} BBox
 */
function selectBBox (doc) {
  var west
  var south
  var east
  var north

  // WMS 1.1
  // <LatLonBoundingBox minx="-141" miny="41" maxx="-52" maxy="84" />
  if (select('//LatLonBoundingBox', doc).length) {
    west = select('string(//LatLonBoundingBox/@minx)', doc, true)
    south = select('string(//LatLonBoundingBox/@miny)', doc, true)
    east = select('string(//LatLonBoundingBox/@maxx)', doc, true)
    north = select('string(//LatLonBoundingBox/@maxy)', doc, true)
  // WMS 1.3
  // <BoundingBox CRS="CRS:84" minx="-71.63" miny="41.75" maxx="-70.78" maxy="42.90" resx="0.01" resy="0.01"/>
  } else if (select('//BoundingBox', doc).length) {
    west = select('string(//BoundingBox[@CRS="CRS:84"]/@minx)', doc, true)
    south = select('string(//BoundingBox[@CRS="CRS:84"]/@miny)', doc, true)
    east = select('string(//BoundingBox[@CRS="CRS:84"]/@maxx)', doc, true)
    north = select('string(//BoundingBox[@CRS="CRS:84"]/@maxy)', doc, true)
  }

  if (south && west && north && east) {
    return [Number(west), Number(south), Number(east), Number(north)]
  }
  return null
}

/**
 * Parse Layer
 *
 * @param {Document} doc
 * @returns {Layer} layer
 */
function layer (doc) {
  const title = select('string(//Service/Title)', doc, true)
  const identifier = select('string(//Layer/Name)', doc, true)
  const abstract = select('string(//Service/Abstract)', doc, true)
  const bbox = selectBBox(doc)

  // WMS 1.1 & 1.3
  const formats = select('//GetMap/Format', doc).map(format => format.textContent)

  // WMS 1.0
  if (select('//Format/PNG', doc, true)) formats.push('image/png')
  if (select('//Format/JPEG', doc, true)) formats.push('image/jpeg')

  var format
  if (formats.indexOf('image/png') !== -1) format = 'png'
  else if (formats.indexOf('image/jpeg') !== -1) format = 'jpg'

  return {
    title: title || null,
    abstract: abstract || null,
    identifier: identifier || null,
    format: format || null,
    formats: formats,
    bbox: bbox,
    minzoom: 0,
    maxzoom: 19
  }
}

/**
 * Parse URL
 *
 * @param {Document} doc
 * @returns {URL} url
 */
function url (doc) {
  const onlineResource = select('string(//OnlineResource/@xlink:href)', doc, true)
  const version = service(doc).version
  const url = URL.parse(onlineResource)

  // Create Slippy URL
  var slippy
  var getCapabilities
  if (onlineResource) {
    url.search = null
    url.query = {
      service: 'WMS',
      request: 'GetMap',
      version: version,
      layers: '{Layer}',
      transparent: 'false',
      format: '{format}',
      height: '{height}',
      width: '{width}',
      srs: '{srs}',
      bbox: '{bbox}'
    }
    slippy = URL.format(url).replace(/%7B/g, '{').replace(/%7D/g, '}')

    // Create RESTful GetCapabilities
    url.query = {
      service: 'WMS',
      request: 'GetCapabilities',
      version: version
    }
    getCapabilities = URL.format(url).replace(/%7B/g, '{').replace(/%7D/g, '}')
  }
  return {
    slippy: slippy || null,
    onlineResource: onlineResource || null,
    getCapabilities: getCapabilities || null,
    host: url.host
  }
}

/**
 * Parse Capabilities
 *
 * @param {string|Document} xml
 * @returns {Metadata} WMS Metadata
 */
module.exports = function (xml) {
  const doc = createDocument(xml)
  return {
    service: service(doc),
    layer: layer(doc),
    url: url(doc)
  }
}
