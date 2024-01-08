/// <reference types="koa-router" />
import { DbConfig } from './MongoManager';
import { CacheConfig } from './RedisManager';
export interface PluginLoaderDependencies {
    pluginsPath?: string;
}
export interface AppConfig {
    db: DbConfig;
    cache: CacheConfig;
}
/**
 * 插件加载器
 */
export declare class PluginLoader {
    private routeManager;
    private eventManager;
    private apiManager;
    private mongoManager;
    private redisManager;
    private loggerManager;
    private pluginsPath;
    private logger;
    private hookManager;
    constructor(dependencies?: PluginLoaderDependencies);
    initialize(): Promise<void>;
    getRouteMiddleware(): import("koa-router").IMiddleware<any, {}>;
    loadPlugins(): Promise<void>;
    private installPluginNPM;
    private loadPlugin;
}
