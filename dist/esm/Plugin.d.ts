import { EventInterface } from './EventManager';
import { ApiInterface } from './ApiManager';
import { ModelFactoryInterface } from './ModelFactory';
import { RouteInterface } from './RouteManager';
import { LoggerInterface } from './LoggerManager';
export interface PluginDependencies {
    routerInterface?: RouteInterface;
    eventInterface?: EventInterface;
    apiInterface?: ApiInterface;
    modelFactoryInterface?: ModelFactoryInterface;
    loggerInterface?: LoggerInterface;
}
export interface Plugin {
    constructor(dependencies: PluginDependencies): void;
    initialize(): void;
}
