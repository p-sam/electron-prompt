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
    type: 'url',
    title: 'Prompt example',
    label: 'URL:',
    value: 'http://example.org'
})
.then((r) => {
    console.log('result', r);
})
.catch(console.error);
```
