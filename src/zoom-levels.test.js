const test = require('tape')
const zoomLevels = require('./zoom-levels')
const xml = require('../test/xml')

test('wms', t => {
  const zooms = zoomLevels(xml.arcgis.wmts)
  t.equal(zooms.maxzoom, 18, 'maxzoom')
  t.equal(zooms.minzoom, 0, 'minzoom')
  t.deepEqual(zooms.tileMatrixSets, ['default028mm', 'GoogleMapsCompatible'], 'tileMatrixSets')
  t.end()
})
