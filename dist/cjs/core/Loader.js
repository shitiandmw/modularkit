"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Loader {
    static loadClass(dirPath, app, ctx) {
        return new Proxy({}, {
            get: (instances, name) => {
                if (!instances[name]) {
                    const filePath = path_1.default.join(dirPath, `${name}.js`);
                    if (fs_1.default.existsSync(filePath)) {
                        const ContextClass = require(filePath);
                        instances[name] = new ContextClass(app);
                        if (ctx)
                            instances[name].setContext(ctx);
                    }
                    else {
                        app.logger && app.logger.warn(`Class ${filePath} not found.`);
                    }
                }
                return instances[name];
            }
        });
    }
}
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map