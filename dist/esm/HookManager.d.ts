import { LoggerInterface } from './LoggerManager';
export declare class HookManager {
    private logger;
    private hooks;
    constructor(logger: LoggerInterface);
    private formatHookName;
    private getHookListeners;
    registerHook(pluginName: string, hookName: string, listener: (...args: any[]) => any): void;
    triggerHook(pluginName: string, hookName: string, ...args: any[]): any[];
    removeHook(pluginName: string, hookName: string, listener: (...args: any[]) => void): void;
    /**
     * 获取钩子操作接口
     * @param pluginName 插件名
     * @returns
     */
    getInterface(pluginName: string): HookInterface;
}
export interface HookInterface {
    registerHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => void;
    removeHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => void;
    triggerHook: (hookName: string, ...args: any[]) => void;
    getHookListeners: (hookName: string, ...args: any[]) => Set<(...args: any[]) => any>;
}
