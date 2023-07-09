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

> **Warning** before-after@3 is ESM.
>
> **Note** Minimum supported `Node.js` version is `16.20.0`.

## Installation

The library is available as the `before-after` package name on [npm](https://www.npmjs.com/package/before-after) and [Github](https://github.com/yoriiis/before-after).

```bash
npm install before-after --save
```

```bash
yarn add before-after --dev
```

## How it works

### HTML

```html
<div class="beforeafter">
  <img src="img/before.jpg" />
  <img src="img/after.jpg" />
</div>
```

> **Note** The last image will be on the top

### Initialization

Import `before-after` JavaScript library as an ES6 modules.

```js
import BeforeAfter from 'before-after';
```

The `before-after` constructor accepts the following parameters:

| Arguments |     Type      | Default | Description                                |
| --------- | :-----------: | :-----: | ------------------------------------------ |
| element   | `HTMLElement` | `null`  | `HTMLElement` to target the library        |
| config    |   `Object`    |  `{}`   | [Configuration](#configuration) (optional) |

Initialize the library with a CSS selector string.

```js
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

### Methods

#### `destroy`

Tells the library to destroy the instance.

```js
beforeAfter.destroy();
```

---

## License

`before-after` is licensed under the [MIT License](http://opensource.org/licenses/MIT).

Created with ♥ by [@yoriiis](http://github.com/yoriiis).
