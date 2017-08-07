/**
 * Dependencies
 */
const local = require("./config/local.js")
const worker = require("blitz-js-util")
const Server = require("./connections/server.js")

/**
 * Parent Class for API-Node
 */
class API {

    /**
     * Set config for blitz.js to merge
     * @constructor
     */
    constructor(options) {

        // Process forked
        if (process.env.isWorker) {
            worker.expose(this).then(() => this.init())
        }

        // Process not forked
        else {

            // Config which is called by blitz.js on blitz.use()
            this.config = {
                local: local,
                provided: options
            }

            // Path for forking
            this.filename = __filename
        }
    }

    init() {
        this.server = new Server()
    }

    use(route, fn) {
        this.server.use(route, fn)
    }

    get(route, fn) {
        this.server.use(route, fn, "GET")
    }

    post(route, fn) {
        this.server.use(route, fn, "POST")
    }

    put(route, fn) {
        this.server.use(route, fn, "PUT")
    }

    patch(route, fn) {
        this.server.use(route, fn, "PATCH")
    }

    delete(route, fn) {
        this.server.use(route, fn, "DELETE")
    }
}

module.exports = process.env.isWorker ? new API() : API
