const Router = require('koa-router');
module.exports = class Plugin {

    constructor(dependencies) {
        this.dependencies = dependencies;
        this.router = new Router();
        this.registerRoutes = registerRoutes;
        this.mongooseWrapper = mongooseWrapper;
    }

    initialize() {
        this.setupRoutes();
        // 使用 this.registerRoutes 注册路由
        this.dependencies.routerInterface.registerRoutes("test",this.router);
        // 使用 this.mongooseWrapper.createModel 创建模型
    }

    setupRoutes() {
        this.router.get('/', async ctx => {
            console.log("plugin.path",ctx.path);
            ctx.body = 'Response from Plugin A';
        });
        // 其他路由...
    }
};
