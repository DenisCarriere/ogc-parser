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
const wmts = ogcParser.wmts(xml)
wmts.service.type
//=OGC WMTS
wmts.service.version
//=1.0.0
wmts.url.getCapabilities
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

## API
