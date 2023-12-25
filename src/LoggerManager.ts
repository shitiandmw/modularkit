import pino, { Logger } from "pino";
export class Pino {
    static instance: Logger;
    constructor() {

    }
    public static getInstance(): Logger {
        if (!Pino.instance) {
            Pino.instance = pino({
                level: 'trace',
                // 使用pino-pretty格式化输出后，pm2的集群模式无法输出日志，暂时不使用
                // transport: {
                //     target: 'pino-pretty'
                // },
            });
        }
        return Pino.instance
    }
}

export interface LoggerInterface {
    trace(message: string | any): void; // 跟踪
    debug(message: string | any): void; // 调试 
    info(message: string | any): void;  // 信息
    warn(message: string | any): void;  // 警告
    error(message: string | any): void;  // 错误
    fatal?(message: string | any): void;  // 致命
}