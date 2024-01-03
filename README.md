# WBrick


<div style="font-size: 1.5rem;">
  <a href="./README.md">English</a> |
  <a href="./README_CN.md">中文</a>
</div>
</br>


WBrick is a plugin-based system framework designed for Node.js Web applications. It allows developers to build and manage application features in a modular way, providing flexible plugin loading, route management, event handling, and database interaction capabilities.

## Features

- **Plugin Architecture**: Easily add, remove, and update the functional modules of the application.
- **Route Management**: Plugins can independently register and manage their own routes.
- **Event-Driven**: Supports the publication and subscription of events, promoting communication and collaboration between plugins.
- **Database Integration**: Provides encapsulated database operations, supporting data isolation and secure data access.
- **Flexibility and Extensibility**: Simple API and flexible design, suitable for a variety of application needs.

## Installation

Install WBrick using npm:

```bash
npm install wbrick
```

## Quick Start
Here is a basic example of how to use WBrick in your Node.js application.

First, create a plugin:

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
        // Use this.registerRoutes to register routes
        this.dependencies.routerInterface.registerRoutes(this.router);
        // Use this.mongooseWrapper.createModel to create models
    }

    setupRoutes() {
        this.router.get('/', async ctx => {
            console.log("plugin.path", ctx.path);
            ctx.body = 'Response from Plugin A';
        });
        // Other routes...
    }
};
```

Then, load and initialize the plugin in your application:

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

## Core Plugin Modules

The following are the core modules injected in the plugin constructor `constructor(dependencies)`. The `dependencies` object interface is defined as follows:

```javascript
export interface PluginDependencies {
    routerInterface?: RouteInterface;   // Router Interface Module, exposes router registration methods, allowing each plugin to have its own routes.
    eventInterface?: EventInterface;    // Event Loop Communication Module, implements inter-plugin event communication through event publishing, subscribing, and unsubscribing. The interface is as follows:
    apiInterface?: ApiInterface;        // Interface Communication Module, enables plugin API registration and invocation, facilitating communication between plugins.
    mongoInterface?: MongoInterface;    // Data access functionality for the MongoDB component, providing MongoDB database management capabilities.
    redisInterface?: RedisInterface;    // Redis caching component, offering caching read and write functionality.
    loggerInterface?: LoggerInterface;  // Log manager, a unified log manager that allows plugins to record their own logs.
    hookInterface?: HookInterface;      // Hook manager, providing plug-in direct hook function registration and triggering
}
```
For specific interface definitions, please refer to the source code. Documentation to follow.

## Features to be Potentially Implemented [In Progress...]

1. **Configuration Manager**: For managing and accessing settings in configuration files. Plugins may need to read or modify configurations, and the configuration manager can provide a unified interface for safely handling these operations.

2. **Task Scheduler**: If the application involves scheduled tasks or background jobs, the task scheduler can manage the execution of these tasks. Plugins can register their own scheduled tasks, and the scheduler is responsible for executing them according to the schedule.

3. **Permissions and Security Management**: If the system involves user permissions or security-related features, a security management service can be provided to handle authentication, authorization, encryption, access control, etc.

4. **Internationalization and Localization**: For applications supporting multiple languages, provide internationalization (i18n) services to help plugins display content according to users' language preferences.

5. **Notification and Messaging Services**: For sending messages or notifications between plugins or with users, which can be an internal message queue or integrated with external notification systems (such as email, SMS, etc.).

6. **Data Caching**: A caching service can be provided for plugins to cache data, reducing requests to the database or external services.

7. **UI/UX Component Library**: Offering a set of shared UI components to help maintain interface consistency and reduce development costs.

8. **Plugin Dependency Management**: Managing the dependencies between plugins, ensuring that dependent plugins are correctly loaded.

9. **Health Checks and Monitoring**: Monitoring the health of plugins and providing real-time information on system status.

## Documentation

For more detailed documentation and API reference, please see [Documentation Link]().

## Example

Sample project address: [Link](https://github.com/shitiandmw/wbrick-demo.git)


## License
MIT © shitiandmw