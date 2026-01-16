import { autoUpdater, UpdateInfo, ProgressInfo } from 'electron-updater';
import { dialog, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';

export class AutoUpdater {
    public initialize(): void {
        if (is.dev) return;

        this.configure();
        this.setupEventHandlers();
        this.checkForUpdates();
    }

    private configure(): void {
        autoUpdater.allowDowngrade = true;
        autoUpdater.autoDownload = false;
    }

    private setupEventHandlers(): void {
        autoUpdater.on('error', (error) => this.onError(error));
        autoUpdater.on('update-available', (info) => this.onUpdateAvailable(info));
        autoUpdater.on('download-progress', (progress) => this.onDownloadProgress(progress));
        autoUpdater.on('update-downloaded', (info) => this.onUpdateDownloaded(info));
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
