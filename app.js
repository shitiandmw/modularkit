// const Koa = require('koa');
// const path = require('path');
// const { PluginLoader } = require('./dist/PluginLoader');

import Koa from 'koa';
import path from 'path';
import { PluginLoader } from './dist/PluginLoader.js';

(async () => {
    try {
        const app = new Koa();
        console.log(1111)
        const pluginLoader = new PluginLoader();
        console.log(2222)
        await pluginLoader.loadPlugins();
        console.log(3333)
        app.use(pluginLoader.getRouteMiddleware());
        console.log(4444)

        let server = app.listen(3000, () => {
            console.log('Server running on http://localhost:3000');
        });

        console.log(server)
    } catch (error) {

        console.error(error)
    }
})