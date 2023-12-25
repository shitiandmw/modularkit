import { Logger } from "pino";
export declare class Pino {
    static instance: Logger;
    constructor();
    static getInstance(): Logger;
}
export interface LoggerInterface {
    trace(message: string | any): void;
    debug(message: string | any): void;
    info(message: string | any): void;
    warn(message: string | any): void;
    error(message: string | any): void;
    fatal?(message: string | any): void;
}
