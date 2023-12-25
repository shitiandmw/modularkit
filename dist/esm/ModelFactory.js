export class ModelFactory {
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
//# sourceMappingURL=ModelFactory.js.map