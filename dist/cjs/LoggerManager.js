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
            const transport = pino_1.default.transport({
                target: 'pino-pretty'
            });
            Pino.instance = (0, pino_1.default)({
                level: 'trace',
            }, transport);
        }
        return Pino.instance;
    }
}
exports.Pino = Pino;
//# sourceMappingURL=LoggerManager.js.map