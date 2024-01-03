type ApiHandler = (...args: any[]) => any;
export declare class ApiManager {
    private apis;
    constructor();
    getInterface(pluginName: string): ApiInterface;
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
export {};
