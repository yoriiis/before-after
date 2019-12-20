![BeforeAfter](https://img.shields.io/badge/BeforeAfter-v2.0.4-b8e986.svg?style=flat-square)

# BeforeAfter

BeforeAfter is a lightweight Javascript library to compare images in before/after view. The new version of the library does not use any dependencies.

## Installation

BeforeAfter is available as the `before-after` package on <a href="https://www.npmjs.com/package/before-after" title="npm before-after">npm</a>.

```
npm install before-after --save
```

## Demo

Online demo is available on the <a href="https://yoriiis.github.io/before-after.js/" title="BeforeAfter Github page" target="_blank">BeforeAfter Github page</a>.

## How it works

### HTML structure

Images must be superposed, and CSS class `beforeafter-itemActive` determine the upper image.

```html
<div class="beforeafter">
    <div class="beforeafter-item beforeafter-itemActive">
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
        itemActive: '.beforeafter-itemActive',
        cursor: '.beforeafter-cursor',
        imageWrapper: '.beforeafter-wrapperImage',
    }
}
```

* `element` - {Object} - DOM element reference
* `cursor` - {Boolean} - DIV tag following mouse or finger
* `direction` - {String} - 4 directions available: `ltr`, `rtl`, `ttb`, `btt`
* `selectors` - {Object} - Configuration of selectors used by BeforeAfter
    * `item` - {String} - Selector of each items
    * `itemActive` - {String} - Selector of the active item
    * `cursor` - {String} - Selector of the cursor
    * `imageWrapper` - {String} - Selector of the picture wrapper (_automatically generated_)

_Note: direction parameter uses naming shortcuts: `left to right`, `right to left`, `top to bottom`,  `bottom to top`_

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

BeforeAfter is compatible with all no-touch and touch devices such as Android or iOS. The library uses CSS transform property for better animations, all last browsers are compatible. More information in <a href="https://caniuse.com/#search=transform" title="Can I Use" target="_blank">Can I Use</a>
