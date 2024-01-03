export class HookManager {
    logger;
    // 存储钩子及其对应的监听器集合，每个钩子对应一个函数集合
    hooks;
    constructor(logger) {
        this.logger = logger;
        this.hooks = new Map();
    }
    // 格式化钩子名称，使用插件名和钩子名创建一个唯一标识符
    formatHookName(pluginName, hookName) {
        return `${pluginName}:${hookName}`;
    }
    getHookListeners(pluginName, hookName) {
        const formattedHookName = this.formatHookName(pluginName, hookName);
        if (!this.hooks.has(formattedHookName)) {
            this.hooks.set(formattedHookName, new Set());
        }
        return this.hooks.get(formattedHookName);
    }
    registerHook(pluginName, hookName, listener) {
        const listeners = this.getHookListeners(pluginName, hookName);
        listeners.add(listener);
    }
    triggerHook(pluginName, hookName, ...args) {
        const listeners = this.getHookListeners(pluginName, hookName);
        return Array.from(listeners).map(listener => {
            try {
                return listener(...args);
            }
            catch (error) {
                this.logger.error(`Error in hook ${hookName} of plugin ${pluginName} `);
                this.logger.error(error);
            }
        });
    }
    removeHook(pluginName, hookName, listener) {
        const listeners = this.getHookListeners(pluginName, hookName);
        listeners.delete(listener);
    }
    /**
     * 获取钩子操作接口
     * @param pluginName 插件名
     * @returns
     */
    getInterface(pluginName) {
        return {
            registerHook: (targetPluginName, hookName, listener) => {
                this.logger.info(`${pluginName} registerHook ${hookName}, targetPluginName: ${targetPluginName}`);
                return this.registerHook(targetPluginName, hookName, listener);
            },
            removeHook: (targetPluginName, hookName, listener) => {
                this.logger.info(`${pluginName} removeHook ${hookName}, targetPluginName: ${targetPluginName}`);
                this.removeHook(targetPluginName, hookName, listener);
            },
            triggerHook: (hookName, ...args) => {
                this.logger.info(`${pluginName} triggerHook ${hookName}`);
                return this.triggerHook(pluginName, hookName, ...args);
            },
            getHookListeners: (hookName, ...args) => {
                this.logger.info(`${pluginName} getHookListeners ${hookName}`);
                return this.getHookListeners(pluginName, hookName);
            },
        };
    }
}
//# sourceMappingURL=HookManager.js.map