import { EventInterface } from './EventManager';
import { ApiInterface } from './ApiManager';
import { ModelFactoryInterface } from './ModelFactory';
import { RouteInterface } from './RouteManager';
export interface PluginDependencies {
    routerInterface?: RouteInterface;
    eventInterface?: EventInterface;
    apiInterface?: ApiInterface;
    modelFactoryInterface?: ModelFactoryInterface;
}
export interface Plugin {
    constructor(dependencies: PluginDependencies): void;
    initialize(): void;
}
