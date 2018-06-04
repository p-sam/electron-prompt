# electron-prompt

Electron helper to prompt for a value via input or select

[![Build Status](https://travis-ci.com/sperrichon/electron-prompt.svg?branch=master)](https://travis-ci.com/sperrichon/electron-prompt) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

## Usage

```sh
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
    type: 'select'
})
.then((r) => {
    if(r === null) {
        console.log('user cancelled');
    } else {
        console.log('result', r);
    }
})
.catch(console.error);
```

## Documentation

Primary method:

```js
prompt([options, parentBrowserWindow]).then(...).catch(...)
```

### Options object (optional)

| Key  | Explaination |
| ------------- | ------------- |
| width  | (optional, integer) The width of the prompt window. Defaults to 370. |
| height  | (optional, integer) The height of the prompt window. Defaults to 130. |
| resizable  | (optional, boolean) Whether the prompt window can be resized or not. Defaults to false. |
| title  | (optional, string) The title of the prompt window. Defaults to 'Prompt'. |
| label  | (optional, string) The label which appears on the prompt for the input field. Defaults to 'Please input a value:'. |
| value  | (optional, string) The default value for the input field. Defaults to null.|
| type   | (optional, string) The type of input field, either 'input' for a standard text input field or 'select' for a dropdown type input. Defaults to 'input'.|
| inputAttrs  | (optional, object) The attributes of the input field, analagous to the HTML attributes: `{type: 'text', required: true}` -> `<input type="text" required>`. Used if the type is 'input' |
| selectOptions  | (optional, object) The items for the select dropdown if using te 'select' type in the format 'value': 'display text', where the value is what will be given to the then block and the display text is what the user will see. |

If not supplied, it uses the defaults listed in the table above.

### parentBrowserWindow

(optional) The window in which to display the prompt on. If not supplied, the parent window of the prompt will be null.
