import 'isomorphic-fetch';

/**
 * Transport handles the communication between client and server.
 */
export default class Transport {

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
        return fetch(url).then(response => response.json());
    }
};
