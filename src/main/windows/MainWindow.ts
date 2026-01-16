import type { BrowserWindow } from 'electron';
import { WindowFactory } from '../services/WindowFactory';
import { singleton } from 'tsyringe';

@singleton()
export class MainWindow {
    constructor(private readonly windowFactory: WindowFactory) {}

    public create(): BrowserWindow {
        return this.windowFactory.create('index.html');
    }
}
