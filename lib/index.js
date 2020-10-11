const electron = require('electron');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const url = require('url');
const path = require('path');

const DEFAULT_WIDTH = 370;
const DEFAULT_HEIGHT = 160;

function electronDialog(options, parentWindow) {
	return new Promise((resolve, reject) => {
		const id = `${new Date().getTime()}-${Math.random()}`;

		const options_ = Object.assign(
			{
				width: DEFAULT_WIDTH,
				height: DEFAULT_HEIGHT,
				minWidth: DEFAULT_WIDTH,
				minHeight: DEFAULT_HEIGHT,
				resizable: false,
				title: 'Dialog',
				description: 'Please input a value:',
				container: null,
				buttonLabels: null,
				alwaysOnTop: false,
				labelIsHtml: false,
				icon: null,
				customStylesheet: null,
				menuBarVisible: false,
				skipTaskbar: true
			},
			options || {}
		);

		if (typeof options_.container !== "string") {
			return reject(new Error('"container" must be html string'));
		}

		let dialogWindow = new BrowserWindow({
			width: options_.width,
			height: options_.height,
			minWidth: options_.minWidth,
			minHeight: options_.minHeight,
			resizable: options_.resizable,
			minimizable: false,
			fullscreenable: false,
			maximizable: false,
			parent: parentWindow,
			skipTaskbar: options_.skipTaskbar,
			alwaysOnTop: options_.alwaysOnTop,
			useContentSize: options_.resizable,
			modal: Boolean(parentWindow),
			title: options_.title,
			icon: options_.icon || undefined,
			webPreferences: {
				nodeIntegration: true
			}
		});

		dialogWindow.setMenu(null);
		dialogWindow.setMenuBarVisibility(options_.menuBarVisible);

		const getOptionsListener = event => {
			event.returnValue = JSON.stringify(options_);
		};

		const cleanup = () => {
			if (dialogWindow) {
				dialogWindow.close();
				dialogWindow = null;
			}
		};

		const postDataListener = (event, value) => {
			value = JSON.parse(value);
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

		ipcMain.on('dialog-get-options:' + id, getOptionsListener);
		ipcMain.on('dialog-post-data:' + id, postDataListener);
		ipcMain.on('dialog-error:' + id, errorListener);
		dialogWindow.on('unresponsive', unresponsiveListener);

		dialogWindow.on('closed', () => {
			ipcMain.removeListener('dialog-get-options:' + id, getOptionsListener);
			ipcMain.removeListener('dialog-post-data:' + id, postDataListener);
			ipcMain.removeListener('dialog-error:' + id, postDataListener);
			resolve(null);
		});

		const dialogUrl = url.format({
			protocol: 'file',
			slashes: true,
			pathname: path.join(__dirname, 'page', 'dialog.html'),
			hash: id
		});

		dialogWindow.loadURL(dialogUrl);
	});
}

module.exports = electronDialog;
