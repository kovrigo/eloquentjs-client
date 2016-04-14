/* eslint-disable */
/**
 * Connection interface.
 *
 * @interface
 */
export default class Connection {

    /**
     * Run an INSERT query.
     *
     * @param  {Object} data
     * @return {Promise}
     */
    create(data) {
        throw "Not implemented";
    }

    /**
     * Run a SELECT type query.
     *
     * @param  {number|Array} idOrQuery
     * @return {Promise}
     */
    read(idOrQuery) {
        throw "Not implemented";
    }

    /**
     * Run an UPDATE query.
     *
     * @param  {number|Array} idOrQuery
     * @param  {Object} data
     * @return {Promise}
     */
    update(idOrQuery, data) {
        throw "Not implemented";
    }

    /**
     * Run a DELETE query.
     *
     * @param  {number|Array} idOrQuery
     * @return {Promise}
     */
    delete(idOrQuery) {
        throw "Not implemented";
    }
}
