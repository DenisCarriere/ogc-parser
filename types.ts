import * as ogcParser from './'

// WMTS
const capabilities = ogcParser.wmts('foo')

// Layer
capabilities.layer.abstract

// Service
const type: 'OGC WMTS' = capabilities.service.type
const version: '1.0.0' = capabilities.service.version

// URL
capabilities.url.getTile