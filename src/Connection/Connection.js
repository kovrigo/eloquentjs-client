/**
 * Connection interface
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
     * @param  {number} id
     * @param  {array} queryStack
     * @return {Promise}
     */
    read(id, queryStack) {
        throw "Not implemented";
    }

    /**
     * Run an UPDATE query.
     *
     * @param  {number} id
     * @param  {Object} data
     * @param  {array} queryStack
     * @return {Promise}
     */
    update(id, data, queryStack) {
        throw "Not implemented";
    }

    /**
     * Run a DELETE query.
     *
     * @param  {number} id
     * @param  {array} queryStack
     * @return {Promise}
     */
    delete(id, queryStack) {
        throw "Not implemented";
    }
}
