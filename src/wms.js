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
 * @property {string} format
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
 * @param {Document} node
 * @returns {BBox} BBox
 */
function selectBBox (node) {
  // <LatLonBoundingBox minx="-141" miny="41" maxx="-52" maxy="84" />
  const west = select('string(//LatLonBoundingBox/@minx)', node, true)
  const south = select('string(//LatLonBoundingBox/@miny)', node, true)
  const east = select('string(//LatLonBoundingBox/@maxx)', node, true)
  const north = select('string(//LatLonBoundingBox/@maxy)', node, true)

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
  const format = select('string(//GetMap/Format)', doc, true)
  const bbox = selectBBox(doc)

  return {
    title: title || null,
    abstract: abstract || null,
    identifier: identifier || null,
    format: format || null,
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
  const url = URL.parse(onlineResource)
  const version = service(doc).version

  // Create Slippy URL
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
  const slippy = URL.format(url).replace(/%7B/g, '{').replace(/%7D/g, '}')

  // Create RESTful GetCapabilities
  url.query = {
    service: 'WMS',
    request: 'GetCapabilities',
    version: version
  }
  const getCapabilities = URL.format(url).replace(/%7B/g, '{').replace(/%7D/g, '}')

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
