const test = require('tape')
const zoomLevels = require('./zoom-levels')
const xml = require('../test/xml')

test('zoom-levels', t => {
  console.log('arcgis', zoomLevels(xml.arcgis.wmts))
  console.log('mapbox', zoomLevels(xml.mapbox.wmts))
  console.log('geoserver', zoomLevels(xml.geoserver.wmts))
  console.log('mapProxy', zoomLevels(xml.mapProxy.wmtsKvp))
  console.log('mapProxy', zoomLevels(xml.mapProxy.wmtsRestful))
  t.end()
})
