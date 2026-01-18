import { injectable } from 'tsyringe';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { BrowserWindow, app } from 'electron';
import { DatabaseConnection } from './database';
import { MainWindow } from './windows/MainWindow';
import { AutoUpdater } from './services/AutoUpdater';
import { IPCHandler } from './ipc';
import path from 'path';

@injectable()
export class App {
    private readonly dbPath = path.join(app.getPath('userData'), 'stock-manager.db');

    constructor(
        private readonly dbConnection: DatabaseConnection,
        private readonly mainWindow: MainWindow,
        private readonly autoUpdater: AutoUpdater,
        private readonly ipcHandler: IPCHandler
    ) {}

    public start(): void {
        app.on('ready', this.configure.bind(this));
        app.on('window-all-closed', this.quit.bind(this));
    }

    private configure(): void {
        this.dbConnection.connect(this.dbPath);

        if (!is.dev) this.autoUpdater.initialize();
        this.mainWindow.create();
        this.ipcHandler.register();

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
        this.ipcHandler.unregister();
        this.dbConnection.disconnect();

        // macOS specific close process
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
}
