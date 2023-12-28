/// <reference types="node" />
import Redis, { RedisOptions } from 'ioredis';
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
    initialize(): void;
    isEmptyValue(value: string | Object | Array<any> | number | Buffer): boolean;
    setBase(key: string, value: Object | Array<any> | string | Buffer | number, expSeconds?: number, noNull?: boolean): Promise<"OK" | undefined>;
    /**
     * 判断是否是自定义方法
     * @param methodName
     * @returns
     */
    private isCustomMethod;
    cSet(pluginName: string, key: string, value: string, expSeconds?: number): Promise<void>;
    cGet(pluginName: string, key: string, func?: Function, expSeconds?: number): Promise<string | null>;
    lock(pluginName: string, key: string, expSeconds?: number): Promise<any>;
    unlock(pluginName: string, key: string, mark: string): Promise<any>;
    getInterface(pluginName: string): RedisInterface;
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
