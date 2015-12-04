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
        return fetch(buildUrl(url, query), getInit()).then(readJson);
    }

    /**
     * Make a POST request.
     *
     * @param {string} url
     * @param {Object} data
     * @returns {Promise}
     */
    post(url, data = {}) {
        return fetch(url, getInit('post', data)).then(readJson);
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
        return fetch(buildUrl(url, query), getInit('put', data)).then(readJson);
    }

    /**
     * Make a DELETE request.
     *
     * @param {string} url
     * @param {Array} [query]
     * @returns {Promise}
     */
    delete(url, query = []) {
        return fetch(buildUrl(url, query), getInit('delete'))
            .then(response => response.status === 200);
    }
};

function buildUrl(url, stack)
{
    if (stack && stack.length) {
        url += '?query='+JSON.stringify(stack);
    }

    return url;
}

function getInit(method, data, options)
{
    let defaults = {
        credentials: 'same-origin', // to send our session cookie
        headers: {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getCsrfToken()
        }
    };

    if (method) {
        defaults.method = method;
    }

    if (data) {
        defaults.headers['Content-Type'] = 'application/json';
        defaults.body = JSON.stringify(data);
    }

    return Object.assign(defaults, options || {});
}

function readJson(response)
{
    return response.json();
}

function getCsrfToken()
{
    if (typeof document === 'undefined') return;

    return decodeURIComponent((document.cookie.match('(^|; )XSRF-TOKEN=([^;]*)') || 0)[2]);
}