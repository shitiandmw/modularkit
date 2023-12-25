import pino from "pino";
export class Pino {
    static instance;
    constructor() {
    }
    static getInstance() {
        if (!Pino.instance) {
            const transport = pino.transport({
                target: 'pino-pretty'
            });
            Pino.instance = pino({
                level: 'trace',
            }, transport);
        }
        return Pino.instance;
    }
}
//# sourceMappingURL=LoggerManager.js.map