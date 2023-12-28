"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisManager = void 0;
const config_1 = __importDefault(require("config"));
const ioredis_1 = __importDefault(require("ioredis"));
const uuid_1 = require("uuid");
class RedisManager {
    logger;
    expSeconds;
    client;
    constructor(logger, expSeconds = 60) {
        this.logger = logger;
        this.expSeconds = expSeconds;
    }
    async initialize() {
        if (!this.client) {
            const cacheConfig = config_1.default.get('cache');
            if (cacheConfig.type === 'redis') {
                try {
                    const redisConfig = cacheConfig.redis;
                    if (!redisConfig) {
                        throw new Error(' No redis config found in config file');
                    }
                    let client = new ioredis_1.default(redisConfig);
                    client.on('connect', () => {
                        this.logger.info('redis client connect success');
                    });
                    client.on('error', (error) => {
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
                }
                catch (error) {
                    this.logger.error(`Redis connection failed : ${error instanceof Error ? error.message : ""}}`);
                    // 缓存中间件连接失败退出应用
                    process.exit(1);
                }
            }
            else
                this.logger.warn('No cache type found in config file');
        }
    }
    isEmptyValue(value) {
        if (typeof value === 'string') {
            return value === '';
        }
        else if (Array.isArray(value)) {
            return value.length === 0;
        }
        else if (typeof value === 'number') {
            // return value === 0 || isNaN(value);
            return isNaN(value);
        }
        else if (Buffer.isBuffer(value)) {
            return value.length === 0;
        }
        else if (typeof value === 'object') {
            return value === null || Object.keys(value).length === 0;
        }
        return false;
    }
    async set(key, value, expSeconds = this.expSeconds, noNull = false) {
        let _value = value;
        if (!this.client)
            return;
        if (noNull && this.isEmptyValue(_value))
            return;
        if (Array.isArray(_value) || typeof _value == 'object')
            _value = JSON.stringify(_value);
        if (expSeconds > 0)
            return await this.client.set(key, _value, 'EX', expSeconds);
        else
            return await this.client.set(key, _value);
    }
    getInterface(pluginName) {
        return {
            /**
             * 设置缓存
             * @param key
             * @param value
             * @param expSeconds
             */
            set: async (key, value, expSeconds = this.expSeconds) => {
                await this.set(`${pluginName}:${key}`, value, expSeconds);
            },
            /**
             * 获取缓存
             * @param key
             * @param func
             * @param expSeconds
             * @returns
             */
            get: async (key, func, expSeconds = this.expSeconds) => {
                if (!this.client)
                    return null;
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
            lock: async (key, expSeconds = this.expSeconds) => {
                if (!this.client)
                    return null;
                const mark = (0, uuid_1.v4)();
                key = `${pluginName}:${key}`;
                const lockKey = 'lock:' + key;
                const expMS = expSeconds * 1000;
                const result = await this.client.addlock(lockKey, '', mark, expMS, () => { });
                if (result)
                    return mark;
                else
                    return result;
            },
            /**
             * 解除锁
             * @param key
             * @param mark
             * @returns
             */
            unlock: async (key, mark) => {
                if (!this.client)
                    return null;
                key = `${pluginName}:${key}`;
                return await this.client.dellock(key, mark, () => { });
            }
        };
    }
}
exports.RedisManager = RedisManager;
//# sourceMappingURL=RedisManager%20copy.js.map