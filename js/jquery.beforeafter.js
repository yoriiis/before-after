/**
 *
 * Plugin: jQuery BeforeAfter
 * @version 1.2
 * @author: Joris DANIEL
 * Supports : IE8+, FF, Chrome, Opera, Safari, iOS, Android, Window 8
 *
 * Copyright (c) 2016 Joris DANIEL
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 **/

(function($, window) {

    "use strict";

    var BeforeAfter = function(elmt, options) {

        var _this = this;
        var options = $.extend({
                cursor: true, //A div following the mouse
                direction: 'ttb', //ttb, btt, ltr, rtl
                classNameCursor: 'cursor', //className of cursor
                checkImagesLoaded: false,
                useCSSTransform: true,
                debug: false,
                callback: function() {}, //Reset the animation
                reset: function(duration) {}, //Reset the animation
                destroy: function(duration) {} //Destroy the instance
            }, options || {});
        var $element = $(elmt);
        var $liPicture = $(elmt).find('.active');
        var heightElement = null;
        var widthElement = null;
        var orientation = '';
        var attrToAnimate = '';
        var widthHeight = '';
        var timerGoTo = null;
        var timerGoToAfter = null;
        var timerCleaned = false;
        var hasTouch = ( 'ontouchstart' in window ) || ( navigator.maxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 );
        var hasMSPointer = window.navigator.msPointerEnabled;
        var events = null;
        var supportCSSTransform = null;
        var $cursor = null;
        var callbackFunction = (typeof options.callback === 'function') ? options.callback : function(){};

        var init = function(){

            //Check event touch, mspointer or mouse to declare
            if( hasTouch ){
                if( hasMSPointer ){
                    events = 'pointerstart MSPointerMove';
                }else{
                    events = 'touchstart touchmove';
                }
            }else{
                events = 'mousemove';
            }

            //If option useCSSTransform enabled check if Modernizr is available, else disabled CSS transform
            if( options.useCSSTransform && typeof Modernizr !== 'undefined' ){
                supportCSSTransform = Modernizr.testProp('transform');
            }else{
                //Log if option useCSSTransform enabled and Modernizr not loaded
                if( options.useCSSTransform && typeof Modernizr === 'undefined' && options.debug ){
                    console.info('jquery.beforeafter.js :: Modernizr is required to detect and use transform CSS property. Without, plugin use just top/left property. Please visit https://github.com/Modernizr/Modernizr');
                }
                supportCSSTransform = false;
            }

            //Detect orientationa nd attribute to animate
            if (options.direction === 'ltr' || options.direction === 'rtl') {
                orientation = 'horizontal';
                widthHeight = 'width';
                if( options.direction === 'ltr' ){
                    attrToAnimate = 'left';
                }else{
                    attrToAnimate = 'right';
                }
            } else if (options.direction === 'ttb' || options.direction === 'btt') {
                orientation = 'vertical';
                if( options.direction === 'ttb' ){
                    attrToAnimate = 'top';
                }else{
                    attrToAnimate = 'bottom';
                }
                widthHeight = 'height';
            }

            $liPicture.css('zIndex', 1);
            $element.find('li').show();

            //If option cursor enabled, build cursor
            if (options.cursor) {
                buildCursor();
            }

            //Check images loaded before wrap images and call callback function
            checkImagesLoaded(function(){
                wrapImages();
                callbackFunction.call(_this);
            });

            $element.on(events, onMove);
            $(window).on('resize', onResize);

        };

        var checkImagesLoaded = function(callback){

            //If option checkImagesLoaded enabled check if imagesLoaded is available, else disabled imagesLoaded
            if (options.checkImagesLoaded && typeof $.fn.imagesLoaded !== 'undefined' ) {

                $element.imagesLoaded(function(){
                    heightElement = parseInt($element.height());
                    widthElement = parseInt($element.width());
                    callback();
                });

            }else{

                //Log if option checkImagesLoaded enabled and imagesLoaded not loaded
                if( options.checkImagesLoaded && typeof $.fn.imagesLoaded === 'undefined' && options.debug ){
                    console.info('jquery.beforeafter.js :: ImagesLoaded is required with options.checkImagesLoaded. Please install with "bower install imagesloaded --save" or visit https://github.com/desandro/imagesloaded');
                }

                heightElement = parseInt($element.height());
                widthElement = parseInt($element.width());
                callback();

            }

        };

        var buildCursor = function(refresh){

            var cssCursor = {
                'position': 'absolute',
                'zIndex': '10',
                'backgroundColor': '#000',
                'overflow': 'hidden',
                'display': 'block'
            };

            //If method is use only to refresh CSS property, don't create tag
            if( !refresh ){
                $element.after('<span class="' + options.classNameCursor + '"></span>');
                $cursor = $element.siblings('.' + options.classNameCursor);
            }

            if (orientation === 'horizontal') {
                cssCursor['width'] = '2px';
                cssCursor['height'] = '100%';
                cssCursor['top'] = 0;
            } else if (orientation === 'vertical') {
                cssCursor['width'] = '100%';
                cssCursor['height'] = '2px';
                cssCursor['left'] = 0;
            }

            if (options.direction === 'ltr') {
                cssCursor['left'] = 0;
            }
            if (options.direction === 'rtl') {
                cssCursor['left'] = 'auto';
                cssCursor['right'] = 0;
            }
            if (options.direction === 'ttb'){
                cssCursor['top'] = 0;
            }
            if (options.direction === 'btt'){
                cssCursor['top'] = 'auto';
                cssCursor['bottom'] = 0;
            }

            $cursor.css(cssCursor);

        };

        var wrapImages = function(){

            $element.find('li').each(function() {
                $(this).find('img').wrap('<div class="wrap-img">');
            });

            var $wraps = $('.wrap-img'),
                $wrapImgs = $('.wrap-img img');

            if (orientation === 'horizontal') {

                $wraps.css({
                    'position': 'absolute',
                    'top': '0',
                    'width': widthElement
                });
                $liPicture.css({
                    'top': '0'
                });

                if (options.direction === 'ltr') {
                    $liPicture.css({
                        'left': 'auto',
                        'right': '0'
                    });
                    $wraps.css({
                        'right': '0'
                    });
                }

                if (options.direction === 'rtl') {
                    $liPicture.css({
                        'left': '0',
                        'right': 'auto'
                    });
                    $wraps.css({
                        'left': '0'
                    });
                }

            } else if (orientation === 'vertical') {

                $wraps.css({
                    'position': 'absolute',
                    'left': '0',
                    'width': '100%'
                });

                if (options.direction === 'ttb') {
                    $liPicture.css({
                        'bottom': '0',
                        'top': 'auto'
                    });
                    $wraps.css({
                        'bottom': '0'
                    });
                }

                if (options.direction === 'btt') {
                    $liPicture.css({
                        'bottom': 'auto',
                        'top': '0'
                    });
                    $wraps.css({
                        'top': '0'
                    });
                }

            }

        };

        var onMove = function(e){

            e.preventDefault();

            //If user hover during animation, clear timer and stop animate
            if( timerGoTo !== null && !timerCleaned ){
                clearTimeout(timerGoTo);
                clearTimeout(timerGoToAfter);
                $liPicture.stop();
                $cursor.stop();
                buildCursor(true);
                timerCleaned = true;
            }

            var translate = '',
                value = 0,
                valueMoveTransform = 0,
                valueMoveCSS = 0,
                valueMoveCursor = 0,
                valueMovePicture = 0,
                pageX = 0,
                pageY = 0;

            pageX = hasTouch ? e.originalEvent.touches[0].pageX : (hasMSPointer ? e.originalEvent.pageX : e.pageX),
                pageY = hasTouch ? e.originalEvent.touches[0].pageY : (hasMSPointer ? e.originalEvent.pageY : e.pageY);

            if (options.direction === 'ltr' || options.direction === 'rtl') {

                if( options.direction === 'ltr' ){
                    valueMoveCSS = (pageX - $element.offset().left) << 0;
                    valueMoveTransform = (valueMoveCSS) + 'px, 0px';
                    valueMovePicture = widthElement - valueMoveCSS;
                }else{
                    valueMoveCSS = widthElement - (pageX - $element.offset().left) << 0;
                    valueMoveTransform = -(valueMoveCSS) + 'px, 0px';
                    valueMovePicture = widthElement - valueMoveCSS;
                }

            } else if (options.direction === 'ttb' || options.direction === 'btt') {

                if( options.direction === 'ttb' ){

                    valueMoveCSS = (pageY - $element.offset().top) << 0;
                    valueMoveTransform = '0px, ' + valueMoveCSS + 'px';
                    valueMovePicture = heightElement - valueMoveCSS;

                }else{
                    valueMoveCSS = heightElement - (pageY - $element.offset().top) << 0;
                    valueMoveTransform = '0px, ' + (-valueMoveCSS) + 'px';
                    valueMovePicture = heightElement - valueMoveCSS;
                }

            }

            //Apply movement on cursor if enabled
            if (options.cursor) {
                if( supportCSSTransform ){
                    valueMoveCursor = valueMoveTransform;
                    $cursor.css('transform', 'translate(' + valueMoveTransform + ') translateZ(0)');
                }else{
                    valueMoveCursor = valueMoveCSS;
                    $cursor.css(attrToAnimate, valueMoveCSS + 'px');
                }
            }


            $liPicture[widthHeight]( valueMovePicture + 'px');

            //Update current position available on instance
            _this.position = valueMoveCSS;

        };

        //Update all CSS property on resize
        var onResize = function(){

            var valueMoveCSS = 0,
                valueMoveTransform = null;

            heightElement = parseInt($element.height());
            widthElement = parseInt($element.width());

            if (orientation === 'horizontal') {

                $('.wrap-img').css({
                    'position': 'absolute',
                    'top': '0',
                    'width': widthElement
                });

                if( options.direction === 'ltr' ){
                    valueMoveCSS = $liPicture.position().left;
                    valueMoveTransform = valueMoveCSS + 'px, 0';
                }else if( options.direction === 'rtl' ){
                    valueMoveCSS = (widthElement - $liPicture.width()) * -1;
                    valueMoveTransform = valueMoveCSS + 'px, 0';
                }

            }else if( orientation === 'vertical' ){

                if( options.direction === 'ttb' ){
                    valueMoveCSS = $liPicture.position().top;
                    valueMoveTransform = '0, ' + valueMoveCSS + 'px';
                }else if( options.direction === 'btt' ){
                    valueMoveCSS = (heightElement - $liPicture.height()) * -1;
                    valueMoveTransform = '0 , ' + valueMoveCSS + 'px';
                }

            }

            if (options.cursor) {
                if( supportCSSTransform ){
                    $cursor.css('transform', 'translate(' + valueMoveTransform + ') translateZ(0)');
                }else{
                    $cursor.css(attrToAnimate, valueMoveCSS + 'px');
                }
            }

        };

        this.goTo = function( percentage, duration, animation, easing ){

            timerGoTo = setTimeout(function(){

                var valueMoveDependOnElement = 0,
                    valueMove = 0,
                    valueCursorTransform = 0,
                    useAnimation = (typeof animation !== 'undefined' ) ? animation : true,
                    typeEasing = (typeof easing !== 'undefined' ) ? animation : 'linear',
                    objPicture = {},
                    objCursor = {},
                    delayAfterAnimation = 100;

                if (options.direction === 'ltr' || options.direction === 'rtl' ){
                    valueMoveDependOnElement = widthElement - ((widthElement * percentage) / 100);
                    valueMove = (widthElement * percentage) / 100;
                }else if( options.direction === 'ttb' || options.direction === 'btt' ){
                    valueMoveDependOnElement = heightElement - ((heightElement * percentage) / 100);
                    valueMove = (heightElement * percentage) / 100;
                }

                if( typeof jQuery !== 'undefined' && useAnimation ){

                    objPicture[widthHeight] = valueMoveDependOnElement + 'px';
                    $liPicture.animate(objPicture, duration, options.easing);

                    if (options.cursor) {

                        objCursor[attrToAnimate] = valueMove;
                        $cursor.animate(objCursor, duration, options.easing);

                        //Cursor has moved with top/left property, if supportCSSTransform is enabled, change top/left with CSS Transform after animation
                        if( supportCSSTransform ){

                            timerGoToAfter = setTimeout(function(){

                                if (options.direction === 'ltr'){
                                    valueCursorTransform = valueMoveDependOnElement + 'px, 0';
                                    $cursor.css(attrToAnimate, 'auto');
                                }else if( options.direction === 'rtl' ){
                                    valueCursorTransform = valueMoveDependOnElement + 'px, 0';
                                    $cursor.css(attrToAnimate, 'auto');
                                }else if( options.direction === 'ttb' ){
                                    valueCursorTransform = '0, ' + valueMoveDependOnElement + 'px';
                                    $cursor.css(attrToAnimate, 0);
                                }else if( options.direction === 'btt' ){
                                    $cursor.css(attrToAnimate, 'auto');
                                    valueCursorTransform = '0, ' + (-valueMoveDependOnElement) + 'px';
                                }

                                $cursor.css('transform', 'translate(' + valueCursorTransform + ') translateZ(0)');

                            }, duration + delayAfterAnimation);

                        }

                    }

                }else{
                    $liPicture[widthHeight](valueMoveDependOnElement + 'px');
                    $cursor.css(attrToAnimate, valueMove);
                }

                //Update current position available on instance
                _this.position = valueMoveDependOnElement;

            }, 100);

        };

        //Reset all CSS position
        this.reset = function(duration) {

            if( supportCSSTransform ){
                $cursor.css('transform', 'none');
            }

            if (orientation === 'horizontal') {
                $liPicture.css('width', '100%');
                $cursor.css('left', '0px');
            } else {
                $liPicture.css('height', '100%');
                $cursor.css('top', '0px');
            }

        };

        //Destroy instance and reset position
        this.destroy = function(e) {
            this.reset();
            $cursor.remove();
            $element.off('mousemove');
            $element.removeData('beforeafter');
        };

        //Init plugin
        init();

    }

    //Declare plugin on jQuery and push it on data('beforeafter')
    $.fn.beforeafter = function(options) {
        return this.each(function() {
            var elmt = $(this);
            if (elmt.data('beforeafter')) return;
            var beforeafter = new BeforeAfter(this, options);
            elmt.data('beforeafter', beforeafter);
        });
    };

})(jQuery, window);