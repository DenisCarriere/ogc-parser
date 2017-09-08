const test = require('tape')
const wms = require('./wms')
const xml = require('../test/xml')

test('wms', t => {
  console.log(wms(xml.toporama.wms))
  t.end()
})
