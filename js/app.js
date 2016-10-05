(function($){

    $('.beforeafter').beforeafter({
        cursor: true,
        direction: 'ltr',
        classNameCursor: 'cursor',
        checkImagesLoaded: false,
        useCSSTransform: true,
        debug: false,
        callback: function(){
            this.goTo(50, 1000, true, 'swing');
        }
    });

}(jQuery));