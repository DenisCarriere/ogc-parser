const xpath = require('xpath')
const URL = require('url')
const service = require('./service')
const createDocument = require('./utils').createDocument
const zoomLevels = require('./zoom-levels')

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
 * @typedef {'OGC WMTS'|'OGC WMS'} ServiceType
 */

/**
 * @typedef {'1.0.0'|'1.3.0'} ServiceVersion
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
 * @property {Format} format
 * @property {string[]} formats
 * @property {string} abstract
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
 * @property {string} abstract
 * @property {string} fees
 */

/**
 * WMTS Metadata.Layer.URL
 *
 * @typedef {Object} URL
 * @property {string} getCapabilities
 * @property {string} getTile
 * @property {string} resourceURL
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
  var southwest = select('string(//ows:WGS84BoundingBox//ows:LowerCorner)', node, true)
  var northeast = select('string(//ows:WGS84BoundingBox//ows:UpperCorner)', node, true)
  if (southwest && northeast) {
    southwest = southwest.split(' ')
    northeast = northeast.split(' ')
    return [Number(southwest[0]), Number(southwest[1]), Number(northeast[0]), Number(northeast[1])]
  }
  return null
}

/**
 * Parse Contents Layer
 *
 * @param {Document}
 * @returns {Layer} layer[]
 */
function layers(doc){
  const out=[];
  const layers = select('//Contents/Layer', doc);
  layers.forEach(l =>{
    out.push(layer(l));
  });
  return out;
}

/**
 * Parse Layer
 *
 * @param {Document} doc
 * @returns {Layer} layer
 */
function layer (doc) {
  const title = select('string(./ows:Title)', doc, true)
  const identifier = select('string(./ows:Identifier)', doc, true)
  const abstract = select('string(./ows:Abstract)', doc, true)
  const formats = select('./Format', doc).map(format => format.textContent)
  const bbox = selectBBox(doc)
  const zooms = zoomLevels(doc)
  const tileMatrixSets = zooms.tileMatrixSets
  const maxzoom = zooms.maxzoom
  const minzoom = zooms.minzoom
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
    minzoom: minzoom,
    maxzoom: maxzoom,
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
  var resourceURL = select('string(//ResourceURL/@template)', doc, true)
  const getTile = select('string(//ows:Operation[@name="GetTile"]//ows:Get/@xlink:href)', doc, true)
  var getCapabilities = select('string(//ows:Operation[@name="GetCapabilities"]//ows:Get/@xlink:href)', doc, true)
  if (!getCapabilities) getCapabilities = select('string(//ServiceMetadataURL/@xlink:href)', doc, true)
  const parse = URL.parse(getCapabilities)

  // Create Resource URL from KVP params
  var slippy = resourceURL
  if (resourceURL === '' && getTile) {
    const kvp = URL.parse(getTile)
    kvp.search = null
    kvp.query = {
      service: 'wmts',
      request: 'getTile',
      version: '1.0.0',
      layer: '{Layer}',
      style: '{Style}',
      tilematrixset: '{TileMatrixSet}',
      tilematrix: '{TileMatrix}',
      tilerow: '{TileRow}',
      tilecol: '{TileCol}',
      format: '{Format}'
    }
    slippy = URL.format(kvp).replace(/%7B/g, '{').replace(/%7D/g, '}')
  }
  return {
    slippy: slippy || null,
    resourceURL: resourceURL || null,
    getCapabilities: getCapabilities || null,
    getTile: getTile || null,
    host: parse.host
  }
}

/**
 * Parse Capabilities
 *
 * @param {string|Document} xml
 * @returns {Metadata} WMTS Metadata
 */
module.exports = function (xml) {
  const doc = createDocument(xml)
  return {
    service: service(doc),
    layer: layers(doc),
    url: url(doc)
  }
}
