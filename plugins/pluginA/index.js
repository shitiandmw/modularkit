const Router = require('koa-router');
const { promises } = require('readline');
module.exports = class Plugin {

    constructor(dependencies) {
        this.app = {};
        this.router = new Router();
        // 接收注入的关键模块
        this.routerInterface = dependencies.routerInterface;
        this.mongoInterface = dependencies.mongoInterface;

        this.app.logger = dependencies.loggerInterface;
        this.app.redis = dependencies.redisInterface;
        this.app.pluginApi = dependencies.apiInterface;
        this.app.pluginEvent = dependencies.eventInterface;
        this.app.hook = dependencies.hookInterface;
    }


    initialize() {
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get('/', async ctx => {
            ctx.body = 'Response from Plugin A';
        });
        this.router.get('/menu', async ctx => {
            
            const listeners = Array.from(this.app.hook.getHookListeners("register_menu"))
                .map(listener => Promise.resolve().then(listener));

            const results = await Promise.allSettled(listeners);

            // 累加成功的菜单项
            const menus = results.reduce((accumulatedMenus, item) => {
                if(item.status === "rejected"){
                    this.app.logger.error(item.reason); 
                }
                if (item.status === "fulfilled" && item.value) {
                    return accumulatedMenus.concat(item.value);
                }
                return accumulatedMenus;
            }, []);

            // 设置响应体
            ctx.body = menus;
        });
        this.router.get('/getcache', async ctx => {
            // let value = await this.app.redis.get("test");
            let value = await this.app.redis.cGet("test2", async () => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve("66666666")
                    }, 1000);
                });
            });
            ctx.body = 'Response from Plugin A getcache:' + value;
        });
        this.router.get('/setcache', async ctx => {
            await this.app.redis.set("test", "test111111111");
            ctx.body = 'Response from Plugin A setcache';
        });
        // 其他路由...


        this.routerInterface && this.routerInterface.registerRoutes(this.router);
    }


};

// import { Router } from 'koa-router';

// export class Plugin {

//     constructor(dependencies) {
//         this.dependencies = dependencies;
//         this.router = new Router();
//     }

//     initialize() {
//         this.setupRoutes();
//         // 使用 this.registerRoutes 注册路由
//         this.dependencies.routerInterface.registerRoutes(this.router);
//         // 使用 this.mongooseWrapper.createModel 创建模型
//     }

//     setupRoutes() {
//         this.router.get('/', async ctx => {
//             ctx.body = 'Response from Plugin A';
//         });
//         // 其他路由...
//     }
// };
