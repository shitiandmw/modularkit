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
}
