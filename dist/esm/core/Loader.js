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
                    else {
                        app.logger && app.logger.warn(`Class ${filePath} not found.`);
                    }
                }
                return instances[name];
            }
        });
    }
}
//# sourceMappingURL=Loader.js.map