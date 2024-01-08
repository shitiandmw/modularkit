import assert from 'assert';
import fs from 'fs';
import { Loader } from './core/Loader';
export class Plugin {
    dependencies;
    app;
    routerInterface;
    mongoInterface;
    modelPath;
    servicePath;
    controllerPath;
    constructor(dependencies) {
        this.dependencies = dependencies;
        // 接收注入的关键模块
        this.routerInterface = dependencies.routerInterface;
        this.mongoInterface = dependencies.mongoInterface;
        this.app = {};
        this.app.logger = dependencies.loggerInterface;
        this.app.redis = dependencies.redisInterface;
        this.app.pluginApi = dependencies.apiInterface;
        this.app.pluginEvent = dependencies.eventInterface;
        this.app.hook = dependencies.hookInterface;
        this.app.model = {};
        this.app.controller = {};
        this.app.service = {};
    }
    initialize() {
    }
    loadModel() {
        assert(this.app, ` App not set`);
        assert(this.modelPath, ` Model path not set`);
        assert(fs.existsSync(this.modelPath), `Model files ${this.modelPath} not found`);
        this.app.model = Loader.LoadModels(this.modelPath, this.mongoInterface);
    }
    LoadController() {
        assert(this.app, ` App not set`);
        assert(this.controllerPath, ` Controller path not set`);
        assert(fs.existsSync(this.controllerPath), `Controller files ${this.controllerPath} not found`);
        assert(this.servicePath, ` Service path not set`);
        assert(fs.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);
        this.app.controller = Loader.LoadControllers(this.controllerPath, this.app, this.servicePath);
    }
    loadService() {
        assert(this.app, ` App not set`);
        assert(this.servicePath, ` Service path not set`);
        assert(fs.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);
        this.app.service = Loader.LoadServices(this.servicePath, this.app);
    }
    loadRouter(routes) {
        assert(this.routerInterface, ` Router interface not set`);
        this.routerInterface.registerRoutes(routes);
    }
}
//# sourceMappingURL=PluginInterface.js.map