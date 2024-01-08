import { EventInterface } from './EventManager';
import { ApiInterface } from './ApiManager';
import { MongoInterface } from './MongoManager';
import { RouteInterface } from './RouteManager';
import { LoggerInterface } from './LoggerManager';
import { RedisInterface } from './RedisManager';
import { HookInterface } from './HookManager';
import assert from 'assert';
import fs from 'fs';
import { Loader } from './core/Loader';
import Router from 'koa-router';



export interface PluginDependencies {
    routerInterface?: RouteInterface;
    eventInterface?: EventInterface;
    apiInterface?: ApiInterface;
    mongoInterface?: MongoInterface;
    redisInterface?: RedisInterface;
    loggerInterface?: LoggerInterface;
    hookInterface?: HookInterface;
}

export interface PluginInterface {
    initialize(): void;
}

export interface AppInterface {
    logger?: LoggerInterface;
    redis?: RedisInterface;
    pluginApi?: ApiInterface;
    pluginEvent?: EventInterface;
    hook?: HookInterface;
    model?: any;
    controller?: any;
    service?: any;
}

export class Plugin implements PluginInterface {
    protected app?: AppInterface;
    protected routerInterface?: RouteInterface;
    protected mongoInterface?: MongoInterface;

    protected modelPath?: string;
    protected servicePath?: string;
    protected controllerPath?: string;

    constructor(protected dependencies: PluginDependencies) {

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

    public initialize(): void {

    }


    loadModel() {
        assert(this.app, ` App not set`)
        assert(this.modelPath, ` Model path not set`);
        assert(fs.existsSync(this.modelPath), `Model files ${this.modelPath} not found`);
        this.app.model = Loader.LoadModels(this.modelPath, this.mongoInterface);
    }

    LoadController() {
        assert(this.app, ` App not set`)
        assert(this.controllerPath, ` Controller path not set`);
        assert(fs.existsSync(this.controllerPath), `Controller files ${this.controllerPath} not found`);

        assert(this.servicePath, ` Service path not set`);
        assert(fs.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);

        this.app.controller = Loader.LoadControllers(this.controllerPath, this.app, this.servicePath);
    }

    loadService() {
        assert(this.app, ` App not set`)
        assert(this.servicePath, ` Service path not set`);
        assert(fs.existsSync(this.servicePath), `Service files ${this.servicePath} not found`);
        this.app.service = Loader.LoadServices(this.servicePath, this.app);
    }

    loadRouter(routes : Router ) {
        assert(this.routerInterface, ` Router interface not set`);
        this.routerInterface.registerRoutes(routes);
    }
}