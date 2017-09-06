const DOMParser = require('xmldom').DOMParser

/**
 * Create Document
 *
 * @param {string|Document} xml
 * @returns {Document} DOM Document
 */
function createDocument (xml) {
  if (typeof xml === 'object') return xml
  if (typeof xml !== 'string') throw new Error('xml must be a string or Document')
  xml = xml.replace(/xmlns="[\S]+"/, '')
  return new DOMParser().parseFromString(xml)
}

module.exports = {
  createDocument: createDocument
}
