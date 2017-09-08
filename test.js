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
  Object.keys(xml).forEach(provider => {
    Object.keys(xml[provider]).forEach(service => {
      if (service.match(/wmts/i)) {
        const metadata = wmts(xml[provider][service])
        const name = `${provider}-${service}.json`
        if (process.env.REGEN) write.sync(out(name), metadata)
        t.deepEqual(metadata, load.sync(out(name)), 'json')
      }
    })
  })
  t.end()
})

test('wmts -- ArcGIS Online', t => {
  const metadata = wmts(xml.arcgis.wmts)
  // Service
  t.equal(metadata.service.type, 'OGC WMTS', 'arcgis.service.type')
  t.equal(metadata.service.version, '1.0.0', 'arcgis.service.version')
  t.equal(metadata.service.title, 'World_Imagery', 'arcgis.service.title')

  // Layer
  t.equal(metadata.layer.title, 'World_Imagery', 'arcgis.layer.title')
  t.equal(metadata.layer.identifier, 'World_Imagery', 'arcgis.layer.identifier')
  t.equal(metadata.layer.abstract, null, 'arcgis.layer.abstract')
  t.equal(metadata.layer.format, 'image/jpeg', 'arcgis.layer.format')
  t.equal(metadata.layer.minzoom, 0, 'arcgis.layer.minzoom')
  t.equal(metadata.layer.maxzoom, 18, 'arcgis.layer.maxzoom')
  t.deepEqual(metadata.layer.bbox, [-179.99999000000003, -85.00000000000003, 179.99999000000003, 85.0], 'arcgis.layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['default028mm', 'GoogleMapsCompatible'], 'arcgis.layer.tileMatrixSets')

  // URL
  t.equal(metadata.url.slippy, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg', 'arcgis.url.resourceURL')
  t.equal(metadata.url.getCapabilities, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml', 'arcgis.url.getCapabilities')
  t.equal(metadata.url.host, 'services.arcgisonline.com', 'arcgis.url.host')
  t.end()
})

test('wmts -- Mapbox Studio', t => {
  const metadata = wmts(xml.mapbox.wmts)
  // Service
  t.equal(metadata.service.type, 'OGC WMTS', 'mapbox.service.type')
  t.equal(metadata.service.version, '1.0.0', 'mapbox.service.version')
  t.equal(metadata.service.title, 'Mapbox', 'mapbox.service.title')

  // Layer
  t.equal(metadata.layer.title, 'Satellite Streets', 'mapbox.layer.title')
  t.equal(metadata.layer.identifier, 'ciy23jhla008n2soz34kg2p4u', 'mapbox.layer.identifier')
  t.equal(metadata.layer.abstract, '© OSM, © DigitalGlobe', 'mapbox.layer.abstract')
  t.equal(metadata.layer.format, 'image/jpeg', 'mapbox.layer.format')
  t.equal(metadata.layer.minzoom, 0, 'mapbox.layer.minzoom')
  t.equal(metadata.layer.maxzoom, 20, 'mapbox.layer.maxzoom')
  t.deepEqual(metadata.layer.bbox, [-180, -85.051129, 179.976804, 85.051129], 'mapbox.layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['GoogleMapsCompatible'], 'mapbox.layer.tileMatrixSets')

  // URL
  t.equal(metadata.url.slippy, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/tiles/{TileMatrix}/{TileCol}/{TileRow}?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ', 'mapbox.url.slippy')
  t.equal(metadata.url.resourceURL, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/tiles/{TileMatrix}/{TileCol}/{TileRow}?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ', 'mapbox.url.resourceURL')
  t.equal(metadata.url.getCapabilities, 'https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ', 'mapbox.url.getCapabilities')
  t.equal(metadata.url.host, 'api.mapbox.com', 'mapbox.url.host')
  t.end()
})

test('wmts -- GeoServer', t => {
  const metadata = wmts(xml.geoserver.wmts)
  // Service
  t.equal(metadata.service.type, 'OGC WMTS', 'geoserver.service.type')
  t.equal(metadata.service.version, '1.0.0', 'geoserver.service.version')
  // t.equal(metadata.service.title, 'World_Imagery', 'geoserver.service.title')

  // Layer
  // t.equal(metadata.layer.title, 'World_Imagery', 'geoserver.layer.title')
  // t.equal(metadata.layer.identifier, 'World_Imagery', 'geoserver.layer.identifier')
  // t.equal(metadata.layer.abstract, null, 'geoserver.layer.abstract')
  // t.equal(metadata.layer.format, 'image/jpeg', 'geoserver.layer.format')
  t.equal(metadata.layer.minzoom, 0, 'geoserver.layer.minzoom')
  t.equal(metadata.layer.maxzoom, 30, 'geoserver.layer.maxzoom')
  // t.deepEqual(metadata.layer.bbox, [-179.99999000000003, -85.00000000000003, 179.99999000000003, 85.0], 'geoserver.layer.bbox')
  t.deepEqual(metadata.layer.tileMatrixSets, ['GlobalCRS84Pixel', 'EPSG:4326', 'GoogleCRS84Quad', 'EPSG:900913', 'GlobalCRS84Scale'], 'geoserver.layer.tileMatrixSets')

  // URL
  // t.equal(metadata.url.resourceURL, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg', 'geoserver.url.resourceURL')
  // t.equal(metadata.url.getTile, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/', 'geoserver.url.getTile')
  // t.equal(metadata.url.getCapabilities, 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/1.0.0/WMTSCapabilities.xml', 'geoserver.url.getCapabilities')
  // t.equal(metadata.url.host, 'services.arcgisonline.com', 'geoserver.url.host')
  t.end()
})

test('utils', t => {
  const doc = createDocument(xml.mapbox.wmts)
  t.assert(createDocument(doc), 'add Document to createDocument')
  t.throws(() => createDocument(123), /xml must be a string or Document/, 'xml must be a string or Document')
  t.end()
})
