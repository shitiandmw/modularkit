"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerManager = void 0;
const pino_1 = __importDefault(require("pino"));
class LoggerManager {
    instance;
    constructor() {
        this.instance = (0, pino_1.default)({
            level: 'trace',
            // 使用pino-pretty格式化输出后，pm2的集群模式无法输出日志，暂时不使用
            // transport: {
            //     target: 'pino-pretty'
            // },
        });
    }
    formatInput(input, pluginName) {
        if (pluginName) {
            if (typeof input === 'string')
                input = `[${pluginName}]${input}`;
            else if (typeof input === 'object' && 'message' in input)
                input.message = `[${pluginName}]${input.message}`;
        }
        return input;
    }
    getInstance(pluginName) {
        return {
            trace: (input) => {
                this.instance.trace(this.formatInput(input, pluginName));
            },
            debug: (input) => {
                this.instance.debug(this.formatInput(input, pluginName));
            },
            info: (input) => {
                this.instance.info(this.formatInput(input, pluginName));
            },
            warn: (input) => {
                this.instance.warn(this.formatInput(input, pluginName));
            },
            error: (input) => {
                this.instance.error(this.formatInput(input, pluginName));
            },
            fatal: (input) => {
                this.instance.fatal(this.formatInput(input, pluginName));
            },
        };
    }
}
exports.LoggerManager = LoggerManager;
//# sourceMappingURL=LoggerManager.js.map