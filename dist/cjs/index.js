"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginLoader = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const RouteManager_1 = require("./RouteManager");
const EventManager_1 = require("./EventManager");
const ApiManager_1 = require("./ApiManager");
const ModelFactory_1 = require("./ModelFactory");
const child_process_1 = require("child_process");
const LoggerManager_1 = require("./LoggerManager");
/**
 * 插件加载器
 */
class PluginLoader {
    routeManager;
    eventManager;
    apiManager;
    modelFactory;
    pluginsPath;
    logger;
    constructor(dependencies = {}) {
        this.pluginsPath = dependencies.pluginsPath || path_1.default.join(process.cwd(), 'plugins');
        this.logger = dependencies.logger || LoggerManager_1.Pino.getInstance();
        this.routeManager = new RouteManager_1.RouteManager();
        this.eventManager = new EventManager_1.EventManager();
        this.apiManager = new ApiManager_1.ApiManager();
        this.modelFactory = new ModelFactory_1.ModelFactory(mongoose_1.default);
    }
    // 初始化插件
    async initialize() {
        await this.connectDB();
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
    // 连接数据库
    async connectDB() {
        try {
            const db = config_1.default.get('db');
            this.logger.info("db.type" + db.type);
            if (db.type === 'mongodb') {
                await mongoose_1.default.connect(db.mongodbUri, { serverSelectionTimeoutMS: 5000 });
                this.logger.info('Database connected successfully');
            }
        }
        catch (error) {
            this.logger.error(`Database connection failed : ${error instanceof Error ? error.message : ""}}`);
            // 数据库连接失败退出应用
            process.exit(1);
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
            const PluginClass = require(pluginPath).default;
            const pluginDependencies = {
                routerInterface: this.routeManager.getInterface(pluginName),
                eventInterface: this.eventManager.getInterface(pluginName),
                apiInterface: this.apiManager.getInterface(pluginName),
                modelFactoryInterface: this.modelFactory.getInterface(pluginName),
                loggerInterface: this.logger
            };
            const plugin = new PluginClass(pluginDependencies);
            plugin.initialize();
        }
        catch (error) {
            this.logger.error(`Error loading plugin ${pluginName}: ${error instanceof Error ? error.message : ""}`);
        }
    }
}
exports.PluginLoader = PluginLoader;
//# sourceMappingURL=index.js.map