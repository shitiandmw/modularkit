import { Logger } from "pino";
export declare class LoggerManager {
    instance: Logger;
    constructor();
    formatInput(input: string | any, pluginName?: string): any;
    getInstance(pluginName?: string): LoggerInterface;
}
export interface LoggerInterface {
    trace(input: string | any): void;
    debug(input: string | any): void;
    info(input: string | any): void;
    warn(input: string | any): void;
    error(input: string | any): void;
    fatal?(input: string | any): void;
}
