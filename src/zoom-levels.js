const xpath = require('xpath')
const createDocument = require('./utils').createDocument

// Use OGC namespace
const select = xpath.useNamespaces({
  'ows': 'http://www.opengis.net/ows/1.1',
  'xlink': 'http://www.w3.org/1999/xlink'
})

/**
 * Mapbox
 * ------
 * <TileMatrixSet>
 * <ows:Title>GoogleMapsCompatible</ows:Title>
 * <ows:Abstract>GoogleMapsCompatible EPSG:3857</ows:Abstract>
 * <ows:Identifier>GoogleMapsCompatible</ows:Identifier>
 * <ows:SupportedCRS>urn:ogc:def:crs:EPSG::3857</ows:SupportedCRS>
 * <TileMatrix>
 *   <ows:Identifier>0</ows:Identifier>
 *   <ScaleDenominator>279541132.0143589</ScaleDenominator>
 *   <TopLeftCorner>-20037508.34278925 20037508.34278925</TopLeftCorner>
 *   <TileWidth>512</TileWidth>
 *   <TileHeight>512</TileHeight>
 *   <MatrixWidth>1</MatrixWidth>
 *   <MatrixHeight>1</MatrixHeight>
 * </TileMatrix>
 * <TileMatrix>
 *   <ows:Identifier>1</ows:Identifier>
 *   <ScaleDenominator>139770566.00717944</ScaleDenominator>
 *   <TopLeftCorner>-20037508.34278925 20037508.34278925</TopLeftCorner>
 *   <TileWidth>512</TileWidth>
 *   <TileHeight>512</TileHeight>
 *   <MatrixWidth>2</MatrixWidth>
 *   <MatrixHeight>2</MatrixHeight>
 *   </TileMatrix>
 *
 * GeoServer
 * ---------
 * <TileMatrixSet>
 *   <ows:Identifier>EPSG:900913</ows:Identifier>
 *   <ows:SupportedCRS>urn:ogc:def:crs:EPSG::900913</ows:SupportedCRS>
 *   <TileMatrix>
 *     <ows:Identifier>EPSG:900913:0</ows:Identifier>
 *     <ScaleDenominator>5.590822639508929E8</ScaleDenominator>
 *     <TopLeftCorner>-2.003750834E7 2.0037508E7</TopLeftCorner>
 *     <TileWidth>256</TileWidth>
 *     <TileHeight>256</TileHeight>
 *     <MatrixWidth>1</MatrixWidth>
 *     <MatrixHeight>1</MatrixHeight>
 *   </TileMatrix>
 *   <TileMatrix>
 *     <ows:Identifier>EPSG:900913:1</ows:Identifier>
 *     <ScaleDenominator>2.7954113197544646E8</ScaleDenominator>
 *     <TopLeftCorner>-2.003750834E7 2.0037508E7</TopLeftCorner>
 *     <TileWidth>256</TileWidth>
 *     <TileHeight>256</TileHeight>
 *     <MatrixWidth>2</MatrixWidth>
 *     <MatrixHeight>2</MatrixHeight>
 *   </TileMatrix>
 *
 * ArcGIS
 * ------
 * <TileMatrixSet>
 *   <ows:Title>GoogleMapsCompatible</ows:Title>
 *   <ows:Abstract>the wellknown 'GoogleMapsCompatible' tile matrix set defined by OGC WMTS specification</ows:Abstract>
 *   <ows:Identifier>GoogleMapsCompatible</ows:Identifier>
 *   <ows:SupportedCRS>urn:ogc:def:crs:EPSG:6.18.3:3857</ows:SupportedCRS>
 *   <WellKnownScaleSet>urn:ogc:def:wkss:OGC:1.0:GoogleMapsCompatible</WellKnownScaleSet>
 *   <TileMatrix>
 *     <ows:Identifier>0</ows:Identifier>
 *     <ScaleDenominator>559082264.0287178</ScaleDenominator>
 *     <TopLeftCorner>-20037508.34278925 20037508.34278925</TopLeftCorner>
 *     <TileWidth>256</TileWidth>
 *     <TileHeight>256</TileHeight>
 *     <MatrixWidth>1</MatrixWidth>
 *     <MatrixHeight>1</MatrixHeight>
 *   </TileMatrix>
 *   <TileMatrix>
 *     <ows:Identifier>1</ows:Identifier>
 *     <ScaleDenominator>279541132.0143589</ScaleDenominator>
 *     <TopLeftCorner>-20037508.34278925 20037508.34278925</TopLeftCorner>
 *     <TileWidth>256</TileWidth>
 *     <TileHeight>256</TileHeight>
 *     <MatrixWidth>2</MatrixWidth>
 *     <MatrixHeight>2</MatrixHeight>
 *   </TileMatrix>
 */

 /**
 * WMTS Zoom Levels
 *
 * @typedef {Object} Zooms
 * @property {number} minzoom
 * @property {number} maxzoom
 * @property {string[]} tileMatrixSets
 */

/**
 * Parse WMTS Zoom Levels
 *
 * @param {string|Document} xml
 * @returns {Zooms} WMTS Zoom Levels
 */
module.exports = function (xml) {
  const doc = createDocument(xml)
  const tileMatrix = []
  var minzoom
  var maxzoom

  const tileMatrixSets = select('//TileMatrixSet/ows:Identifier', doc).map(tileMatrixSet => {
    return tileMatrixSet.textContent
  })

  // Support GoogleMapsCompatible
  select('//TileMatrixSet[ows:Identifier="GoogleMapsCompatible"]/./TileMatrix/ows:Identifier', doc).forEach(TileMatrix => {
    const identifier = TileMatrix.textContent
    tileMatrix.push(identifier)
    const zoom = Number(identifier)
    if (zoom <= minzoom || minzoom === undefined) minzoom = zoom
    if (zoom >= maxzoom || maxzoom === undefined) maxzoom = zoom
  })
  // Support EPSG:900913 (Google Projection)
  select('//TileMatrixSet[ows:Identifier="EPSG:900913"]/./TileMatrix/ows:Identifier', doc).forEach(TileMatrix => {
    const identifier = TileMatrix.textContent
    tileMatrix.push(identifier)
    const zoom = Number(identifier.replace('EPSG:900913:', ''))
    if (zoom < minzoom || minzoom === undefined) minzoom = zoom
    if (zoom > maxzoom || maxzoom === undefined) maxzoom = zoom
  })
  return {
    // tileMatrix: tileMatrix,
    tileMatrixSets: tileMatrixSets,
    minzoom: (minzoom !== undefined) ? minzoom : null,
    maxzoom: (maxzoom !== undefined) ? maxzoom : null
  }
}
