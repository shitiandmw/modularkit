import fs from 'fs';
import path from 'path';

export class Loader {
    static loadClass(dirPath: string, app: any, ctx?: any) {
        return new Proxy({}, {
            get: (instances: any, name: string) => {
                if (!instances[name]) {
                    const filePath = path.join(dirPath, `${name}.js`);
                    if (fs.existsSync(filePath)) {
                        const ContextClass = require(filePath);
                        instances[name] = new ContextClass(app);
                        if(ctx) instances[name].setContext(ctx);
                    } else {
                        app.logger && app.logger.warn(`Class ${filePath} not found.`);
                    }
                }
                return instances[name];
            }
        });
    }
}