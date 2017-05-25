# electron-prompt

Electron helper to prompt for a string value

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
    }
})
.then((r) => {
    console.log('result', r); //null if window was closed, or user clicked Cancel
})
.catch(console.error);
```
