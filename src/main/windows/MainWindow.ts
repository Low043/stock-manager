import { BrowserWindow, shell } from 'electron';
import { is } from '@electron-toolkit/utils';
import icon from '/resources/icon.png?asset';
import path from 'path';

export interface WindowConfig {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
}

export class MainWindow {
    private window: BrowserWindow | null = null;

    private readonly defaultConfig: WindowConfig = {
        width: 900,
        height: 670,
        minWidth: 640,
        minHeight: 480
    };

    constructor(private config: WindowConfig = {} as WindowConfig) {
        this.config = { ...this.defaultConfig, ...config };
    }

    public create(): BrowserWindow {
        this.window = new BrowserWindow({
            width: this.config.width,
            height: this.config.height,
            minWidth: this.config.minWidth,
            minHeight: this.config.minHeight,
            show: false,
            autoHideMenuBar: true,
            icon: icon,
            webPreferences: {
                preload: path.join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });

        this.setupEventHandlers();
        this.loadContent();

        return this.window;
    }

    public getWindow(): BrowserWindow | null {
        return this.window;
    }

    private setupEventHandlers(): void {
        if (!this.window) return;

        this.window.on('ready-to-show', () => {
            this.window?.show();
        });

        this.window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });
    }

    private loadContent(): void {
        if (!this.window) return;

        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.window.loadURL(process.env['ELECTRON_RENDERER_URL']);
        } else {
            this.window.loadFile(path.join(__dirname, '../renderer/index.html'));
        }
    }
}
