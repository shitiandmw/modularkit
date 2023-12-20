import Router from 'koa-router';

export class RouteManager {
    private globalRouter: Router;

    constructor() {
        this.globalRouter = new Router();
    }

    // 返回全局路由器的中间件
    public routeMiddleware(): Router.IMiddleware {
        return this.globalRouter.routes();
    }

    public getInterface(pluginName: string) {
        return {
            registerRoutes: (pluginName: string, router: Router):void => {
                const prefixedRouter = new Router();
                prefixedRouter.use(`/${pluginName}`, router.routes(), router.allowedMethods());
                // 将前缀化的路由注册到全局路由器中
                this.globalRouter.use(prefixedRouter.routes(), prefixedRouter.allowedMethods());
            }
        };
    }
}

export interface RouteInterface {
    /**
     * 注册路由 
     * @param pluginName 插件名 
     * @param router 路由器 
     */
    registerRoutes: (pluginName: string, router: Router) => void;
}
