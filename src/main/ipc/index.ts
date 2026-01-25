import type { IPCRoutes, TemplateController } from './controllers/_template';
import { singleton, container } from 'tsyringe';
import { ipcMain } from 'electron';

type ImportedController = { default: new () => TemplateController };
type DynamicImportedControllers = Record<string, () => Promise<ImportedController>>;

@singleton()
export class IPCHandler {
    private routes: IPCRoutes = {};

    public async register(): Promise<void> {
        await this.loadControllers();
        Object.entries(this.routes).forEach(([channel, handler]) => {
            ipcMain.handle(channel, handler);
        });
    }

    public async unregister(): Promise<void> {
        Object.entries(this.routes).forEach(([channel]) => {
            ipcMain.removeHandler(channel);
        });
    }

    private async loadControllers(): Promise<void> {
        const controllers = import.meta.glob('./controllers/[^_]*.ts') as DynamicImportedControllers;
        for (const importController of Object.values(controllers)) {
            const controller = await importController();
            const controllerInstance = container.resolve(controller.default);
            this.routes = { ...this.routes, ...controllerInstance.getRoutes() };
        }
    }
}
