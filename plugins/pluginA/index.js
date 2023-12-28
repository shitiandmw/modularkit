const Router = require('koa-router');
module.exports = class Plugin {

    constructor(dependencies) {
        this.dependencies = dependencies;
        this.router = new Router();
    }

    initialize() {
        this.setupRoutes();
        // 使用 this.registerRoutes 注册路由
        console.log("this.dependencies.routerInterface",this.dependencies.routerInterface.toString())
        this.dependencies.routerInterface.registerRoutes(this.router);
        // 使用 this.mongooseWrapper.createModel 创建模型
    }

    setupRoutes() {
        this.router.get('/', async ctx => {
            console.log("plugin.path",ctx.path);
            ctx.body = 'Response from Plugin A';
        });
        this.router.get('/getcache', async ctx => {
            console.log("plugin.path",ctx.path);
            let value = await this.dependencies.redisInterface.get("test");
            ctx.body = 'Response from Plugin A getcache:'+ value;
        });
        this.router.get('/setcache', async ctx => {
            console.log("plugin.path",ctx.path);
            this.dependencies.redisInterface.set("test","test111111111");
            ctx.body = 'Response from Plugin A setcache';
        });
        // 其他路由...
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
//             console.log("plugin.path",ctx.path);
//             ctx.body = 'Response from Plugin A';
//         });
//         // 其他路由...
//     }
// };
