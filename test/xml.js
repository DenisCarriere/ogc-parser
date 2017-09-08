const path = require('path')
const fs = require('fs')

const folder = (filename) => path.join(__dirname, 'in', filename)

module.exports = {
  arcgis: {
    wmts: fs.readFileSync(folder('arcgis-wmts.xml'), 'utf8'),
    wmtsError: fs.readFileSync(folder('arcgis-wmts-error.xml'), 'utf8')
  },
  geoserver: {
    wmts: fs.readFileSync(folder('geoserver-wmts.xml'), 'utf8')
  },
  mapbox: {
    wmts: fs.readFileSync(folder('mapbox-wmts.xml'), 'utf8')
  },
  toporama: {
    wms: fs.readFileSync(folder('toporama-wms.xml'), 'utf8')
  },
  mapProxy: {
    wmtsKvp: fs.readFileSync(folder('mapProxy-wmtsKvp.xml'), 'utf8'),
    wmtsRestful: fs.readFileSync(folder('mapProxy-wmtsRestful.xml'), 'utf8')
  }
}
