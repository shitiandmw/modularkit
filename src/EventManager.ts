import { EventEmitter } from 'events';

export class EventManager extends EventEmitter {
    constructor() {
        super();
    }

    private formatEventName(pluginName: string, event: string): string {
        return `${pluginName}:${event}`;
    }

    /**
     * 获取事件操作接口 
     * @param pluginName 插件名
     * @returns 
     */
    public getInterface(pluginName: string) {
        return {
            subscribe: (targetPluginName:string,event: string, listener: (...args: any[]) => void): void => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.on(formattedEvent, listener);
            },
            subscribeOnce: (targetPluginName:string,event: string, listener: (...args: any[]) => void): void => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.once(formattedEvent, listener);
            },
            publish: (event: string, data: any): void => {
                const formattedEvent = this.formatEventName(pluginName, event);
                this.emit(formattedEvent, data);
            },
            unsubscribe: (targetPluginName:string,event: string, listener: (...args: any[]) => void): void => {
                const formattedEvent = this.formatEventName(targetPluginName, event);
                this.off(formattedEvent, listener);
            }
        };
    }
}


export interface EventInterface {
    /**
     * 订阅事件 
     * @param targetPluginName 订阅事件所属的插件名
     * @param event 事件名
     * @param listener 事件处理函数
     */
    subscribe: (targetPluginName:string,event: string, listener: (...args: any[]) => void) => void;
    /**
     * 订阅一次性事件 
     * @param targetPluginName 订阅事件所属的插件名
     * @param event 事件名
     * @param listener 事件处理函数
     */
    subscribeOnce: (targetPluginName:string,event: string, listener: (...args: any[]) => void) => void;
    /**
     * 发布事件 
     * @param event 事件名 
     * @param data 事件处理函数 
     */
    publish: (event: string, data: any) => void;
    /**
     * 取消订阅事件 
     * @param targetPluginName 订阅事件所属的插件名
     * @param event 事件名
     * @param listener 事件处理函数
     */
    unsubscribe: (targetPluginName:string,event: string, listener: (...args: any[]) => void) => void;
}
