const { ipcRenderer } = require('electron');
const docReady = require('doc-ready');
let promptId;

window.onerror = function(error) {
    if(promptId) {
        promptError("An error has occured on the prompt window: \n"+error);
    }
};

function promptError(e) {
    if(e instanceof Error) {
        e = e.message;
    }
    ipcRenderer.sendSync('prompt-error:'+promptId, e);
}

function promptCancel() {
    ipcRenderer.sendSync('prompt-post-data:'+promptId, null);
}

function promptSubmit() {
    ipcRenderer.sendSync('prompt-post-data:'+promptId, document.getElementById('data').value);
}

docReady(() => {
    promptId = document.location.hash.replace('#','');

    try {
        options = JSON.parse(ipcRenderer.sendSync('prompt-get-options:'+promptId));
    } catch(e) {
        return promptError(e);
    }

    const dataEl = document.getElementById("data"); 

    document.getElementById("ok").addEventListener('click', () => promptSubmit());
    document.getElementById("cancel").addEventListener('click', () => promptCancel());

    dataEl.addEventListener('keyup', (e) => {
        e.which = e.which || e.keyCode;
        if(e.which == 13) {
            promptSubmit();
        }
    });

    document.getElementById("label").textContent = options.label;
    dataEl.value = options.value;
    dataEl.type = options.type;
    dataEl.focus();
});