import { BrowserWindow, BrowserWindowConstructorOptions as WindowOptions, shell } from 'electron';
import icon from '/resources/icon.png?asset';
import { singleton } from 'tsyringe';
import path from 'path';

@singleton()
export class WindowFactory {
    private readonly baseUrl: string | undefined = process.env['ELECTRON_RENDERER_URL'];
    private readonly loadDelayMs: number = 100;

    public create(contentUrl: string, options?: Partial<WindowOptions>): BrowserWindow {
        const window = new BrowserWindow({
            ...options,
            width: options?.width ?? 900,
            height: options?.height ?? 670,
            minWidth: options?.minWidth ?? 640,
            minHeight: options?.minHeight ?? 480,
            autoHideMenuBar: options?.autoHideMenuBar ?? true,
            icon: options?.icon ?? icon,
            show: false, // Start hidden (will show on 'ready-to-show' event)
            webPreferences: {
                preload: path.join(__dirname, '../preload/index.js'),
                sandbox: false
            }
        });

        this.setupEventHandlers(window);
        this.loadContent(window, contentUrl);

        return window;
    }

    private setupEventHandlers(window: BrowserWindow): void {
        window.on('ready-to-show', () => {
            setTimeout(() => window.show(), this.loadDelayMs);
        });

        // Open links in the default browser
        window.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url);
            return { action: 'deny' };
        });
    }

    private loadContent(window: BrowserWindow, contentPath: string): void {
        if (this.baseUrl) {
            window.loadURL(path.join(this.baseUrl, contentPath));
            return;
        }

        window.loadFile(contentPath);
    }
}
