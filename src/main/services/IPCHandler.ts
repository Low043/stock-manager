import { ipcMain, IpcMainEvent } from 'electron';

type IPCCallback = (event: IpcMainEvent, ...args: unknown[]) => void;

interface IPCChannel {
    channel: string;
    handler: IPCCallback;
}

export class IPCHandler {
    private channels: IPCChannel[] = [{ channel: 'ping', handler: this.onPing.bind(this) }];

    public register(): void {
        this.channels.forEach(({ channel, handler }) => {
            ipcMain.on(channel, handler);
        });
    }

    public unregister(): void {
        this.channels.forEach(({ channel }) => {
            ipcMain.removeAllListeners(channel);
        });
    }

    private onPing(): void {
        console.log('pong');
    }
}
