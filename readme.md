# jQuery beforeAfter 

###Structure of HTML
```html
<ul class="beforeafter">
	<li class="active"><img src="img/1.jpg" alt="" /></li>
	<li><img src="img/2.jpg" alt="" /></li>
</ul>
```
The class css `active` determine the upper image. Change it and see !

###Instanciate the plugin
```javascript
$('.selector').beforeafter({
    cursor: false,		//Default
	direction: 'ltr'	//ttb, btt, ltr, rtl
});
```

###Supports
IE6/7/8/9/10, FF, Chrome, Opera, Safari, iOS, Android, Window 8

Compatible jQuery 2.0
