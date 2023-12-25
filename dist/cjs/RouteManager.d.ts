import Router from 'koa-router';
export declare class RouteManager {
    private globalRouter;
    constructor();
    routeMiddleware(): Router.IMiddleware;
    getInterface(pluginName: string): {
        registerRoutes: (router: Router) => void;
    };
}
export interface RouteInterface {
    /**
     * 注册路由
     * @param pluginName 插件名
     * @param router 路由器
     */
    registerRoutes: (router: Router) => void;
}
