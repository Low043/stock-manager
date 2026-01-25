import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { BrowserWindow, app } from 'electron';
import { MainWindow } from './windows/MainWindow';
import { AutoUpdater } from './services/AutoUpdater';
import { IPCHandler } from './ipc';
import { injectable } from 'tsyringe';

@injectable()
export class App {
    constructor(
        private readonly mainWindow: MainWindow,
        private readonly autoUpdater: AutoUpdater,
        private readonly ipcHandler: IPCHandler
    ) {}

    public start(): void {
        app.on('ready', this.configure.bind(this));
        app.on('window-all-closed', this.quit.bind(this));
    }

    private async configure(): Promise<void> {
        if (!is.dev) this.autoUpdater.initialize();
        await this.ipcHandler.register();
        this.mainWindow.create();

        electronApp.setAppUserModelId('com.low043.stockmanager');

        app.on('activate', this.createWindowIfNotExists.bind(this));

        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window);
        });
    }

    private createWindowIfNotExists(): void {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.mainWindow.create();
        }
    }

    private quit(): void {
        // macOS specific close process
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
}
