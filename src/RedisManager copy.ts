import config from 'config';
import Redis, { RedisOptions } from 'ioredis';
import {v4 as uuid} from 'uuid';
import { LoggerInterface } from './LoggerManager';


export interface CacheConfig {
    type: string,
    redis?: RedisOptions
}

export class RedisManager {
    private client?: Redis;

    constructor(private logger: LoggerInterface, private expSeconds: number = 60) { }

    public async initialize() {
        if (!this.client) {
            const cacheConfig: any = config.get('cache');
            if (cacheConfig.type === 'redis') {
                try {
                    const redisConfig = cacheConfig.redis;
                    if (!redisConfig) {
                        throw new Error(' No redis config found in config file');
                    }
                    let client = new Redis(redisConfig);
                    client.on('connect', () => {
                        this.logger.info('redis client connect success');
                    });
                    client.on('error', (error: Error) => {
                        this.logger.error('redis client error');
                        this.logger.error(Error);
                    });
                    // 添加一个加锁的批处理命令
                    client.defineCommand('addlock', {
                        numberOfKeys: 2,
                        lua: `if redis.call('SETNX', KEYS[1], ARGV[1]) == 1 then redis.call('PEXPIRE',KEYS[1],ARGV[2]) return 1 else return 0 end`,
                    });
                    // 添加一个解锁的批处理命令
                    client.defineCommand('dellock', {
                        numberOfKeys: 1,
                        lua: `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`,
                    });
                    await client.connect;
                    this.client = client;

                } catch (error) {
                    this.logger.error(`Redis connection failed : ${error instanceof Error ? error.message : ""}}`);
                    // 缓存中间件连接失败退出应用
                    process.exit(1);
                }
            }
            else this.logger.warn('No cache type found in config file')
        }
    }
    public isEmptyValue(value: string | Object | Array<any> | number | Buffer): boolean {
        if (typeof value === 'string') {
            return value === '';
        } else if (Array.isArray(value)) {
            return value.length === 0;
        } else if (typeof value === 'number') {
            // return value === 0 || isNaN(value);
            return isNaN(value);
        } else if (Buffer.isBuffer(value)) {
            return value.length === 0;
        } else if (typeof value === 'object') {
            return value === null || Object.keys(value).length === 0;
        }
        return false;
    }


    public async set(key: string, value: Object | Array<any> | string | Buffer | number, expSeconds: number = this.expSeconds, noNull: boolean = false) {
        let _value: any = value;
        if (!this.client) return;
        if (noNull && this.isEmptyValue(_value)) return;
        if (Array.isArray(_value) || typeof _value == 'object') _value = JSON.stringify(_value);
        if (expSeconds > 0)
            return await this.client.set(key, _value, 'EX', expSeconds);
        else return await this.client.set(key, _value);
    }

    public getInterface(pluginName: string) {
        return {
            /**
             * 设置缓存
             * @param key 
             * @param value 
             * @param expSeconds 
             */
            set: async (key: string, value: string, expSeconds: number = this.expSeconds): Promise<void> => {
                await this.set(`${pluginName}:${key}`, value, expSeconds);
            },
            /**
             * 获取缓存
             * @param key 
             * @param func 
             * @param expSeconds 
             * @returns 
             */
            get: async (key: string, func?: Function, expSeconds: number = this.expSeconds) : Promise<string | null> => {
                if (!this.client) return null;
                key = `${pluginName}:${key}`;
                let value = await this.client.get(key);
                if (!value && typeof func == "function") {
                    let result = await func() || "";
                    this.set(key, result, expSeconds, true);
                    value = result;
                }
                else if (value && ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))))
                    value = JSON.parse(value);
                return value;
            },
            /**
             * 添加锁 
             * @param key 
             * @param expSeconds 
             * @returns 
             */
            lock: async (key: string,  expSeconds: number = this.expSeconds) : Promise<any> => {
                if (!this.client) return null;
                const mark = uuid();
                key = `${pluginName}:${key}`;
                const lockKey = 'lock:' + key;
                const expMS = expSeconds * 1000;
                const result = await (this.client as any).addlock(lockKey, '', mark, expMS, () => {});
                if (result) return mark;
                else return result;
            },
            /**
             * 解除锁 
             * @param key 
             * @param mark 
             * @returns 
             */
            unlock: async (key: string, mark: string) : Promise<any> => {
                if (!this.client) return null;
                key = `${pluginName}:${key}`;
                return await (this.client as any).dellock(key, mark, () => {});
            }

        };
    }
}

export interface RedisInterface {

}

