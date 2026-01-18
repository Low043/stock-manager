import { IpcMainInvokeEvent } from 'electron';

export interface IPCRoute {
    channel: string;
    handler: (event: IpcMainInvokeEvent, ...args: unknown[]) => unknown;
}

export abstract class BaseController {
    abstract routes(): IPCRoute[];
}
