export default class Container {

    /**
     * Create a new container for Eloquent classes.
     *
     * @param {Model} baseClass
     */
    constructor(baseClass) {
        this.baseClass = baseClass;
        this.items = new Map();
    }

    /**
     * Register a model with the container.
     *
     * @param  {string}          modelName
     * @param  {Object|function} modelOptions
     * @param  {boolean}         [andMake=false]
     * @return {this|Model}
     */
    register(modelName, modelOptions, andMake) {
        let customiser;

        if (typeof modelOptions === 'function') {
            customiser = modelOptions;
        } else {
            customiser = function (modelClass) {
                return Object.assign(modelClass, modelOptions);
            };
        }

        this.items.set(modelName, customiser);

        return andMake ? this.make(modelName) : this;
    }

    /**
     * Make and initialise a model class.
     *
     * @param  {string} modelName
     * @return {Model}
     */
    make(modelName) {
        let customiser = this.items.get(modelName);

        if ( ! customiser) {
            throw new Error(`Model [${modelName}] not registered`);
        }

        if ( ! customiser._made) {
            customiser._made = this._makeClass(this.baseClass, customiser);
        }

        return customiser._made;
    }

    /**
     * Set up a subclass extending the base Model.
     *
     * @param  {[type]} baseClass  [description]
     * @param  {[type]} customiser [description]
     * @return {[type]}            [description]
     */
    _makeClass(baseClass, customiser) {
        let subclass = customiser(class extends baseClass {});

        subclass.prototype.bootIfNotBooted();

        return subclass;
    }
}
