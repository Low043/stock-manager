import type { IpcMainInvokeEvent } from 'electron';

export type IPCHandler = (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown;
export type IPCRoutes = Record<string, IPCHandler>;

export abstract class TemplateController {
    abstract routes: IPCRoutes;

    public getRoutes(): IPCRoutes {
        return this.routes;
    }
}
