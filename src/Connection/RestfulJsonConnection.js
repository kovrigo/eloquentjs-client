import Connection from './Connection';
import 'isomorphic-fetch';

export default class RestfulJsonConnection extends Connection {

    /**
     * Create a new RestfulJsonConnection
     *
     * This sends queries to a given endpoint over HTTP using
     * RESTful conventions. If additional query methods are
     * called, thse are encoded in the (http) query string.
     *
     * @param  {string} [endpoint]
     */
    constructor(endpoint) {
        super();
        this.endpoint = endpoint;
    }

    /**
     * Run an INSERT query.
     *
     * @param  {Object} data
     * @param  {array} query
     * @return {Promise}
     */
    create(data, query) {
        return this._fetch(query, 'post', data)
            .then(response => this.unwrap(response))
        ;
    }

    /**
     * Run a SELECT type query.
     *
     * @param  {array} query
     * @return {Promise}
     */
    read(query) {
        return this._fetch(query)
            .then(response => this.unwrap(response))
        ;
    }

    /**
     * Run an UPDATE query.
     *
     * @param  {Object} data
     * @param  {array} query
     * @return {Promise}
     */
    update(data, query) {
        return this._fetch(query, 'put', data)
            .then(response => this.unwrap(response))
        ;
    }

    /**
     * Run a DELETE query.
     *
     * @param  {array} query
     * @return {Promise}
     */
    delete(query) {
        return this._fetch(query, 'delete')
            .then(response => response.status === 200)
        ;
    }

    /**
     * Wrapper around window.fetch
     *
     * @param  {array} query
     * @param  {string} method
     * @param  {Object} data
     * @return {Promise}
     */
    _fetch(query, method, data) {
        return fetch(this.url(query), this._makeInit(method, data));
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
     * @param  {array} query
     * @return {string}
     */
    url(query) {
        if ( ! this.endpoint) {
            throw 'Endpoint must be set before using this connection';
        }

        if (query && query.length) {
            return `${this.endpoint}?query=${JSON.stringify(query)}`;
        }

        return this.endpoint;
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