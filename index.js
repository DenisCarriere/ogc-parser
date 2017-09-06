const wmts = require('./src/wmts')
const service = require('./src/service')

/**
 * OGC Parser
 */
module.exports = {
  service: service,
  wmts: wmts
}
