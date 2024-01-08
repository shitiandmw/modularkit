export declare class BaseContext {
    private app;
    ctx: any;
    constructor(app: any);
    setContext(ctx: any): void;
}
export declare class Controller extends BaseContext {
}
export declare class Service extends BaseContext {
}
