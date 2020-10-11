const fs = require('fs');
const {ipcRenderer} = require('electron');
const docReady = require('doc-ready');

let dialogId = null;
let dialogOptions = null;

function dialogError(error) {
	if (error instanceof Error) {
		error = error.message;
	}

	ipcRenderer.sendSync('dialog-error:' + dialogId, error);
}

function dialogCancel() {
	ipcRenderer.sendSync('dialog-post-data:' + dialogId, null);
}

function formToJSON(form) {
	const r = {};
	for (const element of form.querySelectorAll('input, select')) {
		if (element.type === 'radio') {
			// If a radio group has none selected, it will be null. Otherwise the value of the selected.
			if(r[element.name] === undefined) {
				r[element.name] = null;
			} else {
				if (element.checked) {
					r[element.name] = element.value;
				}
			}
		} else if (element.type === 'checkbox') {
			r[element.name] = element.checked;
		} else {
			r[element.name] = element.value;
		}
	}

	return r;
}

function dialogSubmit() {
	let data = JSON.stringify(formToJSON(document.getElementById('data-container')));
	ipcRenderer.sendSync('dialog-post-data:' + dialogId, data);
}

function dialogRegister() {
	dialogId = document.location.hash.replace('#', '');

	try {
		dialogOptions = JSON.parse(ipcRenderer.sendSync('dialog-get-options:' + dialogId));
	} catch (error) {
		return dialogError(error);
	}

	if (dialogOptions.useHtmlLabel) {
		document.querySelector('#label').innerHTML = dialogOptions.label;
	} else {
		document.querySelector('#label').textContent = dialogOptions.label;
	}

	if (dialogOptions.buttonLabels && dialogOptions.buttonLabels.ok) {
		document.querySelector('#ok').textContent = dialogOptions.buttonLabels.ok;
	}

	if (dialogOptions.buttonLabels && dialogOptions.buttonLabels.cancel) {
		document.querySelector('#cancel').textContent = dialogOptions.buttonLabels.cancel;
	}

	try {
		if (dialogOptions.customStylesheet) {
			const customStyleContent = fs.readFileSync(dialogOptions.customStylesheet);
			if (customStyleContent) {
				const customStyle = document.createElement('style');
				customStyle.setAttribute('rel', 'stylesheet');
				customStyle.append(document.createTextNode(customStyleContent));
				document.head.append(customStyle);
			}
		}
	} catch (error) {
		return dialogError(error);
	}

	document.querySelector('#form').addEventListener('submit', dialogSubmit);
	document.querySelector('#cancel').addEventListener('click', dialogCancel);

	const dataContainerElement = document.querySelector('#data-container');
	dataContainerElement.innerHTML = dialogOptions.inputHtml;
}

window.addEventListener('error', error => {
	if (dialogId) {
		dialogError('An error has occured on the dialog window: \n' + error);
	}
});

docReady(dialogRegister);
