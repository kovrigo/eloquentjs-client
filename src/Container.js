/**
 * Simple IoC container.
 */
export default class Container {

    /**
     * Create a new Container instance.
     */
    constructor() {
        this.bindings = {};
        this.resolvers = {};
    }

    /**
     * Register an item in the container.
     *
     * @param  {string} name
     * @param  {*} item
     * @return {Container}
     */
    register(name, item) {
        this.bindings[name] = item;

        return this;
    }

    /**
     * Get an item from the container.
     *
     * @param  {string} name
     * @return {*}
     */
    get(name) {
        let item = this.bindings[name];

        if (typeof item === 'undefined') {
            throw new Error(`Nothing registered for [${name}]`);
        }

        return item;
    }

    /**
     * Add callback for resolving the named item.
     *
     * @param  {string} name
     * @param  {function} callback
     * @return {Container}
     */
    resolving(name, callback) {
        this.resolvers[name] = callback;

        return this;
    }

    /**
     * Make an instance of the item if a class.
     *
     * Anything other than a function will be returned as-is.
     *
     * @returns {*}
     */
    make(name) {
        let item = this.get(name);

        if (this.resolvers[name]) {
            let value = this.resolvers[name](item, this);
            if (value) return value;
        }

        if (typeof item === 'function') {
            return new item;
        }

        return item;
    }
}