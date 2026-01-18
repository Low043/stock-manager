import { BaseController } from './controllers/_template';
import { container, singleton } from 'tsyringe';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ControllerConstructor = new (...args: any[]) => BaseController;

const CONTROLLER_REGISTRY: ControllerConstructor[] = [];

export function Controller() {
    return function <T extends ControllerConstructor>(target: T): T {
        singleton()(target);
        CONTROLLER_REGISTRY.push(target);
        return target;
    };
}

export function getControllers(): BaseController[] {
    return CONTROLLER_REGISTRY.map((ctrl) => container.resolve(ctrl) as BaseController);
}
