# electron-prompt

Electron helper to prompt for a string value or dropdown select

## Usage

```
npm install electron-prompt --save
```

```js
prompt([options, parentBrowserWindow]).then(...).catch(...)
```

## Example

```js
const prompt = require('electron-prompt');

prompt({
    title: 'Prompt example',
    label: 'URL:',
    value: 'http://example.org',
    inputAttrs: {
        type: 'url'
    },
    type: 'select',//optional defaults to input,
    selectOptions: {// only needed if you are using select
        'value 1':'Display Option 1',
        'value 2':'Display Option 2',
        'value 3':'Display Option 3'
    }
})
.then((r) => {
    console.log('result', r); //null if window was closed, or user clicked Cancel
})
.catch(console.error);
```
