import { getControllers } from './decorators';
import { singleton } from 'tsyringe';
import { ipcMain } from 'electron';

import.meta.glob('./controllers/*Controller.ts', { eager: true });

@singleton()
export class IPCHandler {
    public register(): void {
        getControllers().forEach((controller) => {
            controller.routes().forEach(({ channel, handler }) => {
                ipcMain.handle(channel, handler);
            });
        });
    }

    public unregister(): void {
        getControllers().forEach((controller) => {
            controller.routes().forEach(({ channel }) => {
                ipcMain.removeHandler(channel);
            });
        });
    }
}
