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
            },
            getPluginPrefix: (targetPluginName?: string): string => {
                if(!targetPluginName)  targetPluginName = pluginName;
                // 暂时直接返回插件名作为前缀，后面可能会有更改
                return `/${targetPluginName}`;
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
    /**
     * 获取插件路由前缀 (插件路由默认的前缀是 /插件名 ，但后续可能会有目录映射，所以公开一个方法获取真实的插件路由前缀)
     * @param targetPluginName 插件名 
     * @returns 
     */
    getPluginPrefix: (targetPluginName?: string) => string;
}
