type ApiHandler = (...args: any[]) => any;

export class ApiManager {
    private apis: { [pluginName: string]: { [apiName: string]: ApiHandler } };

    constructor() {
        this.apis = {};
    }

    public getInterface(pluginName: string) {
        return {
            registerApi: (apiName: string, handler: ApiHandler): void => {
                if (!this.apis[pluginName]) {
                    this.apis[pluginName] = {};
                }
                this.apis[pluginName][apiName] = handler;
            },
            callApi: (targetPluginName: string, apiName: string, ...args: any[]): any => {
                const pluginApis = this.apis[targetPluginName];
                if (pluginApis && pluginApis[apiName]) {
                    return pluginApis[apiName](...args);
                }
                throw new Error(`API ${apiName} not found for plugin ${targetPluginName}`);
            }
        };
    }
}

export interface ApiInterface {
    /**
     * 注册 API 
     * @param apiName 需要注册的API名称  
     * @param handler API处理函数 
     * @returns 
     */
    registerApi: (apiName: string, handler: ApiHandler) => void;

    /**
     * 调用 API 
     * @param targetPluginName 调用的API所属的插件名 
     * @param apiName 需要调用的API名称 
     * @param args API处理函数的参数 
     * @returns 
     */
    callApi: (targetPluginName: string, apiName: string, ...args: any[]) => any;
}
