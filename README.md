# WBrick


<div style="font-size: 1.5rem;">
  <a href="./README.md">English</a> |
  <a href="./README_CN.md">中文</a>
</div>
</br>


WBrick is a plugin-based system framework designed for Node.js web applications. It allows developers to build and manage application features in a modular way, providing flexible plugin loading, route management, event handling, and database interaction.

## Features

- **Plugin-based Architecture**: Easily add, remove, and update functional modules of the application.
- **Route Management**: Plugins can independently register and manage their own routes.
- **Event-driven**: Supports the publication and subscription of events, facilitating communication and collaboration between plugins.
- **Database Integration**: Provides encapsulated database operations, supporting data isolation and secure data access.
- **Flexibility and Extensibility**: Simple API and flexible design suitable for various application needs.

## Installation

Install WBrick using npm:

```bash
npm install WBrick
```

## Getting Started
Here's a basic example of how to use WBrick in your Node.js application.

First, create a plugin:

```javascript
// plugins/YourPlugin.js
class YourPlugin {
    constructor(WBrick) {
        this.routeManager = WBrick.routeManager;
        // ...other managers
    }

    initialize() {
        // Plugin initialization code
    }
}

module.exports = YourPlugin;
```

Then, load and initialize the plugin in your application:

```javascript
const Koa = require('koa');
const { PluginLoader } = require('WBrick');
const path = require('path');

const app = new Koa();
const pluginLoader = new PluginLoader(path.join(__dirname, 'plugins'));
pluginLoader.loadPlugins();

app.use(pluginLoader.routeManager.routeMiddleware());

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
```

## Documentation

For more detailed documentation and API reference, please check [Documentation Link]().

## License
MIT © shitiandmw
