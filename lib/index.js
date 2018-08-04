const electron = require('electron');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const url = require('url');
const path = require('path');

function electronPrompt(options, parentWindow) {
	return new Promise((resolve, reject) => {
		const id = `${new Date().getTime()}-${Math.random()}`;

		const opts = Object.assign(
			{
				width: 370,
				height: 130,
				resizable: false,
				title: 'Prompt',
				label: 'Please input a value:',
				alwaysOnTop: false,
				value: null,
				type: 'input',
				selectOptions: null,
				icon: null
			},
			options || {}
		);

		if (opts.type === 'select' && (opts.selectOptions === null || typeof opts.selectOptions !== 'object')) {
			return reject(new Error('"selectOptions" must be an object'));
		}

		let promptWindow = new BrowserWindow({
			width: opts.width,
			height: opts.height,
			resizable: opts.resizable,
			parent: parentWindow instanceof BrowserWindow ? parentWindow : null,
			skipTaskbar: true,
			alwaysOnTop: opts.alwaysOnTop,
			useContentSize: true,
			modal: Boolean(parentWindow instanceof BrowserWindow),
			title: opts.title,
			icon: opts.icon
		});

		promptWindow.setMenu(null);

		const getOptionsListener = event => {
			event.returnValue = JSON.stringify(opts);
		};

		const cleanup = () => {
			if (promptWindow) {
				promptWindow.close();
				promptWindow = null;
			}
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
			pathname: path.join(__dirname, 'page', 'prompt.html'),
			hash: id
		});

		promptWindow.loadURL(promptUrl);
	});
}

module.exports = electronPrompt;
