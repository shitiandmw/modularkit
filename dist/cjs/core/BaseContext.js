"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.Controller = exports.BaseContext = void 0;
class BaseContext {
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
exports.BaseContext = BaseContext;
class Controller extends BaseContext {
}
exports.Controller = Controller;
class Service extends BaseContext {
}
exports.Service = Service;
//# sourceMappingURL=BaseContext.js.map