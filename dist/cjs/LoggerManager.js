"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pino = void 0;
const pino_1 = __importDefault(require("pino"));
class Pino {
    static instance;
    constructor() {
    }
    static getInstance() {
        if (!Pino.instance) {
            Pino.instance = (0, pino_1.default)({
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
exports.Pino = Pino;
//# sourceMappingURL=LoggerManager.js.map