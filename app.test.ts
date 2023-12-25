const Koa = require('koa');
const { PluginLoader } = require('./src/index');

const pluginLoader = new PluginLoader();

pluginLoader.initialize().then(() => {
    const app = new Koa();
    app.use(pluginLoader.getRouteMiddleware());
    let server = app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});