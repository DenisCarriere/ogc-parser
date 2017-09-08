const path = require('path')
const fs = require('fs')

const wms = (filename) => path.join(__dirname, 'in', 'wms', filename)
const wmts = (filename) => path.join(__dirname, 'in', 'wmts', filename)

module.exports = {
  arcgis: {
    wmts: fs.readFileSync(wmts('arcgis-wmts.xml'), 'utf8'),
    wmtsError: fs.readFileSync(wmts('arcgis-wmts-error.xml'), 'utf8')
  },
  geoserver: {
    wmts: fs.readFileSync(wmts('geoserver-wmts.xml'), 'utf8')
  },
  mapbox: {
    wmts: fs.readFileSync(wmts('mapbox-wmts.xml'), 'utf8')
  },
  mapProxy: {
    wmtsKvp: fs.readFileSync(wmts('map-proxy-wmts-kvp.xml'), 'utf8'),
    wmtsRestful: fs.readFileSync(wmts('map-proxy-wmts-restful.xml'), 'utf8')
  },
  toporama: {
    wms: fs.readFileSync(wms('toporama-wms.xml'), 'utf8')
  },
  ogc: {
    wms100: fs.readFileSync(wms('ogc-wms-1.0.0.xml'), 'utf8'),
    wms110: fs.readFileSync(wms('ogc-wms-1.1.0.xml'), 'utf8'),
    wms111: fs.readFileSync(wms('ogc-wms-1.1.1.xml'), 'utf8'),
    wms130: fs.readFileSync(wms('ogc-wms-1.3.0.xml'), 'utf8'),
    wms130Exception: fs.readFileSync(wms('ogc-wms-1.3.0-exception.xml'), 'utf8')
  }
}
