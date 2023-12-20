var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from 'config';
import { RouteManager } from './RouteManager';
import { EventManager } from './EventManager';
import { ApiManager } from './ApiManager';
import { ModelFactory } from './ModelFactory';
import { execa } from 'execa';
/**
 * 插件加载器
 */
export class PluginLoader {
    constructor(dependencies = {}) {
        this.pluginsPath = dependencies.pluginsPath || path.join(__dirname, '../plugins');
        this.logger = dependencies.logger || console;
        this.routeManager = new RouteManager();
        this.eventManager = new EventManager();
        this.apiManager = new ApiManager();
        this.modelFactory = new ModelFactory(mongoose);
    }
    // 初始化插件
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectDB();
            yield this.loadPlugins();
        });
    }
    // 获取路由中间件
    getRouteMiddleware() {
        return this.routeManager.routeMiddleware();
    }
    // 加载所有插件
    loadPlugins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let plugins = yield new Promise((resolve, reject) => {
                    fs.readdir(this.pluginsPath, (err, res) => {
                        if (err)
                            reject(err);
                        else
                            resolve(res);
                    });
                });
                for (let pluginName of plugins) {
                    if (fs.statSync(path.join(this.pluginsPath, pluginName)).isDirectory()) {
                        yield this.installPluginNPM(pluginName);
                        yield this.loadPlugin(pluginName);
                    }
                }
            }
            catch (error) {
                this.logger.error(error);
            }
        });
    }
    // 连接数据库
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = config.get('db');
                if (db.type === 'mongodb') {
                    yield mongoose.connect(db.mongodbUri, { serverSelectionTimeoutMS: 5000 });
                    this.logger.info('Database connected successfully');
                }
            }
            catch (error) {
                this.logger.error(`Database connection failed : ${error instanceof Error ? error.message : ""}}`);
                // 数据库连接失败退出应用
                process.exit(1);
            }
        });
    }
    // 安装插件依赖的NPM包
    installPluginNPM(pluginName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pluginPath = path.join(this.pluginsPath, pluginName);
                if (fs.existsSync(`${pluginPath}/package.json`)) {
                    this.logger.info(`Installing NPM dependencies for plugin ${pluginPath}`);
                    yield execa('npm', ['install'], { cwd: pluginPath });
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
        });
    }
    // 加载插件
    loadPlugin(pluginName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.logger.info(`Loading plugin ${pluginName}`);
                const pluginPath = path.join(this.pluginsPath, pluginName);
                const PluginClass = require(pluginPath).default;
                const pluginDependencies = {
                    routerInterface: this.routeManager.getInterface(pluginName),
                    eventInterface: this.eventManager.getInterface(pluginName),
                    apiInterface: this.apiManager.getInterface(pluginName),
                    modelFactoryInterface: this.modelFactory.getInterface(pluginName)
                };
                const plugin = new PluginClass(pluginDependencies);
                plugin.initialize();
            }
            catch (error) {
                this.logger.error(`Error loading plugin ${pluginName}: ${error instanceof Error ? error.message : ""}`);
            }
        });
    }
}
