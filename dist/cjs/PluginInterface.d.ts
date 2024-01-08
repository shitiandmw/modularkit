import { EventInterface } from './EventManager';
import { ApiInterface } from './ApiManager';
import { MongoInterface } from './MongoManager';
import { RouteInterface } from './RouteManager';
import { LoggerInterface } from './LoggerManager';
import { RedisInterface } from './RedisManager';
import { HookInterface } from './HookManager';
import Router from 'koa-router';
export interface PluginDependencies {
    routerInterface?: RouteInterface;
    eventInterface?: EventInterface;
    apiInterface?: ApiInterface;
    mongoInterface?: MongoInterface;
    redisInterface?: RedisInterface;
    loggerInterface?: LoggerInterface;
    hookInterface?: HookInterface;
}
export interface PluginInterface {
    initialize(): void;
}
export interface AppInterface {
    logger?: LoggerInterface;
    redis?: RedisInterface;
    pluginApi?: ApiInterface;
    pluginEvent?: EventInterface;
    hook?: HookInterface;
    model?: any;
    controller?: any;
    service?: any;
}
export declare class Plugin implements PluginInterface {
    protected dependencies: PluginDependencies;
    protected app?: AppInterface;
    protected routerInterface?: RouteInterface;
    protected mongoInterface?: MongoInterface;
    protected modelPath?: string;
    protected servicePath?: string;
    protected controllerPath?: string;
    constructor(dependencies: PluginDependencies);
    initialize(): void;
    loadModel(): void;
    LoadController(): void;
    loadService(): void;
    loadRouter(routes: Router): void;
}
