function init(): void {
    window.addEventListener('DOMContentLoaded', () => {
        doAThing();
    });
}

function doAThing(): void {
    const versions = window.electron.process.versions;
    replaceText('.electron-version', `Electron v${versions.electron}`);
    replaceText('.chrome-version', `Chromium v${versions.chrome}`);
    replaceText('.node-version', `Node v${versions.node}`);

    const pingButton = document.getElementById('ping');
    pingButton?.addEventListener('click', () => {
        window.electron.ipcRenderer.invoke('ping');
    });

    const crudUsersButton = document.getElementById('crud-users');
    crudUsersButton?.addEventListener('click', async () => {
        const users = await window.electron.ipcRenderer.invoke('user:create');
        console.log('All Users:', users);
    });
}

function replaceText(selector: string, text: string): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
        element.innerText = text;
    }
}

init();
