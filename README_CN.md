# WBrick

WBrick 是一个为 Node.js Web应用设计的插件化系统框架。它允许开发者以模块化的方式构建和管理应用功能，提供了灵活的插件加载、路由管理、事件处理和数据库交互功能。

## 特点

- **插件化架构**：轻松添加、移除和更新应用的功能模块。
- **路由管理**：插件可以独立注册和管理自己的路由。
- **事件驱动**：支持事件的发布和订阅，促进插件间的通信和协作。
- **数据库集成**：提供封装的数据库操作，支持数据隔离和安全的数据访问。
- **灵活性和扩展性**：简单的API和灵活的设计，适用于各种应用需求。


## 安装

使用 npm 安装 WBrick:

```bash
npm install wbrick
```

## 快速开始
以下是如何在您的 Node.js 应用中使用 WBrick 的一个基本示例。

首先，创建一个插件：

```javascript
// /plugins/YourPlugin/index.js
const Router = require('koa-router');
module.exports = class Plugin {

    constructor(dependencies) {
        this.dependencies = dependencies;
        this.router = new Router();
    }

    initialize() {
        this.setupRoutes();
        // 使用 this.registerRoutes 注册路由
        this.dependencies.routerInterface.registerRoutes(this.router);
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
```

然后，在您的应用中加载并初始化插件：

```javascript
// /app.js
const Koa = require('koa');
const { PluginLoader } = require('wbrick');

const pluginLoader = new PluginLoader();
pluginLoader.initialize().then(() => {
    const app = new Koa();
    app.use(pluginLoader.getRouteMiddleware());
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});

```
## 插件核心模块

以下是在插件构函数中`constructor(dependencies)`注入的核心模块，dependencies 对象接口定义如下

``` javascript 
export interface PluginDependencies {
    routerInterface?: RouteInterface;   // 路由接口模块,暴露路由注册方法，让每个插件可以拥有自己的路由
    eventInterface?: EventInterface;    // 事件循环通讯模块，通过事件的发布、订阅、取消订阅，实现插件之间的事件通讯机制，接口如下
    apiInterface?: ApiInterface;        // 接口通讯模块，通过插件的API注册、调用。实现插件之间的通讯
    mongoInterface?: MongoInterface;    // mongodb组件的数据访问功能，提供mongodb数据库管理功能
    redisInterface?: RedisInterface;    // redis缓存组件，提供缓存读写功能
    loggerInterface?: LoggerInterface;  //日志管理器，统一的日志管理器，允许插件记录自己的日志
}
```

具体接口定义请查看源码，文档延后

## 可能会实现的功能[实现中...]

1. **配置管理器**：用于管理和访问配置文件中的设置。插件可能需要读取或修改配置，配置管理器可以提供一个统一的接口来安全地处理这些操作。

2. **任务调度器**：若应用涉及定时任务或后台作业，任务调度器可以管理这些任务的执行。插件可以注册自己的定时任务，调度器则负责按计划执行它们。

3. **权限和安全管理**：若系统涉及到用户权限或安全相关的功能，可以提供一个安全管理服务，用于处理身份验证、授权、加密、访问控制等。

4. **国际化和本地化**：对于多语言支持的应用，提供国际化（i18n）服务来帮助插件根据用户的语言偏好显示内容。

5. **通知和消息服务**：用于在插件之间或与用户之间发送消息或通知，可以是内部的消息队列或集成外部通知系统（如电子邮件、短信等）。

6. **数据缓存**：可以提供缓存服务，插件可以利用它来缓存数据，减少对数据库或外部服务的请求。

7. **UI/UX 组件库**：提供一组共享的 UI 组件可以帮助保持界面的一致性和降低开发成本。

8. **插件依赖管理**：管理插件之间的依赖关系，确保依赖的插件被正确加载。

9. **健康检查和监控**：监控插件的健康状况，提供系统状态的实时信息。

## 文档

更详细的文档和API参考请查看 [文档链接]()。

## 许可证
MIT © shitiandmw