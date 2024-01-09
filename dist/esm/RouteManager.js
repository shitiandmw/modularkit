import Router from 'koa-router';
export class RouteManager {
    logger;
    globalRouter;
    constructor(logger) {
        this.logger = logger;
        this.globalRouter = new Router();
        // 首先注册错误处理中间件
        this.globalRouter.use(this.errorHandler.bind(this));
    }
    // 返回全局路由器的中间件
    routeMiddleware() {
        return this.globalRouter.routes();
    }
    // 错误处理中间件
    async errorHandler(ctx, next) {
        let log_message = '';
        try {
            log_message += `[${ctx.method}] ${ctx.url} \n`;
            await next();
        }
        catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message
            };
            this.logger.error(`[${ctx.method}] ${ctx.url} Error `);
            this.logger.error(err);
        }
        finally {
            log_message += `[${ctx.status}]${ctx.body}`;
            // this.logger.info(log_message);
        }
    }
    getInterface(pluginName) {
        return {
            registerRoutes: (router) => {
                const prefixedRouter = new Router();
                prefixedRouter.use(`/${pluginName}`, router.routes(), router.allowedMethods());
                // 将前缀化的路由注册到全局路由器中
                this.globalRouter.use(prefixedRouter.routes(), prefixedRouter.allowedMethods());
            },
            getPluginPrefix: (targetPluginName) => {
                if (!targetPluginName)
                    targetPluginName = pluginName;
                // 暂时直接返回插件名作为前缀，后面可能会有更改
                return `/${targetPluginName}`;
            }
        };
    }
}
//# sourceMappingURL=RouteManager.js.map