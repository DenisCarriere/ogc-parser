# OGC Parser

[![Build Status](https://travis-ci.org/DenisCarriere/ogc-parser.svg?branch=master)](https://travis-ci.org/DenisCarriere/ogc-parser)
[![npm version](https://badge.fury.io/js/ogc-parser.svg)](https://badge.fury.io/js/ogc-parser)
[![Coverage Status](https://coveralls.io/repos/github/DenisCarriere/ogc-parser/badge.svg?branch=master)](https://coveralls.io/github/DenisCarriere/ogc-parser?branch=master)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/DenisCarriere/ogc-parser/master/LICENSE)
[![ES5](https://camo.githubusercontent.com/d341caa63123c99b79fda7f8efdc29b35f9f2e70/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f65732d352d627269676874677265656e2e737667)](http://kangax.github.io/compat-table/es5/)

<!-- Line Break -->

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

> Parser to convert OGC WMTS/WMS XML schemas to human friendly JSON.

## Install

**npm**

```bash
$ npm install --save ogc-parser
```

**web browser ([ES5](https://kangax.github.io/compat-table/es5))**

```html
<script src="https://wzrd.in/standalone/ogc-parser@latest"></script>
```

## Quickstart

```javascript
const fs = require('fs')
const xml = fs.readFileSync('ogc-wmts.xml', 'utf8')
const capabilities = ogcParser.wmts(xml)
capabilities.service.type
//=OGC WMTS
capabilities.service.version
//=1.0.0
capabilities.url.getCapabilities
//=http://localhost:80/WMTS/1.0.0/WMTSCapabilities.xml
```

**ogc-wmts.xml**

```xml
<declaration version="1.0" encoding="utf-8"/>
<Capabilities xmlns="http://www.opengis.net/wmts/1.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/wmts/1.0 http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd" version="1.0.0">
  <ServiceMetadataURL xlink:href="http://localhost:80/WMTS/1.0.0/WMTSCapabilities.xml"/>
  <ows:ServiceIdentification>
    <ows:ServiceTypeVersion>1.0.0</ows:ServiceTypeVersion>
    <ows:ServiceType>OGC WMTS</ows:ServiceType>
...
```

**capabilities**

```json
{
	"service": {
		"type": "OGC WMTS",
		"version": "1.0.0",
		"title": "Mapbox"
	},
	"layer": {
		"title": "Satellite Streets",
		"abstract": "© OSM, © DigitalGlobe",
		"identifier": "ciy23jhla008n2soz34kg2p4u",
		"format": "image/jpeg",
		"bbox": [
			-180,
			-85.051129,
			179.976804,
			85.051129
		],
		"minzoom": 0,
		"maxzoom": 20,
		"tileMatrixSets": [
			"GoogleMapsCompatible"
		]
	},
	"url": {
		"resourceURL": "https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/tiles/{TileMatrix}/{TileCol}/{TileRow}?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ",
		"getCapabilities": "https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ",
		"getTile": "https://api.mapbox.com/styles/v1/addxy/ciy23jhla008n2soz34kg2p4u/wmts?access_token=pk.eyJ1IjoiYWRkeHkiLCJhIjoiY2lsdmt5NjZwMDFsdXZka3NzaGVrZDZtdCJ9.ZUE-LebQgHaBduVwL68IoQ",
		"host": "api.mapbox.com"
	}
}
```
