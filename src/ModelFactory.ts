// src/ModelFactory.ts
import mongoose, { Schema, Model } from 'mongoose';

export class ModelFactory {
    constructor(private mongooseInstance: typeof mongoose) {}

    public getInterface(pluginName: string) {
        return {
            createModel: (modelName: string, schema: Schema): Model<any> => {
                const fullModelName = `p_${pluginName}_${modelName}`;
                return this.mongooseInstance.model(fullModelName, schema);
            }
        };
    }
}


export interface ModelFactoryInterface {
    /**
     * 创建模型 
     * @param modelName 模型名 
     * @param schema 模型的Schema 
     * @returns 
     */
    createModel: (modelName: string, schema: Schema) => Model<any>;
}