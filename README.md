# beforeAfter

[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/yoriiis/before-after/build.yml?branch=main&style=for-the-badge)](https://github.com/yoriiis/before-after/actions/workflows/build.yml)

`before-after` is a lightweight Javascript library to compare images in before/after view. The new version of the library does not use any dependencies.

## Installation

The library is available as the `before-after` package name on [npm](https://www.npmjs.com/package/before-after) and [Github](https://github.com/yoriiis/before-after).

```bash
npm install before-after --save
```

```bash
yarn add validate-target --dev
```

## How it works

### HTML structure

Images must be superposed, and CSS class `active` determine the upper image.

```html
<div class="beforeafter">
  <div class="beforeafter-item active">
    <img src="img/1.jpg" />
  </div>
  <div class="beforeafter-item">
    <img src="img/2.jpg" />
  </div>
</div>
```

### Basic usage

Every page that contains BeforeAfter, has to instanciates them. The following example create one item.

```javascript
import BeforeAfter from 'before-after';
const beforeAfterItem = new BeforeAfter({
  element: document.querySelector('.beforeafter')
});
beforeAfterItem.create();
```

### Options

You can pass configuration options to BeforeAfter constructor. Example below show all default values. Allowed values are as follows:

```javascript
{
    element: null,
    cursor: true,
    direction: 'ltr',
    selectors: {
        item: '.beforeafter-item',
        itemActive: '.active',
        cursor: '.beforeafter-cursor',
        imageWrapper: '.beforeafter-wrapperImage',
    }
}
```

- `element` - {Object} - DOM element reference
- `cursor` - {Boolean} - DIV tag following mouse or finger
- `direction` - {String} - 4 directions available: `ltr`, `rtl`, `ttb`, `btt`
- `selectors` - {Object} - Configuration of selectors used by BeforeAfter
  - `item` - {String} - Selector of each items
  - `itemActive` - {String} - Selector of the active item
  - `cursor` - {String} - Selector of the cursor
  - `imageWrapper` - {String} - Selector of the picture wrapper (_automatically generated_)

_Note: direction parameter uses naming shortcuts: `left to right`, `right to left`, `top to bottom`, `bottom to top`_

## Callback functions

There is one callback function available with BeforeAfter.

### After the instanciation

The `create` method is a function which accepts a callback function in parameter.

```javascript
import BeforeAfter from 'before-after';
const beforeAfterItem = new BeforeAfter({
  element: document.querySelector('.beforeafter')
});
beforeAfterItem.create(() => {
  // BeforeAfter element is created and ready
});
```

## Available methods

Each BeforeAfter instanciations returns the instance of the class with somes available methods to easily manipulate the element.

### Go to a position

The `goTo()` function allows to move the animation to a specific position. The function accepts one parameter `percentage` in percentage only (without unity).

The function can be used in the callback of the `create()` function, to start the animation on a specific position.

```javascript
beforeAfterItem.goTo(50);
```

### Reset

The `reset()` function allows to reset the animation and the cursor.

```javascript
beforeAfterItem.reset();
```

### Destroy

The `destroy()` function allows to destroy all references of BeforeAfter and keep the original HTML structure.

```javascript
beforeAfterItem.destroy();
```

### Browsers support

`before-after` supports the latest 2 versions of most modern browsers with the [.browserslistrc](https://github.com/vlitejs/vlite/blob/main/.browserslistrc) config.

| Browser    |     Supported      |
| ---------- | :----------------: |
| Chrome     | :white_check_mark: |
| Firefox    | :white_check_mark: |
| Opera      | :white_check_mark: |
| Edge       | :white_check_mark: |
| Safari     | :white_check_mark: |
| iOS Safari | :white_check_mark: |

## License

`before-after` is licensed under the [MIT License](http://opensource.org/licenses/MIT).

Created with ♥ by [@yoriiis](http://github.com/yoriiis).
