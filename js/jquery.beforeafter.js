/**
 * @fileoverview scriptease.support.
 *
 * The main point of this module is to provide a list 
 * of some of the features the browser may or may not implement.
 * It also provides methods to add custom tests.
 */
(function(j,d){var a=j.scriptease||{},l={},c=null,e=document.documentElement,k=document.createElement("div"),h=k.style,f=" Webkit WebKit Moz O Ms".split(" "),i=" -webkit- -webkit- -moz- -o- -ms-".split(" "),g=f.length,b=function(s,q){var p=typeof q!="undefined"?q:false,r,o=g;r=s.replace(/(^[a-z])/g,function(t){return t.toUpperCase()}).replace(/\-([a-z])/g,function(u,t){return t.toUpperCase()});while(o--){if(s in h){return s}else{if(f[o]+r in h){return p?i[o]+s.toLowerCase():f[o]+r}else{if(j[f[o].toLowerCase()+r]!=d){return f[o].toLowerCase()+r}else{if(typeof j[f[o]+r]!="undefined"){return f[o]+r}}}}}return false};c={prefix:function(){var o=b("transform");return !!o?o.replace("Transform",""):""},cssprefix:function(){var o=b("transform",true);return !!o?o.replace("transform",""):""},transform:function(){return b("transform")},transform3d:function(){return("WebKitCSSMatrix" in j&&"m11" in new WebKitCSSMatrix())||!!b("perspective")},transformOrigin:function(){return b("transformOrigin")},backfaceVisibility:function(){return b("backfaceVisibility")},perspective:function(){return b("perspective")},transition:function(){return b("transition")},transitionProperty:function(){return b("transitionProperty")},transitionDuration:function(){return b("transitionDuration")},transitionTimingFunction:function(){return b("transitionTimingFunction")},transitionDelay:function(){return b("transitionDelay")},transitionEvent:function(){return b("transitionEvent")},transitionEventPrefix:function(){return !!b("transitionEvent")?b("transitionEvent").replace("TransitionEvent","").toLowerCase():""},transitionEnd:function(){return this.transitionEventPrefix()!=""?this.transitionEventPrefix()+"TransitionEnd":"transitionend"},touch:function(){return"ontouchstart" in document.documentElement},MSPointer:function(){return !!j.navigator.msPointerEnabled}};var m;for(var n in c){if(c.hasOwnProperty(n)){m=n.toLowerCase();l[m]=c[n]()}}l.test=function(o){return !!b(o)};l.getPrefixed=function(o){return b(o)};l.getCssPrefixed=function(o){return b(o,true)};if(typeof j.support!="undefined"){a.support=l;j.scriptease=a}else{j.support=l}})(this);


/**
 *
 * Plugin: jQuery BeforeAfter
 * @version 1.1
 * @author: Joris DANIEL
 * @fileoverview:
 * Thanks to Nicolas Riciotti aka Twode
 * Supports : IE6/7/8/9/10, FF, Chrome, Opera, Safari, iOS, Android, Window 8
 *
 * Copyright (c) 2013 Joris DANIEL
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 *  Sample usage
 *  $('.beforeafter').beforeafter({
 *      cursor: false,
 *      direction: 'ttb', //ttb, btt, ltr, rtl
 *  });
 * 
 *  Instance
 *  $('.beforeafter').data('beforeafter')
 *
 *  Get position
 *  $('.beforeafter').data('position')
 *
**/

(function ($, window) {

    "use strict";

    var BeforeAfter = function( elmt, params ){

        var params = $.extend({
            cursor          : false,    //A div following the mouse
            direction       : 'ttb',    //ttb, btt, ltr, rtl
            reset : function( duration ){},     //Reset the animation
            destroy : function( duration ){}    //Destroy the instance
        },  params || {} ),
            self            = this,
            timer           = null,
            $element        = $(elmt),
            $picture        = $(elmt).find('.active'),
            heightElement   = parseInt( $element.height() ),
            widthElement    = parseInt( $element.width() );


        var orientation     = '',
            attrToAnimate   = '',
            widthHeight     = '',
            hasTouch        = 'ontouchstart' in document.documentElement,
            hasMSPointer    = window.navigator.msPointerEnabled,
            events          = hasTouch  ? 'touchmove' : (hasMSPointer ? 'MSPointerMove' : 'mousemove');

        if (params.direction == 'ltr' || params.direction == 'rtl') {
            
            orientation      = "horizontal";
            attrToAnimate    = "left";
            widthHeight      = 'width';

        } else if (params.direction == 'ttb' || params.direction == 'btt') {
            
            orientation      = "vertical";
            attrToAnimate    = "top";
            widthHeight      = 'height';

        }

        //Instanciate the plugin
        var init = (function(){
            
            $picture.css('zIndex', 1);
            $element.find('li').show();

            //If cursor, construct it
            if( params.cursor ){
                
                $element.after('<div class="cursor"></div>');
                
                var $cursor = $element.siblings('.cursor'),
                    cssCursor = {
                        position: 'absolute',
                        zIndex: '10',
                        backgroundColor: '#000',
                        overflow: 'hidden',
                    };

                if ( orientation == 'horizontal' ) {
                    cssCursor['width']  = '2px';
                    cssCursor['height'] = '100%';
                    cssCursor['top'] = 0;
                }else if ( orientation == 'vertical' ) {
                    cssCursor['width']  = '100%';
                    cssCursor['height'] = '2px';
                    cssCursor['left'] = 0;
                }

                if ( params.direction == 'ltr' ) cssCursor['left']      = '0';
                if ( params.direction == 'rtl' ) cssCursor['right']     = '0'; 
                if  (params.direction == 'ttb' ) cssCursor['top']       = '0';
                if ( params.direction == 'btt' ) cssCursor['bottom']    = '0';

                $cursor.css( cssCursor );

            }

            //Wrap image
            $element.find('li').each(function(){
                $(this).find('img').wrap('<div class="wrap-img">');
            });

            if ( orientation == 'horizontal' ) {

                $('.wrap-img img').css({'width': 'auto', 'height': '100%'});
                $('.wrap-img').css({'position': 'absolute', 'top': '0', 'width': widthElement });
                $picture.css({ 'top': '0' });

                if( params.direction == 'ltr' ){
                    $picture.css({ 'left': 'auto', 'right': '0' });
                    $('.wrap-img').css({ 'right': '0' });
                }

                if( params.direction == 'rtl' ){
                    $picture.css({ 'left': '0', 'right': 'auto' });
                    $('.wrap-img').css({ 'left': '0' });
                }

            }else if ( orientation == 'vertical' ) {

                $('.wrap-img img').css({'width': '100%', 'height': 'auto'});
                $('.wrap-img').css({'position': 'absolute', 'left': '0'});

                if( params.direction == 'ttb' ){
                    $picture.css({'bottom': '0', 'top': 'auto'});
                    $('.wrap-img').css({'bottom': '0'});
                }

                if( params.direction == 'btt' ){
                    $picture.css({'bottom': 'auto', 'top': '0'});
                    $('.wrap-img').css({'top': '0'});
                }

            }
    

            $element.on(events, function(e){

                e.preventDefault();

                var translate   = '',
                    value       = 0,
                    pageX       = 0,
                    pageY       = 0;

                pageX  = hasTouch ? e.originalEvent.touches[0].pageX : ( hasMSPointer ? e.originalEvent.pageX : e.pageX ),
                        pageY  = hasTouch ? e.originalEvent.touches[0].pageY : ( hasMSPointer ? e.originalEvent.pageY : e.pageY );

                if( params.direction == 'ltr' || params.direction == 'rtl' ){

                    value = ( params.direction == 'ltr' ) ? ( widthElement - ( pageX - $element.offset().left ))<<0 : ( pageX - $element.offset().left )<<0;
                    translate = ( params.direction == 'rtl' ) ? ( value - widthElement ) + "px, 0px" : ( widthElement - value ) + "px, 0px";

                }else if( params.direction == 'ttb' || params.direction == 'btt' ){

                    value = ( params.direction == 'ttb' ) ? ( heightElement - (pageY - $element.offset().top ))<<0 : (pageY - $element.offset().top)<<0;
                    translate = ( params.direction == 'ttb' ) ? "0px, " + (heightElement - value) + "px" : "0px, " + ( value - heightElement ) + "px";
                }

                if( params.cursor ){
                    ( support.getPrefixed('transform') ) ? $cursor.css(support.getPrefixed('transform'), "translate(" + translate + ") translateZ(0)") : $cursor.css(attrToAnimate, value + 'px');
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

            var widthHeight = ( orientation == 'horizontal' ) ? {'width': '100%'} : {'height': '100%'};
            $picture.animate( widthHeight, duration, function(){ return true; });
            ( support.getPrefixed('transform') ) ? 
                $cursor.css(support.getPrefixed('transform'), "none") : 
            ( ( orientation == 'horizontal' ) ? $cursor.css('left', '0px') : $cursor.css('left', '0px'));

        };


        //Destroy instance and reset position
        this.destroy = function(e){

            if( this.reset( 100 ) ){
                $element.off('mousemove');
                self = timer = el = $picture = null;
            }

        };

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