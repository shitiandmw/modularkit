"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = exports.Loader = exports.Controller = exports.Service = exports.BaseContext = exports.PluginLoader = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const RouteManager_1 = require("./RouteManager");
const EventManager_1 = require("./EventManager");
const ApiManager_1 = require("./ApiManager");
const child_process_1 = require("child_process");
const LoggerManager_1 = require("./LoggerManager");
const MongoManager_1 = require("./MongoManager");
const RedisManager_1 = require("./RedisManager");
const HookManager_1 = require("./HookManager");
/**
 * 插件加载器
 */
class PluginLoader {
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
        this.pluginsPath = dependencies.pluginsPath || path_1.default.join(process.cwd(), 'plugins');
        this.loggerManager = new LoggerManager_1.LoggerManager();
        this.logger = this.loggerManager.getInstance();
        this.eventManager = new EventManager_1.EventManager();
        this.apiManager = new ApiManager_1.ApiManager();
        this.routeManager = new RouteManager_1.RouteManager(this.logger);
        this.hookManager = new HookManager_1.HookManager(this.logger);
        this.mongoManager = new MongoManager_1.MongoManager(this.logger);
        this.redisManager = new RedisManager_1.RedisManager(this.logger);
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
                fs_1.default.readdir(this.pluginsPath, (err, res) => {
                    if (err)
                        reject(err);
                    else
                        resolve(res);
                });
            });
            for (let pluginName of plugins) {
                if (fs_1.default.statSync(path_1.default.join(this.pluginsPath, pluginName)).isDirectory()) {
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
            const pluginPath = path_1.default.join(this.pluginsPath, pluginName);
            if (fs_1.default.existsSync(`${pluginPath}/package.json`)) {
                this.logger.info(`Installing NPM dependencies for plugin ${pluginPath}`);
                await new Promise((resolve, reject) => {
                    (0, child_process_1.exec)(`npm install`, { cwd: pluginPath }, (error, stdout, stderr) => {
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
            const pluginPath = path_1.default.join(this.pluginsPath, pluginName);
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
exports.PluginLoader = PluginLoader;
var BaseContext_1 = require("./core/BaseContext");
Object.defineProperty(exports, "BaseContext", { enumerable: true, get: function () { return BaseContext_1.BaseContext; } });
Object.defineProperty(exports, "Service", { enumerable: true, get: function () { return BaseContext_1.Service; } });
Object.defineProperty(exports, "Controller", { enumerable: true, get: function () { return BaseContext_1.Controller; } });
var Loader_1 = require("./core/Loader");
Object.defineProperty(exports, "Loader", { enumerable: true, get: function () { return Loader_1.Loader; } });
var PluginInterface_1 = require("./PluginInterface");
Object.defineProperty(exports, "Plugin", { enumerable: true, get: function () { return PluginInterface_1.Plugin; } });
//# sourceMappingURL=index.js.map