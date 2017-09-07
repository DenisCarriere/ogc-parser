const path = require('path')
const test = require('tape')
const write = require('write-json-file')
const load = require('load-json-file')
const createDocument = require('./src/utils').createDocument
const xml = require('./test/xml')
const wmts = require('./').wmts

// Utils
const out = (filename) => path.join(__dirname, 'test', 'out', filename)

test('ogc-parser -- providers', t => {
  for (const provider of Object.keys(xml)) {
    for (const service of Object.keys(xml[provider])) {
      if (service.match(/wmts/i)) {
        const metadata = wmts(xml[provider][service])
        const name = `${provider}-${service}.json`
        if (process.env.REGEN) write.sync(out(name), metadata)
        t.deepEqual(metadata, load.sync(out(name)), 'json')
      }
    }
  }
  t.end()
})

test('wmts -- ArcGIS Online', t => {
  const metadata = wmts(xml.arcgis.wmts)
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
  t.equal(metadata.layer.maxzoom, 18, 'layer.maxzoom')
  t.deepEqual(metadata.layer.bbox, [-179.99999000000003, -85.00000000000003, 179.99999000000003, 85.0], 'layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['default028mm', 'GoogleMapsCompatible'], 'layer.tileMatrixSets')

  // URL
  t.equal(metadata.url.resourceURL, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg')
  t.equal(metadata.url.getTile, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/')
  t.equal(metadata.url.getCapabilities, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml')
  t.equal(metadata.url.host, 'services.arcgisonline.com')
  t.end()
})

test('wmts -- Mapbox Studio', t => {
  const metadata = wmts(xml.mapbox.wmts)
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
  t.equal(metadata.url.resourceURL, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/tiles/{TileMatrix}/{TileCol}/{TileRow}?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ')
  t.equal(metadata.url.getTile, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ')
  t.equal(metadata.url.getCapabilities, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ')
  t.equal(metadata.url.host, 'api.mapbox.com')
  t.end()
})

test('utils', t => {
  const doc = createDocument(xml.mapbox.wmts)
  t.assert(createDocument(doc), 'add Document to createDocument')
  t.throws(() => createDocument(123), /xml must be a string or Document/, 'xml must be a string or Document')
  t.end()
})
