/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Schema, Model, ConnectOptions } from 'mongoose';
import { LoggerInterface } from './LoggerManager';
export interface DbConfig {
    type: string;
    mongodb?: MongoConfig;
}
export interface MongoConfig {
    url: string;
    options?: ConnectOptions;
}
export declare class MongoManager {
    private logger;
    private mongooseInstance?;
    constructor(logger: LoggerInterface);
    initialize(): Promise<void>;
    getInterface(pluginName: string): MongoInterface;
}
export interface MongoInterface {
    /**
     * 创建模型
     * @param modelName 模型名
     * @param schema 模型的Schema
     * @returns
     */
    createModel: (modelName: string, schema: Schema) => Model<any>;
}
