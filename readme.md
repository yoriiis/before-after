# jQuery beforeAfter

New version of beforeAfter plugin, more options, responsive to resize and new method to add preview of animation.<br />

### Structure of HTML

Images must be superposed, and CSS class `active` determine the upper image.
```html
<ul class="beforeafter">
    <li class="active"><img src="img/1.jpg" /></li>
    <li><img src="img/2.jpg" /></li>
</ul>
```

### Librairies compatibilities

BeforeAfter plugin is compatible with <a href="https://github.com/Modernizr/Modernizr" title="Modernizr" target="_blank">Modernizr</a> and <a href="https://github.com/desandro/imagesloaded" title="imagesLoaded" target="_blank">imagesLoaded</a>.<br />If one or the other plugins is unavailable, options are disable by default, and the plugin is fully functional.<br />For information, jQuery 1.7+ is require to use this plugin.


### Options

* `cursor` <span> tag following mouse or finger
* `direction` 4 directions available : ltr | rtl | ttb | btt
* `classNameCursor` class name for the tag cursor
* `checkImagesLoaded` use jQuery imagesLoaded to detect all images loaded
* `useCSSTransform` use Modernizr.testProp() to test compatibility with CSS transform
* `debug` enable log in plugin
* `callback` function called when the plugin is instanciated

(ltr : left to right | rtl : right to left | ttb : top to bottom | btt : bottom to top)


### Instanciate the plugin

```javascript
$('.beforeafter').beforeafter({
    cursor: true,
    direction: 'ltr',
    classNameCursor: 'cursor',
    checkImagesLoaded: false,
    useCSSTransform: true,
    debug: false,
    callback: function(){}
});
```

### Control the preview

You can start a preview of animation on callback function or when you want, with goTo method, follow example above and below.<br /><br />Use this parameters to control animation :

* **percentage** : percentage of shifting (no unity)
* **duration** : duration of animation (in ms)
* **animation** : animate or not
* **easing** : type of easing (available in your jQuery library)

Example on click event
```javascript
$('.button').on('click', function(e){
    e.preventDefault();
    $('.beforeafter').data('beforeafter').goTo(50, 1000, true, 'swing');
})
```

Example on init callback, `this` access to plugin instance
```javascript
$('.beforeafter').beforeafter({
    callback: function(){
        this.goTo(50, 1000, true, 'swing');
    }
});
```

### Methods

* `reset` reset CSS property
* `destroy` reset and destroy plugin instance

Access to method with instance
```javascript
$('.beforeafter').data('beforeafter').reset();
$('.beforeafter').data('beforeafter').destroy();
```

### Browser support

IE8+, FF, Chrome, Opera, Safari, iOS, Android, Window 8