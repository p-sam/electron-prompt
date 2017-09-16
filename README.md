# electron-prompt

Electron helper to prompt for a value via input or select

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
    inputAttrs: { // attrs to be set if using 'input'
        type: 'url'
    },
    type: 'select', // 'select' or 'input, defaults to 'input'
    selectOptions: { // select options if using 'select' type
        'value 1': 'Display Option 1',
        'value 2': 'Display Option 2',
        'value 3': 'Display Option 3'
    }
})
.then((r) => {
    console.log('result', r); // null if window was closed, or user clicked Cancel
})
.catch(console.error);
```
