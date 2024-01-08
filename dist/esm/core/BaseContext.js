export class BaseContext {
    app;
    ctx;
    constructor(app) {
        this.app = app;
        this.ctx = null;
    }
    setContext(ctx) {
        this.ctx = ctx;
    }
}
export class Controller extends BaseContext {
}
export class Service extends BaseContext {
}
//# sourceMappingURL=BaseContext.js.map