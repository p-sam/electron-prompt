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
## Documentation
Primary method:
```js
prompt([options, parentBrowserWindow]).then(...).catch(...)
```

### Options object
| Key  | Explaination |
| ------------- | ------------- |
| title  | (String) The title of the prompt window. |
| label  | (String) The label which appears on the prompt for the input field. |
| value  | (String) The default value for the input field. |
| type  | (String) The type of input field, either 'input' for a standard text input field or 'select' for a dropdown type input. |
| inputAttrs  | (optional, object) The attributes of the input field, analagous to the HTML attributes: `{type: 'text', required: true}` -> `<input type="text" required>`. Used if the type is 'input' |
| selectOptions  | (optional, object) The items for the select dropdown if using te 'select' type in the format 'value': 'display text', where the value is what will be given to the then block and the display text is what the user will see. |

### parentBrowserWindow
The window in which to display the prompt on.
