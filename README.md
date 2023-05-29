# beforeAfter

[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/yoriiis/before-after/build.yml?branch=main&style=for-the-badge)](https://github.com/yoriiis/before-after/actions/workflows/build.yml)

`before-after` is a lightweight Javascript library to compare images in before/after view. The new version of the library does not use any dependencies.

## Installation

### NPM

NPM is the recommended installation method. Install `before-after` in your project with the following command:

```bash
npm install before-after --save-dev
```

```bash
yarn add before-after --dev
```

> **Note** Minimum supported `Node.js` version is `16.20.0`.

### CDN

You can also download it and include it with a script tag. The library will be registered as the global variable `window.BeforeAfter`.

```html
<script src="https://cdn.jsdelivr.net/npm/before-after@3" crossorigin></script>
```

> **Note** You can browse the source of the NPM package at [jsdelivr.com/package/npm/before-after](https://www.jsdelivr.com/package/npm/before-after).

## Installation

The library is available as the `before-after` package name on [npm](https://www.npmjs.com/package/before-after) and [Github](https://github.com/yoriiis/before-after).

```bash
npm install before-after --save
```

```bash
yarn add validate-target --dev
```

## How it works

### HTML

```html
<div class="beforeafter">
  <img src="img/before.jpg" />
  <img src="img/after.jpg" />
</div>
```

### Initialization

Import `before-after` JavaScript library as an ES6 modules.

```javascript
import Vlitejs from 'vlitejs';
```

The `vlitejs` constructor accepts the following parameters:

| Arguments |     Type      | Default | Description                                |
| --------- | :-----------: | :-----: | ------------------------------------------ |
| element   | `HTMLElement` | `null`  | `HTMLElement` to target the library        |
| config    |   `Object`    |  `{}`   | [Configuration](#configuration) (optional) |

Initialize the library with a CSS selector string.

```javascript
new BeforeAfter(document.querySelector('.beforeafter'));
```

---

## Configuration

### Options

#### `cursor`

Type:

```ts
type cursor = boolean;
```

Default: `true`

Tells the library to enable the cursor following mouse or finger.

```js
new BeforeAfter(document.querySelector('.beforeafter'), {
  cursor: false
});
```

#### `orientation`

Type:

```ts
type orientation = 'horizontal' | 'vertical';
```

Default: `'horizontal'`

Tells the library which orientation used.

```js
new BeforeAfter(document.querySelector('.beforeafter'), {
  orientation: 'vertical'
});
```

#### `start`

Type:

```ts
type start = number;
```

Default: `50`

Tells the library the start position.

```js
new BeforeAfter(document.querySelector('.beforeafter'), {
  start: 30
});
```

## Callback functions

## Available methods

Each BeforeAfter instanciations returns the instance of the class with somes available methods to easily manipulate the element.

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

`before-after` supports the latest 2 versions of most modern browsers with the Browserslist config.

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
