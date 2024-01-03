import Router from 'koa-router';
import { LoggerInterface } from './LoggerManager';

export class RouteManager {
    private globalRouter: Router;

    constructor(private logger: LoggerInterface ) {
        this.globalRouter = new Router();

        // 首先注册错误处理中间件
        this.globalRouter.use(this.errorHandler.bind(this));
    }

    // 返回全局路由器的中间件
    public routeMiddleware(): Router.IMiddleware {
        return this.globalRouter.routes();
    }

    // 错误处理中间件
    async errorHandler(ctx: any, next: any) {
        let log_message = '';
        try {
            log_message += `[${ctx.method}] ${ctx.url} \n`;
            await next();
        } catch (err: any) {
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

    public getInterface(pluginName: string): RouteInterface {
        return {
            registerRoutes: (router: Router): void => {
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
    registerRoutes: (router: Router) => void;
}
