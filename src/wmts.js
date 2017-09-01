const xpath = require('xpath')
const URL = require('url')
const DOMParser = require('xmldom').DOMParser

// Use OGC namespace
const select = xpath.useNamespaces({
  'ows': 'http://www.opengis.net/ows/1.1',
  'xlink': 'http://www.w3.org/1999/xlink'
})

/**
 * BBox
 *
 * @typedef {[number, number, number, number]} BBox
 */

/**
 * WMTS Metadata
 *
 * @typedef {Object} Metadata
 * @property {Layer} layer
 * @property {Service} service
 * @property {URL} url
 */

/**
 * WMTS Metadata.Layer
 *
 * @typedef {Object} Layer
 * @property {string} title
 * @property {string} identifier
 * @property {string} format
 * @property {string} abstract
 * @property {string} resourceURL
 * @property {number} minzoom
 * @property {number} maxzoom
 * @property {BBox} bbox
 * @property {string[]} tileMatrixSets
 */

/**
 * WMTS Metadata.Service
 *
 * @typedef {Object} Service
 * @property {string} type
 * @property {string} version
 * @property {string} title
 */

 /**
 * WMTS Metadata.Layer.URL
 *
 * @typedef {Object} URL
 * @property {string} protocol
 * @property {string} port
 * @property {string} host
 * @property {string} auth
 * @property {string} getCapabilities
 * @property {string} getTile
 * @property {string} query
 */

/**
 * Select Zooms
 *
 * @param {Document} node
 * @returns {{minzoom: number, maxzoom: number}} Zooms
 */
function selectZooms (node) {
  const identifiers = select('//TileMatrixSet/TileMatrix/ows:Identifier', node)
  let minzoom
  let maxzoom
  for (const identifier of identifiers) {
    const zoom = Number(identifier.textContent)
    if (zoom < minzoom || minzoom === undefined) minzoom = zoom
    if (zoom > maxzoom || maxzoom === undefined) maxzoom = zoom
  }
  return {
    minzoom: minzoom,
    maxzoom: maxzoom
  }
}

/**
 * Select BBox
 *
 * @param {Document} node
 * @returns {BBox} BBox
 */
function selectBBox (node) {
  var southwest = select('string(//ows:WGS84BoundingBox//ows:LowerCorner)', node, true)
  var northeast = select('string(//ows:WGS84BoundingBox//ows:UpperCorner)', node, true)
  if (southwest && northeast) {
    southwest = southwest.split(' ')
    northeast = northeast.split(' ')
    return [Number(southwest[0]), Number(southwest[1]), Number(northeast[0]), Number(northeast[1])]
  }
}

/**
 * Parse Layer
 *
 * @param {Document} doc
 * @returns {Layer} layer
 */
function layer (doc) {
  const title = select('string(//Layer/ows:Title)', doc, true)
  const identifier = select('string(//Layer/ows:Identifier)', doc, true)
  const abstract = select('string(//Layer/ows:Abstract)', doc, true)
  const format = select('string(//Layer/Format)', doc, true)
  const tileMatrixSets = select('//Layer/TileMatrixSetLink/TileMatrixSet', doc).map(tileMatrixSet => tileMatrixSet.textContent)
  const bbox = selectBBox(doc)
  const zooms = selectZooms(doc)
  return {
    title: title,
    abstract: abstract,
    identifier: identifier,
    format: format,
    bbox: bbox,
    minzoom: zooms.minzoom,
    maxzoom: zooms.maxzoom,
    tileMatrixSets: tileMatrixSets
  }
}

/**
 * Parse URL
 *
 * @param {Document} doc
 * @returns {URL} url
 */
function url (doc) {
  const getTile = select('string(//ows:Operation[@name="GetTile"]//ows:Get/@xlink:href)', doc, true)
  let getCapabilities = select('string(//ows:Operation[@name="GetCapabilities"]//ows:Get/@xlink:href)', doc, true)
  if (!getCapabilities) getCapabilities = select('string(//ServiceMetadataURL/@xlink:href)', doc, true)
  const parse = URL.parse(getCapabilities)

  return {
    protocol: parse.protocol,
    port: parse.port,
    host: parse.host,
    auth: parse.auth,
    getCapabilities: getCapabilities,
    getTile: getTile,
    query: parse.query
  }
}

/**
 * Parse Service
 *
 * @param {Document} doc
 * @returns {Service} service
 */
function service (doc) {
  const type = select('string(//ows:ServiceType)', doc, true)
  const version = select('string(//ows:ServiceTypeVersion)', doc, true)
  const title = select('string(//ows:Title)', doc, true)
  return {
    type: type,
    version: version,
    title: title
  }
}

/**
 * Parse Capabilities
 *
 * @param {string} xml
 * @returns {Metadata} WMTS Metadata
 */
module.exports = function (xml) {
  xml = xml.replace(/xmlns="[\S]+"/, '')
  const doc = new DOMParser().parseFromString(xml)
  return {
    service: service(doc),
    layer: layer(doc),
    url: url(doc)
  }
}
