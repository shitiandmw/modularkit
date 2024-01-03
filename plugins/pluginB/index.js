const Router = require('koa-router');
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
        // 注册菜单钩子
        this.app.hook.registerHook('pluginA','register_menu',async ()=>{
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve([{
                        name:"pluginA",
                        path:"/pluginA",
                        icon:"iconfont icon-ai-tool",
                        children:[{
                            name:"pluginA",
                            path:"/pluginA",
                            icon:"iconfont icon-ai-tool",
                        }]
                    }])
                },10);
            });
        }); 

        this.app.hook.registerHook('pluginA','register_menu',()=>{
            return [{
                name:"pluginA",
                path:"/pluginA",
                icon:"iconfont icon-ai-tool",
            }]
        });

        this.app.hook.registerHook('pluginA','register_menu',()=>{
            throw new Error("error");
        });
    }

    setupRoutes() {
        this.router.get('/', async ctx => {
            ctx.body = 'Response from Plugin A';
        });
        this.routerInterface && this.routerInterface.registerRoutes(this.router);
    }


};
