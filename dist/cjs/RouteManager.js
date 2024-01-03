"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
class RouteManager {
    logger;
    globalRouter;
    constructor(logger) {
        this.logger = logger;
        this.globalRouter = new koa_router_1.default();
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
                const prefixedRouter = new koa_router_1.default();
                prefixedRouter.use(`/${pluginName}`, router.routes(), router.allowedMethods());
                // 将前缀化的路由注册到全局路由器中
                this.globalRouter.use(prefixedRouter.routes(), prefixedRouter.allowedMethods());
            }
        };
    }
}
exports.RouteManager = RouteManager;
//# sourceMappingURL=RouteManager.js.map