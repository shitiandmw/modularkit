import config from 'config';
import mongoose from 'mongoose';
export class MongoManager {
    logger;
    mongooseInstance;
    constructor(logger) {
        this.logger = logger;
    }
    async initialize() {
        if (!this.mongooseInstance) {
            const db = config.get('db');
            if (db.type === 'mongodb') {
                try {
                    const mongodb = db.mongodb;
                    if (!mongodb) {
                        throw new Error('No mongodbUri found in config file');
                    }
                    // this.logger.info("config:"+ JSON.stringify(mongodb));
                    this.mongooseInstance = await mongoose.connect(mongodb.url, mongodb.options);
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
//# sourceMappingURL=MongoManager.js.map