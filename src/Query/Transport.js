import 'isomorphic-fetch';

/**
 * Transport
 *
 * Handles the communication between client and server,
 * and might loosely be considered the analogue of
 * the Illuminate\Database\ConnectionInterface.
 */
export default class Transport {

    constructor(http) {
        this.fetch = http || fetch;
    }

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
