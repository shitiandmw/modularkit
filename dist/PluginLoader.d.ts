/// <reference types="koa-router" />
interface LoggerInterface {
    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string | any): void;
    fatal?(message: string): void;
}
interface PluginLoaderDependencies {
    pluginsPath?: string;
    logger?: LoggerInterface;
}
/**
 * 插件加载器
 */
export declare class PluginLoader {
    private routeManager;
    private eventManager;
    private apiManager;
    private modelFactory;
    private pluginsPath;
    private logger;
    constructor(dependencies?: PluginLoaderDependencies);
    initialize(): Promise<void>;
    getRouteMiddleware(): import("koa-router").IMiddleware<any, {}>;
    loadPlugins(): Promise<void>;
    private connectDB;
    private installPluginNPM;
    private loadPlugin;
}
export {};
