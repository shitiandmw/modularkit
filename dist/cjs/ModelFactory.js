"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelFactory = void 0;
class ModelFactory {
    mongooseInstance;
    constructor(mongooseInstance) {
        this.mongooseInstance = mongooseInstance;
    }
    getInterface(pluginName) {
        return {
            createModel: (modelName, schema) => {
                const fullModelName = `p_${pluginName}_${modelName}`;
                return this.mongooseInstance.model(fullModelName, schema);
            }
        };
    }
}
exports.ModelFactory = ModelFactory;
//# sourceMappingURL=ModelFactory.js.map