import { LoggerInterface } from './LoggerManager';
export class HookManager {
    // 存储钩子及其对应的监听器集合，每个钩子对应一个函数集合
    private hooks: Map<string, Set<(...args: any[]) => any>>;

    constructor(private logger: LoggerInterface) {
        this.hooks = new Map();
    }

    // 格式化钩子名称，使用插件名和钩子名创建一个唯一标识符
    private formatHookName(pluginName: string, hookName: string): string {
        return `${pluginName}:${hookName}`;
    }

    private getHookListeners(pluginName: string, hookName: string): Set<(...args: any[]) => any> {
        const formattedHookName = this.formatHookName(pluginName, hookName);
        if (!this.hooks.has(formattedHookName)) {
            this.hooks.set(formattedHookName, new Set());
        }
        return this.hooks.get(formattedHookName) as Set<(...args: any[]) => any>;
    }

    public registerHook(pluginName: string, hookName: string, listener: (...args: any[]) => any): void {
        const listeners = this.getHookListeners(pluginName, hookName);
        listeners.add(listener);
    }

    public triggerHook(pluginName: string, hookName: string, ...args: any[]): any[] {
        const listeners = this.getHookListeners(pluginName, hookName);
        return Array.from(listeners).map(listener => {
            try {
                return listener(...args);
            } catch (error) {
              this.logger.error(`Error in hook ${hookName} of plugin ${pluginName} `);   
              this.logger.error(error);
            }
        });
    }


    public removeHook(pluginName: string, hookName: string, listener: (...args: any[]) => void): void {
        const listeners = this.getHookListeners(pluginName, hookName);
        listeners.delete(listener);
    }

    /**
     * 获取钩子操作接口
     * @param pluginName 插件名
     * @returns 
     */
    public getInterface(pluginName: string): HookInterface {
        return {
            registerHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => {
                this.logger.info(`${pluginName} registerHook ${hookName}, targetPluginName: ${targetPluginName}`);
                return this.registerHook(targetPluginName, hookName, listener);
            },
            removeHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => {
                this.logger.info(`${pluginName} removeHook ${hookName}, targetPluginName: ${targetPluginName}`);
                this.removeHook(targetPluginName, hookName, listener);
            },
            triggerHook: (hookName: string, ...args: any[]) => {
                this.logger.info(`${pluginName} triggerHook ${hookName}`);
                return this.triggerHook(pluginName, hookName, ...args);
            },
            getHookListeners: (hookName: string, ...args: any[]) => {
                this.logger.info(`${pluginName} getHookListeners ${hookName}`);
                return this.getHookListeners(pluginName, hookName);
            },
        };
    }
}

export interface HookInterface {
    // 注册一个新的钩子监听器
    registerHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => void;
    // 移除一个钩子的特定监听器
    removeHook: (targetPluginName: string, hookName: string, listener: (...args: any[]) => void) => void;
    // 触发一个钩子，执行所有关联的监听器，并收集返回值
    triggerHook: (hookName: string, ...args: any[]) => void;
    // 获取给定钩子的监听器集合，如果不存在则创建一个新集合
    getHookListeners: (hookName: string, ...args: any[]) => Set<(...args: any[]) => any>;
}
