import config from 'config';
import mongoose, { Schema, Model ,ConnectOptions} from 'mongoose';
import { LoggerInterface } from './LoggerManager';

export interface DbConfig {
    type: string,
    mongodb?: MongoConfig
}
export interface MongoConfig  {
    url: string,
    options?: ConnectOptions
}

export class MongoManager {

    private mongooseInstance?: typeof mongoose;

    constructor(private logger: LoggerInterface) { }

    public async initialize() {
        if (!this.mongooseInstance) {
            const db: DbConfig = config.get('db');
            if (db.type === 'mongodb') {
                try {
                    const mongodb = db.mongodb;
                    if (!mongodb) {
                        throw new Error('No mongodbUri found in config file');
                    }
                    
                    this.logger.info("config:"+ JSON.stringify(mongodb));
                    this.mongooseInstance = await mongoose.connect(mongodb.url, mongodb.options);

                    this.logger.info('MongoDB connected successfully');
                } catch (error) {
                    this.logger.error(`MongoDB connection failed : ${error instanceof Error ? error.message : ""}}`);
                    // 数据库连接失败退出应用
                    process.exit(1);
                }
            }
            else this.logger.warn('The DB type is not mongodb')
        }
    }

    public getInterface(pluginName: string) {
        return {
            createModel: (modelName: string, schema: Schema): Model<any> => {
                const fullModelName = `p_${pluginName}_${modelName}`;
                if (!this.mongooseInstance) {
                    throw new Error('Mongoose not initialized');
                }
                return this.mongooseInstance.model(fullModelName, schema);
            }
        };
    }
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
