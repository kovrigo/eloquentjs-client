import 'isomorphic-fetch';

/**
 * Transport handles the communication between client and server.
 */
export default class Transport {

    /**
     * Create a new Transport instance.
     *
     * @param {*} [http]
     */
    constructor(http) {
        /**
         * Fetch API
         *
         * @type {*}
         */
        this.fetch = http || fetch;
    }

    /**
     * Execute a query.
     *
     * @param {string} endpoint
     * @param {Array} query
     * @returns {Promise}
     */
    get(endpoint, query = []) {
        let url = endpoint;
        if (query.length) {
            url += '?query=' + JSON.stringify(query);
        }
        return this.fetch(url)
            .then(function (response) {
                return response.json();
            });
    }
}
