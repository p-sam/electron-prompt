const electron = require('electron');
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const url = require('url');
const path = require('path');

function electronPrompt(options, parentWindow) {
    return new Promise((resolve, reject) => {
        const id = `${new Date().getTime()}-${Math.random()}`;

        const opts = Object.assign({
            title: 'Prompt',
            label: 'Please input a value:',
            value: '',
            alwaysOnTop: true,
            type: '',
            selectOptions: ''
        }, options || {});

        let promptWindow = new BrowserWindow({
            width: 370, height: 130,
            resizable: false,
            parent: parentWindow ? (parentWindow instanceof BrowserWindow) : null,
            skipTaskbar: true,
            alwaysOnTop: opts.alwaysOnTop,
            useContentSize: true,
            modal: parentWindow ? true : false,
            title: opts.title,
            type: 'text'
        });

        promptWindow.setMenu(null);

        const getOptionsListener = (event) => {
            event.returnValue = JSON.stringify(opts);
        };

        const postDataListener = (event, value) => {
            resolve(value);
            event.returnValue = null;
            cleanup();
        };

        const unresponsiveListener = () => {
            reject(new Error('Window was unresponsive'));
            cleanup();
        };

        const errorListener = (event, message) => {
            reject(new Error(message));
            event.returnValue = null;
            cleanup();
        };

        const cleanup = () => {
            if (promptWindow) {
                promptWindow.close();
                promptWindow = null;
            }
        };

        ipcMain.on('prompt-get-options:' + id, getOptionsListener);
        ipcMain.on('prompt-post-data:' + id, postDataListener);
        ipcMain.on('prompt-error:' + id, errorListener);
        promptWindow.on('unresponsive', unresponsiveListener);

        promptWindow.on('closed', () => {
            ipcMain.removeListener('prompt-get-options:' + id, getOptionsListener);
            ipcMain.removeListener('prompt-post-data:' + id, postDataListener);
            ipcMain.removeListener('prompt-error:' + id, postDataListener);
            resolve(null);
        });

        const promptUrl = url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, 'page', (options.type == 'select' ? 'select.html' : 'prompt.html')),
            hash: id
        });

        promptWindow.loadURL(promptUrl);
    });
}

module.exports = electronPrompt;