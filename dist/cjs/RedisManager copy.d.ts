/// <reference types="node" />
import { RedisOptions } from 'ioredis';
import { LoggerInterface } from './LoggerManager';
export interface CacheConfig {
    type: string;
    redis?: RedisOptions;
}
export declare class RedisManager {
    private logger;
    private expSeconds;
    private client?;
    constructor(logger: LoggerInterface, expSeconds?: number);
    initialize(): Promise<void>;
    isEmptyValue(value: string | Object | Array<any> | number | Buffer): boolean;
    set(key: string, value: Object | Array<any> | string | Buffer | number, expSeconds?: number, noNull?: boolean): Promise<"OK" | undefined>;
    getInterface(pluginName: string): {
        /**
         * 设置缓存
         * @param key
         * @param value
         * @param expSeconds
         */
        set: (key: string, value: string, expSeconds?: number) => Promise<void>;
        /**
         * 获取缓存
         * @param key
         * @param func
         * @param expSeconds
         * @returns
         */
        get: (key: string, func?: Function, expSeconds?: number) => Promise<string | null>;
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
    };
}
export interface RedisInterface {
}
