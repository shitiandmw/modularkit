import fs from 'fs';
import path from 'path';
import { RouteManager } from './RouteManager';
import { EventManager } from './EventManager';
import { ApiManager } from './ApiManager';
import { exec } from 'child_process';
import { LoggerManager } from './LoggerManager';
import { MongoManager } from './MongoManager';
import { RedisManager } from './RedisManager';
import { HookManager } from './HookManager';
/**
 * 插件加载器
 */
export class PluginLoader {
    routeManager;
    eventManager;
    apiManager;
    mongoManager;
    redisManager;
    loggerManager;
    pluginsPath;
    logger;
    hookManager;
    constructor(dependencies = {}) {
        this.pluginsPath = dependencies.pluginsPath || path.join(process.cwd(), 'plugins');
        this.loggerManager = new LoggerManager();
        this.logger = this.loggerManager.getInstance();
        this.eventManager = new EventManager();
        this.apiManager = new ApiManager();
        this.routeManager = new RouteManager(this.logger);
        this.hookManager = new HookManager(this.logger);
        this.mongoManager = new MongoManager(this.logger);
        this.redisManager = new RedisManager(this.logger);
    }
    // 初始化插件
    async initialize() {
        await this.mongoManager.initialize();
        await this.redisManager.initialize();
        await this.loadPlugins();
    }
    // 获取路由中间件
    getRouteMiddleware() {
        return this.routeManager.routeMiddleware();
    }
    // 加载所有插件
    async loadPlugins() {
        try {
            let plugins = await new Promise((resolve, reject) => {
                fs.readdir(this.pluginsPath, (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
            for (let pluginName of plugins) {
                if (fs.statSync(path.join(this.pluginsPath, pluginName)).isDirectory()) {
                    await this.installPluginNPM(pluginName);
                    await this.loadPlugin(pluginName);
                }
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    // 安装插件依赖的NPM包
    async installPluginNPM(pluginName) {
        try {
            const pluginPath = path.join(this.pluginsPath, pluginName);
            if (fs.existsSync(`${pluginPath}/package.json`)) {
                this.logger.info(`Installing NPM dependencies for plugin ${pluginPath}`);
                await new Promise((resolve, reject) => {
                    exec(`npm install`, { cwd: pluginPath }, (error, stdout, stderr) => {
                        if (error)
                            reject(error);
                        else
                            resolve({});
                    });
                });
                this.logger.info(`Dependencies installed for ${pluginName}`);
            }
            else
                this.logger.warn(`No package.json found for plugin ${pluginName}`);
        }
        catch (error) {
            let error_message = `Installation failed for ${pluginName}`;
            if (error instanceof Error)
                error_message += `:${error.message}`;
            if (typeof error === "object" && error !== null && "stderr" in error)
                error_message += `:${error.stderr}`;
            this.logger.error(error_message);
        }
    }
    // 加载插件
    async loadPlugin(pluginName) {
        try {
            this.logger.info(`Loading plugin ${pluginName} ...`);
            const pluginPath = path.join(this.pluginsPath, pluginName);
            // const PluginModule = await import(pluginPath); 
            const PluginModule = require(pluginPath);
            const PluginClass = PluginModule.default || PluginModule.Plugin || PluginModule;
            const pluginDependencies = {
                routerInterface: this.routeManager.getInterface(pluginName),
                eventInterface: this.eventManager.getInterface(pluginName),
                apiInterface: this.apiManager.getInterface(pluginName),
                mongoInterface: this.mongoManager.getInterface(pluginName),
                redisInterface: this.redisManager.getInterface(pluginName),
                loggerInterface: this.loggerManager.getInstance(pluginName),
                hookInterface: this.hookManager.getInterface(pluginName)
            };
            const plugin = new PluginClass(pluginDependencies);
            plugin.initialize();
            this.logger.info(`Loading plugin ${pluginName} completed `);
        }
        catch (error) {
            this.logger.error(`Error loading plugin ${pluginName}: ${error instanceof Error ? error.message : ""}`);
        }
    }
}
export { BaseContext, Service, Controller } from './core/BaseContext';
export { Loader } from './core/Loader';
//# sourceMappingURL=index.js.map