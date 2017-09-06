import {wmts, service} from './'

// Service
service('foo').version
service('foo').type
service('foo').title

// WMTS
const capabilities = wmts('foo')

// Layer
capabilities.layer.abstract

// Service
const type: 'OGC WMTS' = capabilities.service.type
const version: '1.0.0' = capabilities.service.version

// URL
capabilities.url.getTile