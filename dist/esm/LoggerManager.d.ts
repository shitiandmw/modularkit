import { Logger } from "pino";
export declare class Pino {
    static instance: Logger;
    constructor();
    static getInstance(): Logger;
}
export interface LoggerInterface {
    trace(message: string): void;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string | any): void;
    fatal?(message: string): void;
}
