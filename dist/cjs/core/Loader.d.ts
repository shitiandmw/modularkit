export declare class Loader {
    static loadClass(dirPath: string, app: any, ctx?: any): any;
    static LoadServices(servicePath: string, app: any, ctx?: any): any;
    static LoadControllers(controllerPath: string, app: any, servicePath?: string): any;
    static LoadModels(modelPath: string, mongoInterface: any): any;
}
