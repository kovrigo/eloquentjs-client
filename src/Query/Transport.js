import 'isomorphic-fetch';

/**
 * Transport handles the communication between client and server.
 */
export default class Transport {

    /**
     * Make a GET request.
     *
     * @param {string} url
     * @param {Array} query
     * @returns {Promise}
     */
    get(url, query = []) {
        return fetch(appendQueryString(url, query)).then(readJson);
    }

    /**
     * Make a POST request.
     *
     * @param {string} url
     * @param {Object} data
     * @returns {Promise}
     */
    post(url, data = {}) {
        return sendJson(url, 'post', data).then(readJson);
    }

    /**
     * Make a PUT request.
     *
     * @param {string} url
     * @param {Object} data
     * @param {Array} query
     * @returns {Promise}
     */
    put(url, data, query) {
        return sendJson(appendQueryString(url, query), 'put', data)
            .then(readJson);
    }

    /**
     * Make a DELETE request.
     *
     * @param {string} url
     * @param {Array} [query]
     * @returns {Promise}
     */
    delete(url, query = []) {
        return fetch(appendQueryString(url, query), { method: 'delete' })
            .then(response => response.status === 200);
    }
};

function appendQueryString(url, stack)
{
    if (stack && stack.length) url += '?query='+JSON.stringify(stack);

    return url;
}

function sendJson(url, method, data)
{
    return fetch(url, {
        method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function readJson(response)
{
    return response.json();
}