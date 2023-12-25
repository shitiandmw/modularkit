import pino, { Logger } from "pino";
export class Pino {
    static instance: Logger;
    constructor() {

    }
    public static getInstance(): Logger {
        if (!Pino.instance) {
            const transport = pino.transport({
                target: 'pino-pretty'
            });
            Pino.instance = pino({
                level: 'trace',
            }, transport);
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