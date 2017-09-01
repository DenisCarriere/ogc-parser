import * as ogcParser from './'

const wmts = ogcParser.wmts('foo')

// Attributes
wmts.layer.abstract
wmts.service.type
wmts.url.getTile