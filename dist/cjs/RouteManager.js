"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteManager = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
class RouteManager {
    globalRouter;
    constructor() {
        this.globalRouter = new koa_router_1.default();
    }
    // 返回全局路由器的中间件
    routeMiddleware() {
        return this.globalRouter.routes();
    }
    getInterface(pluginName) {
        return {
            registerRoutes: (pluginName, router) => {
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