const xpath = require('xpath')
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
 * @typedef {('1.0.0'|'1.3.0')} ServiceVersion
 */

/**
 * OGC Service
 *
 * @typedef {Object} Service
 * @property {ServiceType} type
 * @property {ServiceVersion} version
 * @property {string} title
 */

/**
 * Parse OGC Service
 *
 * @param {string|Document} xml
 * @returns {Service} OGC Service
 */
module.exports = function (xml) {
  const doc = createDocument(xml)
  const type = select('string(//ows:ServiceType)', doc, true)
  const version = select('string(//ows:ServiceTypeVersion)', doc, true)
  const title = select('string(//ows:Title)', doc, true)

  return {
    type: type || null,
    version: version || null,
    title: title || null
  }
}
