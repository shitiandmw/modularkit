"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiManager = void 0;
class ApiManager {
    apis;
    constructor() {
        this.apis = {};
    }
    getInterface(pluginName) {
        return {
            registerApi: (apiName, handler) => {
                if (!this.apis[pluginName]) {
                    this.apis[pluginName] = {};
                }
                this.apis[pluginName][apiName] = handler;
            },
            callApi: (targetPluginName, apiName, ...args) => {
                const pluginApis = this.apis[targetPluginName];
                if (pluginApis && pluginApis[apiName]) {
                    return pluginApis[apiName](...args);
                }
                throw new Error(`API ${apiName} not found for plugin ${targetPluginName}`);
            }
        };
    }
}
exports.ApiManager = ApiManager;
//# sourceMappingURL=ApiManager.js.map