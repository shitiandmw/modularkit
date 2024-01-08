import fs from 'fs';
import path from 'path';
export class Loader {
    static loadClass(dirPath, app, ctx) {
        return new Proxy({}, {
            get: (instances, name) => {
                if (!instances[name]) {
                    const filePath = path.join(dirPath, `${name}.js`);
                    if (fs.existsSync(filePath)) {
                        const ContextClass = require(filePath);
                        instances[name] = new ContextClass(app);
                        if (ctx)
                            instances[name].setContext(ctx);
                    }
                    else
                        instances[name] = null;
                }
                return instances[name];
            }
        });
    }
    static LoadServices(servicePath, app, ctx) {
        return this.loadClass(servicePath, app, ctx);
    }
    static LoadControllers(controllerPath, app, servicePath) {
        const controllers = new Proxy({}, {
            get: (instances, name) => {
                if (!instances[name]) {
                    const filePath = path.join(controllerPath, `${name}.js`);
                    if (fs.existsSync(filePath)) {
                        const ControllerClass = require(filePath);
                        let controllerInstance = new ControllerClass(app);
                        instances[name] = new Proxy(controllerInstance, {
                            get: (proto, methodName) => {
                                if (typeof proto[methodName] === 'function') {
                                    return async (ctx) => {
                                        // 加载服务代理
                                        if (servicePath)
                                            ctx.service = this.LoadServices(servicePath, app, ctx);
                                        // 设置请求上下文
                                        controllerInstance.setContext(ctx);
                                        return await controllerInstance[methodName]();
                                    };
                                }
                                return proto[methodName];
                            }
                        });
                    }
                    else
                        instances[name] = null;
                }
                return instances[name];
            }
        });
        // fs.readdirSync(controllerPath).forEach(file => {
        //     const controllerName = path.basename(file, '.js');
        //     // 触发代理以预加载控制器
        //     if (controllers[controllerName] === undefined) {
        //         console.warn(`Controller ${controllerName} could not be loaded.`);
        //     }
        // });
        return controllers;
    }
    static LoadModels(modelPath, mongoInterface) {
        return new Proxy({}, {
            get: (instances, name) => {
                if (!instances[name]) {
                    const filePath = path.join(modelPath, `${name}.js`);
                    if (fs.existsSync(filePath) && mongoInterface)
                        instances[name] = require(filePath)(mongoInterface);
                    else
                        instances[name] = null;
                }
                return instances[name];
            }
        });
    }
}
//# sourceMappingURL=Loader.js.map