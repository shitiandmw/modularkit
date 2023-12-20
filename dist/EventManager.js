import { EventEmitter } from 'events';
export class EventManager extends EventEmitter {
    constructor() {
        super();
    }
    formatEventName(pluginName, event) {
        return `${pluginName}:${event}`;
    }
    /**
     * 获取事件操作接口
     * @param pluginName 插件名
     * @returns
     */
    getInterface(pluginName) {
        return {
            subscribe: (targetPluginName, event, listener) => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.on(formattedEvent, listener);
            },
            subscribeOnce: (targetPluginName, event, listener) => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.once(formattedEvent, listener);
            },
            publish: (event, data) => {
                const formattedEvent = this.formatEventName(pluginName, event);
                this.emit(formattedEvent, data);
            },
            unsubscribe: (targetPluginName, event, listener) => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.off(formattedEvent, listener);
            }
        };
    }
}
