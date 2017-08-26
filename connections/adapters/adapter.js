const Request = require('../../controllers/request.js')
const Layer = require('../layers.js')
const mime = require('mime')

/**
 * Class describing connection adapter / Request Handler for different channel
 */
class Adapter {
  constructor (port) {
    // Create empty adapter middleware stack
    this.stack = []

    // Bind Request Controller to object
    this.request = new Request()
  }

  /**
   * Functions to run before allowing request
   */
  async prepass (req, res) {
    const layer = new Layer()
    try {
        await layer.runStack(req, res, this.stack)
        this.pass(req, res)
    } catch(err) {}
  }

  /**
   * Passes request to RequestController
   */
  async pass (req, res) {
    let response = await this.request.getResponse(req)
    let url = req.url.split('/')
    
    if (url[url.length - 1].split('.')[1] && response.statusCode <= 400) {
      let data = new Buffer(response.body, 'base64')
      res.header('content-type', mime.lookup(req.url))
      res.end(data)
    } else {
      res.status(response.statusCode)[response.method](response.body)
    }
  }

  /**
   * Accepts middleware to run before this.pass()
   */
  use (route, fn, verb) {
    let middleware = {
      method: verb || 'ANY',
      route: typeof route === 'string' ? route : '*',
      fn: typeof fn === 'function' ? fn : route
    }
    this.stack.unshift(middleware)
  }
}

module.exports = Adapter
