"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseWrapper = void 0;
const ModelFactory_1 = require("./ModelFactory");
class MongooseWrapper {
    constructor(mongooseInstance) {
        this.mongooseInstance = mongooseInstance;
        this.modelFactory = new ModelFactory_1.ModelFactory(mongooseInstance);
    }
    createModel(pluginName, modelName, schema) {
        return this.modelFactory.createModel(pluginName, modelName, schema);
    }
}
exports.MongooseWrapper = MongooseWrapper;
exports.default = MongooseWrapper;
