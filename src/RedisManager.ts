import config from 'config';
import Redis, { RedisOptions } from 'ioredis';
import { v4 as uuid } from 'uuid';
import { LoggerInterface } from './LoggerManager';


export interface CacheConfig {
    type: string,
    redis?: RedisOptions
}

export class RedisManager {
    private client?: Redis;

    constructor(private logger: LoggerInterface, private expSeconds: number = 60) { }

    public initialize() {
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
                        this.logger.error(error);
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


    public async setBase(key: string, value: Object | Array<any> | string | Buffer | number, expSeconds: number = this.expSeconds, noNull: boolean = false) {
        let _value: any = value;
        if (!this.client) return;
        if (noNull && this.isEmptyValue(_value)) return;
        if (Array.isArray(_value) || typeof _value == 'object') _value = JSON.stringify(_value);
        if (expSeconds > 0)
            return await this.client.set(key, _value, 'EX', expSeconds);
        else return await this.client.set(key, _value);
    }


    /**
     * 判断是否是自定义方法 
     * @param methodName 
     * @returns 
     */
    private isCustomMethod(methodName: string): methodName is keyof RedisManager {
        return typeof (this as any)[methodName] === 'function' &&
            ['getInterface', 'isCustomMethod', 'initialize', 'setBase'].indexOf(methodName) === -1;
    }


    public async cSet(pluginName: string, key: string, value: string, expSeconds: number = this.expSeconds): Promise<void> {
        await this.setBase(`${pluginName}:${key}`, value, expSeconds);
    }

    public async cGet(pluginName: string, key: string, func?: Function, expSeconds: number = this.expSeconds): Promise<string | null> {
        if (!this.client) return null;
        key = `${pluginName}:${key}`;
        let value = await this.client.get(key);
        if (!value && typeof func == "function") {
            let result = await func() || "";
            this.setBase(key, result, expSeconds, true);
            value = result;
        }
        else if (value && ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))))
            value = JSON.parse(value);
        return value;
    }
    public async lock(pluginName: string, key: string, expSeconds: number = this.expSeconds): Promise<any> {
        if (!this.client) return null;
        const mark = uuid();
        key = `${pluginName}:${key}`;
        const lockKey = 'lock:' + key;
        const expMS = expSeconds * 1000;
        const result = await (this.client as any).addlock(lockKey, '', mark, expMS, () => { });
        if (result) return mark;
        else return result;
    }
    public async unlock(pluginName: string, key: string, mark: string): Promise<any> {
        if (!this.client) return null;
        key = `${pluginName}:${key}`;
        return await (this.client as any).dellock(key, mark, () => { });
    }

    public getInterface(pluginName: string): RedisInterface {
        if (!this.client) {
            throw new Error('Redis client not initialized');
        }
        const commandsWithKeyAsFirstArg = new Set([
            'get', 'set', 'del', 'exists', 'expire', 'ttl', 'incr', 'decr',
            'mget', 'mset', 'setnx', 'setex', 'psetex', 'getset', 'incrby', 'decrby',
            'hget', 'hset', 'hdel', 'hexists', 'hincrby', 'hkeys', 'hvals', 'hlen', 'hmget', 'hmset',
            'lpush', 'rpush', 'lpop', 'rpop', 'lindex', 'llen', 'lrange', 'ltrim', 'lset',
            'sadd', 'srem', 'smembers', 'sismember', 'scard', 'spop', 'srandmember',
            'zadd', 'zrange', 'zrangebyscore', 'zrem', 'zremrangebyscore', 'zremrangebyrank', 'zcard', 'zcount', 'zscore', 'zincrby',
            'getbit', 'setbit', 'bitcount', 'bitpos', 'getrange', 'setrange',
            'append', 'strlen',
            'pfadd', 'pfcount', 'pfmerge',
            'watch', 'unwatch', 'subscribe', 'unsubscribe', 'psubscribe', 'punsubscribe'
        ]);

        const handler = {
            get: (target: any, prop: any, receiver: any) => {
                // 检查是否是自定义方法
                if (this.isCustomMethod(prop)) {
                    return (this as any)[prop].bind(this, pluginName);
                }

                // 获取原始方法
                const originalMethod = target[prop];

                // 对原生 Redis 方法的处理
                if (typeof originalMethod === 'function') {
                    return (...args: any) => {
                        // 对特定的命令添加key前缀
                        if (commandsWithKeyAsFirstArg.has(prop) && args.length > 0 && typeof args[0] === 'string') {
                            args[0] = `${pluginName}:${args[0]}`;
                        }
                        // 调用原始方法
                        return originalMethod.apply(target, args);
                    };
                }

                // 对于非函数属性，直接返回原始属性值
                return originalMethod;
            }
        };

        // 创建代理
        return new Proxy(this.client, handler);

    }

}

export interface RedisInterface extends Redis {
    /**
     * 设置缓存
     * @param key 
     * @param value 
     * @param expSeconds 
     */
    cSet: (key: string, value: string, expSeconds: number) => Promise<void>;
    /**
     * 获取缓存
     * @param key 
     * @param func 
     * @param expSeconds 
     * @returns 
     */
    cGet: (key: string, func?: Function, expSeconds?: number) => Promise<string | null>;
    /**
     * 添加锁 
     * @param key 
     * @param expSeconds 
     * @returns 
     */
    lock: (key: string, expSeconds?: number) => Promise<any>;
    /**
     * 解除锁 
     * @param key 
     * @param mark 
     * @returns 
     */
    unlock: (key: string, mark: string) => Promise<any>;
}

