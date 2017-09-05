const fs = require('fs')
const path = require('path')
const test = require('tape')
const write = require('write-json-file')
const load = require('load-json-file')
const wmts = require('./src/wmts')

// Utils
const testIn = (filename) => path.join(__dirname, 'test', 'in', filename)
const testOut = (filename) => path.join(__dirname, 'test', 'out', filename)

// XML Documents
const arcgis = {
  wmts: fs.readFileSync(testIn('wmts-arcgis.xml'), 'utf8'),
  error: fs.readFileSync(testIn('wmts-arcgis-error.xml'), 'utf8')
}
const mapbox = {
  wmts: fs.readFileSync(testIn('wmts-mapbox.xml'), 'utf8')
}

test('wmts -- ArcGIS Online', t => {
  const metadata = wmts(arcgis.error)

  // Service
  t.equal(metadata.service.type, null, 'service.type')
  t.equal(metadata.service.version, null, 'service.version')
  t.equal(metadata.service.title, null, 'service.title')

  // JSON
  if (process.env.REGEN) write.sync(testOut('wmts-arcgis-error.json'), metadata)
  t.deepEqual(metadata, load.sync(testOut('wmts-arcgis-error.json')), 'json')
  t.end()
})

test('wmts -- ArcGIS Online', t => {
  const metadata = wmts(arcgis.wmts)
  // Service
  t.equal(metadata.service.type, 'OGC WMTS', 'service.type')
  t.equal(metadata.service.version, '1.0.0', 'service.version')
  t.equal(metadata.service.title, 'World_Imagery', 'service.title')

  // Layer
  t.equal(metadata.layer.title, 'World_Imagery', 'layer.title')
  t.equal(metadata.layer.identifier, 'World_Imagery', 'layer.identifier')
  t.equal(metadata.layer.abstract, null, 'layer.abstract')
  t.equal(metadata.layer.format, 'image/jpeg', 'layer.format')
  t.equal(metadata.layer.minzoom, 0, 'layer.minzoom')
  t.equal(metadata.layer.maxzoom, 23, 'layer.maxzoom')
  t.deepEqual(metadata.layer.bbox, [-179.99999000000003, -85.00000000000003, 179.99999000000003, 85.0], 'layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['default028mm', 'GoogleMapsCompatible'], 'layer.tileMatrixSets')

  // URL
  t.equal(metadata.url.host, 'services.arcgisonline.com')
  t.equal(metadata.url.getTile, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/')
  t.equal(metadata.url.getCapabilities, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml')

  // JSON
  if (process.env.REGEN) write.sync(testOut('wmts-arcgis.json'), metadata)
  t.deepEqual(metadata, load.sync(testOut('wmts-arcgis.json')), 'json')
  t.end()
})

test('wmts -- Mapbox Studio', t => {
  const metadata = wmts(mapbox.wmts)
  // Service
  t.equal(metadata.service.type, 'OGC WMTS', 'service.type')
  t.equal(metadata.service.version, '1.0.0', 'service.version')
  t.equal(metadata.service.title, 'Mapbox', 'service.title')

  // Layer
  t.equal(metadata.layer.title, 'Satellite Streets', 'layer.title')
  t.equal(metadata.layer.identifier, 'ciy23jhla008n2soz34kg2p4u', 'layer.identifier')
  t.equal(metadata.layer.abstract, '© OSM, © DigitalGlobe', 'layer.abstract')
  t.equal(metadata.layer.format, 'image/jpeg', 'layer.format')
  t.equal(metadata.layer.minzoom, 0, 'layer.minzoom')
  t.equal(metadata.layer.maxzoom, 20, 'layer.maxzoom')
  t.deepEqual(metadata.layer.bbox, [-180, -85.051129, 179.976804, 85.051129], 'layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['GoogleMapsCompatible'], 'layer.tileMatrixSets')

  // URL
  t.equal(metadata.url.host, 'api.mapbox.com')
  t.equal(metadata.url.getTile, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ')
  t.equal(metadata.url.getCapabilities, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ')

  // JSON
  if (process.env.REGEN) write.sync(testOut('wmts-mapbox.json'), metadata)
  t.deepEqual(metadata, load.sync(testOut('wmts-mapbox.json')), 'json')
  t.end()
})
