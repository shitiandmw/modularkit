import Router from 'koa-router';
export class RouteManager {
    constructor() {
        this.globalRouter = new Router();
    }
    // 返回全局路由器的中间件
    routeMiddleware() {
        return this.globalRouter.routes();
    }
    getInterface(pluginName) {
        return {
            registerRoutes: (pluginName, router) => {
                const prefixedRouter = new Router();
                prefixedRouter.use(`/${pluginName}`, router.routes(), router.allowedMethods());
                // 将前缀化的路由注册到全局路由器中
                this.globalRouter.use(prefixedRouter.routes(), prefixedRouter.allowedMethods());
            }
        };
    }
}
