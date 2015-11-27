import 'isomorphic-fetch';

/**
 * Transport handles the communication between client and server.
 */
export default class Transport {

    /**
     * Make a GET request.
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

    /**
     * Make a POST request.
     *
     * @param {string} endpoint
     * @param {Object} attributes
     * @returns {Promise}
     */
    post(endpoint, attributes = []) {
        return fetch(endpoint, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attributes)
        }).then(response => response.json());
    }
};
