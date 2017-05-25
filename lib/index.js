const {BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');

function electronPrompt(options, parentWindow) {
    return new Promise((resolve, reject) => {
        const id = `${new Date().getTime()}-${Math.random()}`;

        const opts = Object.assign({
            title: 'Prompt',
            label: 'Please input a value:',
            value: ''
        }, options || {});

        let promptWindow = new BrowserWindow({
            width: 370, height: 130, 
            parent: parentWindow,
            skipTaskbar: true,
            modal: parentWindow instanceof BrowserWindow,
            title : opts.title,
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
            if(promptWindow) {
                ipcMain.removeListener('prompt-get-options:'+id, getOptionsListener);
                ipcMain.removeListener('prompt-post-data:'+id, postDataListener);
                ipcMain.removeListener('prompt-error:'+id, postDataListener);
                promptWindow.close();
                promptWindow = null;
            }
        };

        ipcMain.on('prompt-get-options:'+id, getOptionsListener);
        ipcMain.on('prompt-post-data:'+id, postDataListener);
        ipcMain.on('prompt-error:'+id, errorListener);
        promptWindow.on('unresponsive', unresponsiveListener);

        const promptUrl = url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, 'page', 'prompt.html'),
            hash: id
        });

        promptWindow.loadURL(promptUrl);
    });
}

module.exports = electronPrompt;