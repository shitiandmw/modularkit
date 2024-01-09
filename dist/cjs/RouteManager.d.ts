import Router from 'koa-router';
import { LoggerInterface } from './LoggerManager';
export declare class RouteManager {
    private logger;
    private globalRouter;
    constructor(logger: LoggerInterface);
    routeMiddleware(): Router.IMiddleware;
    errorHandler(ctx: any, next: any): Promise<void>;
    getInterface(pluginName: string): RouteInterface;
}
export interface RouteInterface {
    /**
     * 注册路由
     * @param pluginName 插件名
     * @param router 路由器
     */
    registerRoutes: (router: Router) => void;
    /**
     * 获取插件路由前缀 (插件路由默认的前缀是 /插件名 ，但后续可能会有目录映射，所以公开一个方法获取真实的插件路由前缀)
     * @param targetPluginName 插件名
     * @returns
     */
    getPluginPrefix: (targetPluginName?: string) => string;
}
