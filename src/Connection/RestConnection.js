/**
 * RestConnection
 *
 * This sends queries to a given endpoint over HTTP using
 * RESTful conventions. If additional query methods are
 * called, these are encoded in the (http) query string.
 *
 * The endpoint *must* be set before this connection is used.
 */
export default class RestConnection {

    /**
     * Create a new RestConnection
     *
     * @param  {string} [endpoint]
     */
    constructor(endpoint) {
        /**
         * The base URL for this connection.
         *
         * @protected
         * @type {string}
         */
        this.endpoint = endpoint;
    }

    /**
     * Run an INSERT query.
     *
     * @param  {Object} data
     * @return {Promise}
     */
    create(data) {
        return this
            .sendRequest(null, 'post', data)
            .then(response => this.unwrap(response));
    }

    /**
     * Run a SELECT query.
     *
     * @param  {number|Array} idOrQuery
     * @return {Promise}
     */
    read(idOrQuery) {
        return this
            .sendRequest(idOrQuery)
            .then(response => this.unwrap(response));
    }

    /**
     * Run an UPDATE query.
     *
     * @param  {number|Array} idOrQuery
     * @param  {Object} data
     * @return {Promise}
     */
    update(idOrQuery, data) {
        return this
            .sendRequest(idOrQuery, 'put', data)
            .then(response => this.unwrap(response));
    }


    /**
     * Run a DELETE query.
     *
     * @param  {number|Array} idOrQuery
     * @return {Promise}
     */
    delete(idOrQuery) {
        return this
            .sendRequest(idOrQuery, 'delete')
            .then(response => response.status === 200);
    }

    /**
     * Wrapper around window.fetch
     *
     * @param  {number} [id]
     * @param  {array} [queryStack]
     * @param  {string} [method]
     * @param  {Object} [data]
     * @return {Promise}
     */
    _fetch(id, queryStack, method, data) {
        return fetch(
            this.url(id, queryStack),
            this._makeInit(method, data)
        );
    }

    /**
     * Send an HTTP request and return a Promise.
     *
     * @param  {string|number|Array} [urlSuffix]
     * @param  {string} [method]
     * @param  {Object} [body]
     * @return {Promise}
     */
    sendRequest(urlSuffix, method, body) {
        return fetch(this.buildUrl(urlSuffix), this.buildOptions(method, body));
    }

    /**
     * Get endpoint URL with the entity ID or query data appended.
     *
     * @param  {string|number|array} suffix
     * @return {string}
     */
    buildUrl(suffix) {
        if ( ! this.endpoint) {
            throw 'Endpoint must be set before using this connection';
        }

        let url = this.endpoint;

        if (Array.isArray(suffix)) {
            if (suffix.length) {
                url += '?query='+JSON.stringify(suffix);
            }
        } else if (suffix) {
            url += '/'+suffix;
        }

        return url;
    }

    /**
     * Get an options hash for the fetch `init` parameter.
     *
     * @see  https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#Parameters
     * @param  {string} [method]
     * @param  {Object} [data]
     * @param  {Object} [options]
     * @return {Object}
     */
    buildOptions(method, body, options) {
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

        if (body) {
            defaults.headers['Content-Type'] = 'application/json';
            defaults.body = JSON.stringify(body);
        }

        return Object.assign(defaults, options || {});
    }

    /**
     * Take a fetch response and extract the JSON.
     *
     * @param  {Response} response
     * @return {Object}
     */
    unwrap(response) {
        return response.json();
    }

    /**
     * Get a URL to the endpoint.
     *
     * @param  {number} [id]
     * @param  {array} [query]
     * @return {string}
     */
    url(id, query) {
        if ( ! this.endpoint) {
            throw 'Endpoint must be set before using this connection';
        }

        let url = this.endpoint;

        if (id) {
            url += '/'+id;
        }

        if (query && query.length) {
            return `${url}?query=${JSON.stringify(query)}`;
        }

        return url;
    }

    /**
     * Make an options hash for the fetch `init` parameter.
     *
     * @see  https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#Parameters
     * @param  {string} [method]
     * @param  {Object} [data]
     * @param  {Object} [options]
     * @return {Object}
     */
    _makeInit(method, data, options) {

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
}

function getCsrfToken()
{
    if (typeof document === 'undefined') return;

    return decodeURIComponent((document.cookie.match('(^|; )XSRF-TOKEN=([^;]*)') || 0)[2]);
}
