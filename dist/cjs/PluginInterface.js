"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const Loader_1 = require("./core/Loader");
class Plugin {
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
        (0, assert_1.default)(this.app, ` App not set`);
        (0, assert_1.default)(this.modelPath, ` Model path not set`);
        (0, assert_1.default)(fs_1.default.existsSync(this.modelPath), `Model files ${this.modelPath} not found`);
        this.app.model = Loader_1.Loader.LoadModels(this.modelPath, this.mongoInterface);
    }
    LoadController() {
        (0, assert_1.default)(this.app, ` App not set`);
        (0, assert_1.default)(this.controllerPath, ` Controller path not set`);
        (0, assert_1.default)(fs_1.default.existsSync(this.controllerPath), `Controller files ${this.controllerPath} not found`);
        (0, assert_1.default)(this.servicePath, ` Service path not set`);
        (0, assert_1.default)(fs_1.default.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);
        this.app.controller = Loader_1.Loader.LoadControllers(this.controllerPath, this.app, this.servicePath);
    }
    loadService() {
        (0, assert_1.default)(this.app, ` App not set`);
        (0, assert_1.default)(this.servicePath, ` Service path not set`);
        (0, assert_1.default)(fs_1.default.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);
        this.app.service = Loader_1.Loader.LoadServices(this.servicePath, this.app);
    }
    loadRouter(routes) {
        (0, assert_1.default)(this.routerInterface, ` Router interface not set`);
        this.routerInterface.registerRoutes(routes);
    }
}
exports.Plugin = Plugin;
//# sourceMappingURL=PluginInterface.js.map