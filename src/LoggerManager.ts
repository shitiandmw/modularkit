import pino, { Logger } from "pino";
export class LoggerManager {
    instance: Logger;
    constructor() {
        this.instance = pino({
            level: 'trace',
            // 使用pino-pretty格式化输出后，pm2的集群模式无法输出日志，暂时不使用
            // transport: {
            //     target: 'pino-pretty'
            // },
        });
    }

    public formatInput(input:string| any , pluginName?:string )
    {
        if (pluginName) {
            if(typeof input === 'string') input = `[${pluginName}]${input}`;
            else if(typeof input === 'object' && 'message' in input) input.message = `[${pluginName}]${input.message}`;
        }

        return input;
    }

    public getInstance(pluginName?:string): LoggerInterface {
        return {
            trace: (input: string | any): void => {
                this.instance.trace(this.formatInput(input,pluginName));
            },
            debug: (input: string | any): void => {
                this.instance.debug(this.formatInput(input,pluginName));
            },
            info: (input: string | any): void => {
                this.instance.info(this.formatInput(input,pluginName));
            },
            warn: (input: string | any): void => {
                this.instance.warn(this.formatInput(input,pluginName));
            },
            error: (input: string | any): void => {
                this.instance.error(this.formatInput(input,pluginName));
            },
            fatal: (input: string | any): void => {
                this.instance.fatal(this.formatInput(input,pluginName));
            },
        };
    }
}

export interface LoggerInterface {
    trace(input: string | any): void; // 跟踪
    debug(input: string | any): void; // 调试 
    info(input: string | any): void;  // 信息
    warn(input: string | any): void;  // 警告
    error(input: string | any): void;  // 错误
    fatal?(input: string | any): void;  // 致命
}