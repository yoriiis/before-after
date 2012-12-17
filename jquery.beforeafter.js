/**
 *
 * Plugin: jQuery BeforeAfter
 * @version 1.0
 * @author: Joris DANIEL
 * @fileoverview:
 * Thanks to Nicolas Riciotti aka Twode
 * For IE6/7/8/9, FF, Chrome, Opera, Safari
 *
 * Copyright (c) 2012 Joris DANIEL
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 *	Sample usage
 *	$('.beforeafter').beforeafter({
 *		cursor: false,
 *		direction: 'vertical'
 *	});
 * 
 *	Instance
 *	$('.beforeafter').data('beforeafter')
 *
 *	Get position
 *	$('.beforeafter').data('position')
 *
**/

(function ($, window) {

	"use strict";

	var BeforeAfter = function( elmt, params ){

		//Declaration of variables
		var params = $.extend({
			cursor: true, //A div following the mouse
			direction: 'horizontal', //Horizontal(default) or vertical
			reset : function( duration ){}, //Reset the animation
			destroy : function( duration ){} //Destroy the instance
		},  params || {}),
			self = this,
			timer = null,
			$element = $(elmt),
			$picture = $(elmt).find('.active');

		//If cursor, construct it
		if( params.cursor ){
			
			$element.after('<div class="cursor"></div>');
			
			var $cursor = $element.siblings('.cursor'),
				cssCursor = {
					'position': 'absolute',
					'top': '0',
					'left': '0',
					'zIndex': '10',
					'backgroundColor': '#000',
					'overflow': 'hidden'
				};

			if( params.direction == 'horizontal' ){
				cssCursor['width'] = '2px';
				cssCursor['height'] = '100%';
			}else if( params.direction == 'vertical' ){
				cssCursor['width'] = '100%';
				cssCursor['height'] = '2px';
			}
			
			$cursor.css( cssCursor );

		}

		//Instanciate the plugin
		var init = (function(){
			
			$picture.css('zIndex', 1);
			$element.find('li').show();

			//Animation on mousemove
			$element.on('mousemove', function(e){
				
				var translate, value, leftTop, widthHeight;

				if( params.direction == 'horizontal' ){

					leftTop = 'left';
					widthHeight = 'width';

					value = ( e.pageX - $element.offset().left )<<0;
					translate = value + "px, 0px";

				}else if( params.direction == 'vertical' ){

					leftTop = 'top';
					widthHeight = 'height';

					value = ( e.pageY - $element.offset().top )<<0;
					translate = "0px, " + value + "px";
				}

				if( params.cursor ){
					( support.getPrefixed('transform') ) ? $cursor.css(support.getPrefixed('transform'), "translate(" + translate + ") translateZ(0)") : $cursor.css(leftTop, value + 'px');
				}

				$picture[widthHeight](value + 'px');
				$element.attr('data-position', value);

			});

			$element.on('mouseover', function(e){
				clearTimeout( timer );
			});

		})();

		//Reset position
		this.reset = function( duration ){

			if( typeof duration == 'undefined' ) duration = 100

			var widthHeight = ( params.direction == 'horizontal' ) ? {'width': '100%'} : {'height': '100%'};
			$picture.animate( widthHeight, duration, function(){ return true; });
			( support.getPrefixed('transform') ) ? 
				$cursor.css(support.getPrefixed('transform'), "none") : 
			( ( params.direction == 'horizontal' ) ? $cursor.css('left', '0px') : $cursor.css('left', '0px'));

		};

		//Destroy instance and reset position
		this.destroy = function(e){

			if( this.reset( 100 ) ){
				$element.off('mousemove');
				self = timer = el = $picture = null;
			}

		};

		//Check browser capabilities
		var support = (function(){

			var vendors = [ '', 'Ms', 'O', 'WebKit', 'Webkit', 'Moz' ],
	            div = document.createElement( 'div' );
	              
	        function testProperty( prop ){
				if ( prop in div.style ) return true;  
				else return getPrefixed( prop ) == false ? false : true;
	        };
	            
	        function getPrefixed ( prop, cssformat ) {

				var formatForCss = typeof cssformat != "undefined" ? cssformat : true,
					propd, l = vendors.length;

					propd = prop.replace(/(^[a-z])/g, function(val) {  
						return val.toUpperCase();
					}).replace(/\-([a-z])/g, function(val,a) {  
						return a.toUpperCase();
					});  

					while( l-- ){
						if ( vendors[l] + propd in div.style  ){
							return formatForCss ? '-' + vendors[l].toLowerCase() + '-' + prop.toLowerCase() : vendors[l] + propd;
						}else if( window[vendors[l] + propd] != undefined ){
							return vendors[l].toLowerCase() + propd;
						}else if( typeof window[ vendors[l] + propd ] != 'undefined' ){
							return vendors[l] + propd;
						}
					}

	            return false;
	        };

	        return {
				prefix : testProperty('transform') ? getPrefixed('transform', false).replace('Transform','') : '',
				cssprefix : testProperty('transform') ? getPrefixed('transform').replace('transform','') : '',
				transition : testProperty('transition'),
				transform : testProperty('transform'), 
				translate3d : ( 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix() ) || testProperty( 'perspective' ),  
				getPrefixed : getPrefixed,
				test : testProperty
	        }

		})();

	}

	$.fn.beforeafter = function(options) { 
		return this.each(function() {
			var elmt = $(this);
            if (elmt.data('beforeafter')) return;
            var beforeafter = new BeforeAfter(this, options);
            elmt.data('beforeafter', beforeafter);
        });
	};

})( jQuery, window );