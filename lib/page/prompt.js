const {ipcRenderer} = require('electron');
const docReady = require('doc-ready');

let promptId = null;
let promptOptions = null;

const promptError = e => {
	if (e instanceof Error) {
		e = e.message;
	}
	ipcRenderer.sendSync('prompt-error:' + promptId, e);
};

const promptCancel = () => {
	ipcRenderer.sendSync('prompt-post-data:' + promptId, null);
};

const promptSubmit = () => {
	const dataEl = document.getElementById('data');
	let data = null;

	if (promptOptions.type === 'input') {
		data = dataEl.value;
	} else if (promptOptions.type === 'select') {
		if (promptOptions.selectMultiple) {
			data = dataEl.querySelectorAll('option[selected]').map(o => o.getAttribute('value'));
		} else {
			data = dataEl.value;
		}
	}
	ipcRenderer.sendSync('prompt-post-data:' + promptId, data);
};

window.addEventListener('error', error => {
	if (promptId) {
		promptError('An error has occured on the prompt window: \n' + error);
	}
});

docReady(() => {
	promptId = document.location.hash.replace('#', '');

	try {
		promptOptions = JSON.parse(ipcRenderer.sendSync('prompt-get-options:' + promptId));
	} catch (e) {
		return promptError(e);
	}

	document.getElementById('label').textContent = promptOptions.label;
	document.getElementById('ok').addEventListener('click', () => promptSubmit());
	document.getElementById('cancel').addEventListener('click', () => promptCancel());

	const dataContainerEl = document.getElementById('data-container');

	let dataEl;
	if (promptOptions.type === 'input') {
		dataEl = document.createElement('input');
		dataEl.setAttribute('type', 'text');

		if (promptOptions.value) {
			dataEl.value = promptOptions.value;
		} else {
			dataEl.value = '';
		}

		if (promptOptions.inputAttrs && typeof (promptOptions.inputAttrs) === 'object') {
			for (const k in promptOptions.inputAttrs) {
				if (!Object.prototype.hasOwnProperty.call(promptOptions.inputAttrs, k)) {
					continue;
				}

				dataEl.setAttribute(k, promptOptions.inputAttrs[k]);
			}
		}

		dataEl.addEventListener('keyup', e => {
			e.which = e.which || e.keyCode;
			if (e.which === 13) {
				promptSubmit();
			}
			if (e.which === 27) {
				promptCancel();
			}
		});
	} else if (promptOptions.type === 'select') {
		dataEl = document.createElement('select');
		let optionEl;

		for (const k in promptOptions.selectOptions) {
			if (!Object.prototype.hasOwnProperty.call(promptOptions.selectOptions, k)) {
				continue;
			}

			optionEl = document.createElement('option');
			optionEl.setAttribute('value', k);
			optionEl.textContent = promptOptions.selectOptions[k];
			if (k === promptOptions.value) {
				optionEl.setAttribute('selected', 'selected');
			}
			dataEl.appendChild(optionEl);
		}
	}

	dataContainerEl.appendChild(dataEl);
	dataEl.setAttribute('id', 'data');

	dataEl.focus();
});
