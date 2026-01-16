import { electronApp, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app } from 'electron';
import { MainWindow } from './windows/MainWindow';
import { AutoUpdater } from './services/AutoUpdater';
import { IPCHandler } from './services/IPCHandler';

export class App {
    private mainWindow: MainWindow;
    private autoUpdater: AutoUpdater;
    private ipcHandler: IPCHandler;

    constructor() {
        this.mainWindow = new MainWindow();
        this.autoUpdater = new AutoUpdater();
        this.ipcHandler = new IPCHandler();
    }

    public start(): void {
        app.on('ready', this.configure.bind(this));
        app.on('window-all-closed', this.quit.bind(this));
    }

    private configure(): void {
        this.mainWindow.create();
        this.ipcHandler.register();
        this.autoUpdater.initialize();

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
