import type { BrowserWindow } from 'electron';
import { WindowFactory } from './_factory';
import { singleton } from 'tsyringe';

@singleton()
export class MainWindow {
    constructor(private readonly windowFactory: WindowFactory) {}

    public create(): BrowserWindow {
        return this.windowFactory.create('index.html');
    }
}
