class RouteManager {
    constructor() {
        this.routes = new Map();
    }

    registerRoutes(pluginName, router) {
        this.routes.set(pluginName, router);
    }

    routeMiddleware() {
        return async (ctx, next) => {
            console.log("ctx.path",ctx.path);
            for (let [pluginName, router] of this.routes) {
                if (ctx.path.startsWith(`/${pluginName}`)) {
                    console.log("pluginName",pluginName);
                    return router.routes()(ctx, next);
                }
            }
            await next();
        };
    }
}

module.exports = new RouteManager();
