import RestConnection from './Connection/RestConnection';

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
     * Make a model class.
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

    _makeClass(baseClass, customiser) {
        let subclass = customiser(class extends baseClass {});

        this._boot(subclass);
        this._createConnection(subclass);
        this._createRelationFactories(subclass);

        return subclass;
    }

    _boot(modelClass) {
        modelClass.prototype.bootIfNotBooted();
    }

    _createConnection(modelClass) {
        modelClass.prototype.connection = new RestConnection(modelClass.endpoint);
    }

    _createRelationFactories(modelClass) {
        Object.keys(modelClass.relations || {}).forEach(relationName => {
            let relatedModel = modelClass.relations[relationName];
            modelClass.relations[relationName] = () => this.make(relatedModel);
        });
    }
}
