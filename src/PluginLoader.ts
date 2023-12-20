import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from 'config';
import { RouteManager } from './RouteManager';
import { EventManager , EventInterface } from './EventManager';
import { ApiManager } from './ApiManager';
import { ModelFactory } from './ModelFactory';
import { Plugin, PluginDependencies } from './Plugin';
import { execa } from 'execa';


interface LoggerInterface {
    trace(message: string): void; // 跟踪
    debug(message: string): void; // 调试 
    info(message: string): void;  // 信息
    warn(message: string): void;  // 警告
    error(message: string | any): void;  // 错误
    fatal?(message: string): void;  // 致命
}

interface PluginLoaderDependencies {
    // 自定义的插件路径
    pluginsPath?: string;
    // 日志记录器
    logger?: LoggerInterface;
}

interface DbConfig {
    type: string,
    mongodbUri: string
}

interface AppConfig {
    db: DbConfig
}

/**
 * 插件加载器
 */
export class PluginLoader {
    private routeManager: RouteManager;
    private eventManager: EventManager;
    private apiManager: ApiManager;
    private modelFactory: ModelFactory;

    private pluginsPath: string;
    private logger: LoggerInterface;

    constructor(dependencies: PluginLoaderDependencies = {}) {
        this.pluginsPath = dependencies.pluginsPath || path.join(__dirname, '../plugins');
        this.logger = dependencies.logger || console;
        this.routeManager = new RouteManager();
        this.eventManager = new EventManager();
        this.apiManager = new ApiManager();
        this.modelFactory = new ModelFactory(mongoose);
    }

    // 初始化插件
    public async initialize() {
        await this.connectDB();
        await this.loadPlugins();
    }

    // 获取路由中间件
    public getRouteMiddleware(){
        return this.routeManager.routeMiddleware();
    }


    // 加载所有插件
    public async loadPlugins() {
        try {
            let plugins: any = await new Promise((resolve, reject) => {
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
        } catch (error) {
            this.logger.error(error);
        }
        
    }


    // 连接数据库
    private async connectDB() {
        try {
            const db: DbConfig = config.get('db');
            if (db.type === 'mongodb') {
                await mongoose.connect(db.mongodbUri, { serverSelectionTimeoutMS: 5000 });
                this.logger.info('Database connected successfully');
            }
        } catch (error) {
            this.logger.error(`Database connection failed : ${ error instanceof Error ? error.message : "" }}`);
            // 数据库连接失败退出应用
            process.exit(1);
        }
    }

    // 安装插件依赖的NPM包
    private async installPluginNPM(pluginName: string) {
        try {
            const pluginPath = path.join(this.pluginsPath, pluginName);
            if (fs.existsSync(`${pluginPath}/package.json`)) {
                this.logger.info(`Installing NPM dependencies for plugin ${pluginPath}`);
                await execa('npm', ['install'], { cwd: pluginPath });
            }
            else this.logger.warn(`No package.json found for plugin ${pluginName}`);
        } catch (error) {
            let error_message = `Installation failed for ${pluginName}`;
            if (error instanceof Error)
                error_message += `:${error.message}`;
            if (typeof error === "object" && error !== null && "stderr" in error)
                error_message += `:${error.stderr}`;
            this.logger.error(error_message);
        }
    }

    // 加载插件
    private async loadPlugin(pluginName: string) {
        try {
            this.logger.info(`Loading plugin ${pluginName}`);
            const pluginPath = path.join(this.pluginsPath, pluginName);
            const PluginClass = require(pluginPath).default;
           
            const pluginDependencies: PluginDependencies = {
                routerInterface: this.routeManager.getInterface(pluginName),
                eventInterface: this.eventManager.getInterface(pluginName),
                apiInterface: this.apiManager.getInterface(pluginName),
                modelFactoryInterface: this.modelFactory.getInterface(pluginName)
            };
            const plugin: Plugin = new PluginClass(pluginDependencies);
            plugin.initialize();
        } catch (error) {
            this.logger.error(`Error loading plugin ${pluginName}: ${ error instanceof Error ? error.message : ""}`);
        }
    }
}
