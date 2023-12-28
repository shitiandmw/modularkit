"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoManager = void 0;
const config_1 = __importDefault(require("config"));
const mongoose_1 = __importDefault(require("mongoose"));
class MongoManager {
    logger;
    mongooseInstance;
    constructor(logger) {
        this.logger = logger;
    }
    async initialize() {
        if (!this.mongooseInstance) {
            const db = config_1.default.get('db');
            if (db.type === 'mongodb') {
                try {
                    const mongodb = db.mongodb;
                    if (!mongodb) {
                        throw new Error('No mongodbUri found in config file');
                    }
                    // this.logger.info("config:"+ JSON.stringify(mongodb));
                    this.mongooseInstance = await mongoose_1.default.connect(mongodb.url, mongodb.options);
                    this.logger.info('MongoDB connected successfully');
                }
                catch (error) {
                    this.logger.error(`MongoDB connection failed : ${error instanceof Error ? error.message : ""}}`);
                    // 数据库连接失败退出应用
                    process.exit(1);
                }
            }
            else
                this.logger.warn('The DB type is not mongodb');
        }
    }
    getInterface(pluginName) {
        return {
            createModel: (modelName, schema) => {
                const fullModelName = `p_${pluginName}_${modelName}`;
                if (!this.mongooseInstance) {
                    throw new Error('Mongoose not initialized');
                }
                return this.mongooseInstance.model(fullModelName, schema);
            }
        };
    }
}
exports.MongoManager = MongoManager;
//# sourceMappingURL=MongoManager.js.map