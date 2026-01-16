import { autoUpdater, UpdateInfo, ProgressInfo } from 'electron-updater';
import { BrowserWindow, dialog } from 'electron';
import { singleton } from 'tsyringe';

@singleton()
export class AutoUpdater {
    public initialize(): void {
        this.configure();
        this.setupEventHandlers();
        this.checkForUpdates();
    }

    private configure(): void {
        autoUpdater.allowDowngrade = true;
        autoUpdater.autoDownload = false;
    }

    private setupEventHandlers(): void {
        autoUpdater.on('error', this.onError.bind(this));
        autoUpdater.on('update-available', this.onUpdateAvailable.bind(this));
        autoUpdater.on('download-progress', this.onDownloadProgress.bind(this));
        autoUpdater.on('update-downloaded', this.onUpdateDownloaded.bind(this));
    }

    private checkForUpdates(): void {
        autoUpdater.checkForUpdates();
    }

    private onError(error: Error): void {
        dialog.showErrorBox('Erro na atualização', error.message);
    }

    private async onUpdateAvailable(info: UpdateInfo): Promise<void> {
        const result = await dialog.showMessageBox({
            type: 'info',
            title: 'Atualização disponível',
            message: `Versão ${info.version} disponível. Deseja baixar?`,
            buttons: ['Sim', 'Não']
        });

        if (result.response === 0) {
            autoUpdater.downloadUpdate();
        }
    }

    private onDownloadProgress(progress: ProgressInfo): void {
        const window = BrowserWindow.getFocusedWindow();
        if (window) {
            window.setProgressBar(progress.percent / 100);
        }
    }

    private async onUpdateDownloaded(info: UpdateInfo): Promise<void> {
        const window = BrowserWindow.getFocusedWindow();
        if (window) {
            window.setProgressBar(-1);
        }

        const result = await dialog.showMessageBox({
            type: 'info',
            title: 'Atualização pronta',
            message: `Versão ${info.version} baixada. Reiniciar agora?`,
            buttons: ['Reiniciar', 'Depois']
        });

        if (result.response === 0) {
            autoUpdater.quitAndInstall();
        }
    }
}
