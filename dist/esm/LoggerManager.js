import pino from "pino";
export class Pino {
    static instance;
    constructor() {
    }
    static getInstance() {
        if (!Pino.instance) {
            Pino.instance = pino({
                level: 'trace',
                // 使用pino-pretty格式化输出后，pm2的集群模式无法输出日志，暂时不使用
                // transport: {
                //     target: 'pino-pretty'
                // },
            });
        }
        return Pino.instance;
    }
}
//# sourceMappingURL=LoggerManager.js.map