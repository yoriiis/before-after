/**
 * @license MIT
 * @name BeforeAfter
 * @version 2.0.4
 * @author: Yoriiis aka Joris DANIEL <joris.daniel@gmail.com>
 * @description: BeforeAfter is a lightweight Javascript library to compare images in before/after view without any dependencies
 * {@link https://github.com/yoriiis/before-after.js}
 * @copyright 2019 Joris DANIEL
 **/

'use strict';

class BeforeAfter {
    /**
     * @param {options}
     */
    constructor(options) {
        const userOptions = options || {};
        const defaultOptions = {
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

        // Merge default options with user options
        this.options = Object.assign(defaultOptions, userOptions);

        // Detect touch devices
        this.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        this.hasMSPointer = window.navigator.msPointerEnabled;

        if (this.options.element === null) {
            console.warn('BeforeAfter::Option element is missing');
        }

        this.itemActive = this.options.element.querySelector(this.options.selectors.itemActive);
        this.orientation = '';
        this.attrToAnimate = '';
        this.widthHeight = '';
        this.heightElement = null;
        this.widthElement = null;
        this.timerGoTo = null;
        this.timerGoToAfter = null;
        this.timerCleaned = false;
        this.cursor = null;
    }

    /**
     * Create the BeforeAfter item
     * @param {Function} callback Callback function to excecute when BeforeAfter item is created
     */
    create(callback) {
        // Check if item active exist
        if (this.itemActive === null) {
            console.warn('BeforeAfter::Item active is missing');
        } else {

            this.detectOrientation();
            this.itemActive.style.zIndex = 1;

            // Build the cursor if option is enabled
            if (this.options.cursor) {
                this.updateCursor();
            }

            // Check images loaded before wrap it
            this.checkImagesLoaded(() => {
                this.heightElement = parseInt(this.options.element.offsetHeight);
                this.widthElement = parseInt(this.options.element.offsetWidth);
                this.addImageWrapper();
                
                // Excecute the callback function if it is available
                if (typeof callback === 'function') {
                callback();
            }
            });

            this.addEvents();
        }
    }

    /**
     * Detect the orientation and somes attributes from the direction
     */
    detectOrientation() {

        //Detect orientation and attribute to animate
        if (this.options.direction === 'ltr' || this.options.direction === 'rtl') {
            this.orientation = 'horizontal';
            this.widthHeight = 'width';
            this.attrToAnimate = this.options.direction === 'ltr' ? 'left' : 'right';
        } else if (this.options.direction === 'ttb' || this.options.direction === 'btt') {
            this.orientation = 'vertical';
            this.attrToAnimate = this.options.direction === 'ttb' ? 'top' : 'bottom';
            this.widthHeight = 'height';
        }

    }

    /**
     * Build the cursor item if it is not exist
     */
    buildCursor() {
        const htmlCursor = `<div class='${this.options.selectors.cursor.substr(1)}'></div>`;
        this.options.element.insertAdjacentHTML('beforeend', htmlCursor);
    }

    /**
     * Update the cursor position on move events
     */
    updateCursor() {

        // Build the cursor if it is not exist
        if (this.cursor === null) {
            this.buildCursor();
        }

        this.cursor = this.options.element.parentNode.querySelector(this.options.selectors.cursor);

        this.cursor.style.position = 'absolute';
        this.cursor.style.zIndex = 10;
        this.cursor.style.backgroundColor = '#000';
        this.cursor.style.overflow = 'hidden';
        this.cursor.style.display = 'block';

        if (this.orientation === 'horizontal') {
            this.cursor.style.width = '2px';
            this.cursor.style.height = '100%';
            this.cursor.style.top = '0px';
        } else if (this.orientation === 'vertical') {
            this.cursor.style.width = '100%';
            this.cursor.style.height = '2px';
            this.cursor.style.left = '0px';
        }

        if (this.options.direction === 'ltr') {
            this.cursor.style.left = '0px';
        }
        if (this.options.direction === 'rtl') {
            this.cursor.style.left = 'auto';
            this.cursor.style.right = '0px';
        }
        if (this.options.direction === 'ttb') {
            this.cursor.style.top = '0px';
        }
        if (this.options.direction === 'btt') {
            this.cursor.style.top = 'auto';
            this.cursor.style.bottom = '0px';
        }

    }

    /**
     * Check images loadeds before excecute callback function
     * @param {Function} callback Callback function to excecute on all images loaded
     */
    checkImagesLoaded(callback) {

        const pictures = [...this.options.element.querySelectorAll('img')];
        let counterLoaded = 0;

        pictures.forEach(picture => {
            let pictureTest = new Image();
            pictureTest.src = picture.getAttribute('src');
            pictureTest.onload = () => {
                counterLoaded++;
                if (counterLoaded === pictures.length - 1) {
                    callback();
                }
            };
        });

    }

    /**
     * Wrap all images with a wrapper
     */
    addImageWrapper() {
        const pictures = [...this.options.element.querySelectorAll('img')];
        pictures.forEach(picture => {
            const wrapper = document.createElement('div');
            wrapper.classList.add(this.options.selectors.imageWrapper.substr(1));
            picture.parentNode.insertBefore(wrapper, picture);
            wrapper.appendChild(picture);

            if (this.orientation === 'horizontal') {
                wrapper.style.position = 'absolute';
                wrapper.style.top = '0px';
                wrapper.style.width = `${this.widthElement}px`;
                this.itemActive.style.top = '0px';

                if (this.options.direction === 'ltr') {
                    this.itemActive.style.left = 'auto';
                    this.itemActive.style.right = '0';
                    wrapper.style.right = '0px';
                }

                if (this.options.direction === 'rtl') {
                    this.itemActive.style.left = '0';
                    this.itemActive.style.right = 'auto';
                    wrapper.style.left = '0px';
                }
            } else if (this.orientation === 'vertical') {
                wrapper.style.position = 'absolute';
                wrapper.style.left = '0px';
                wrapper.style.width = '100%';

                if (this.options.direction === 'ttb') {
                    this.itemActive.style.bottom = '0';
                    this.itemActive.style.top = 'auto';
                    wrapper.style.bottom = '0px';
                }

                if (this.options.direction === 'btt') {
                    this.itemActive.style.bottom = 'auto';
                    this.itemActive.style.top = '0';
                    wrapper.style.top = '0px';
                }
            }
        });
    }

    /**
     * Remove wrapper on each images
     */
    removeImageWrappers() {

        const items = [...this.options.element.querySelectorAll(this.options.selectors.item)];
        items.forEach(item => {
            item.appendChild(item.querySelector('img'));
            item.querySelector(this.options.selectors.imageWrapper).remove();
            item.removeAttribute('style');
        });

    }

    /**
     * Add event listeners on move and resize
     */
    addEvents() {
        this.onMove = e => {
            this.move(e);
        };
        this.getUserEventsToTrack().forEach(event => {
            this.options.element.addEventListener(event, this.onMove, false);
        });

        this.onResize = () => {
            this.resize();
        };
        window.addEventListener('resize', this.onResize, false);
    }

    /**
     * Remove event listeners on move and resize
     */
    removeEvents() {
        this.getUserEventsToTrack().forEach(event => {
            this.options.element.removeEventListener(event, this.onMove);
        });

        window.removeEventListener('resize', this.onResize);
    }

    /**
     * Detect which events to track depending on the capabilities of the device
     * @returns {Array} with the list of events
     */
    getUserEventsToTrack() {
        return this.hasTouch ? (this.hasMSPointer ? ['pointerstart', 'MSPointerMove'] : ['touchstart', 'touchmove']) : ['mousemove'];
    }

    /**
     * Update position on resize event
     */
    resize() {

        let valueMoveCSS = 0;
        let valueMoveTransform = null;

        this.heightElement = parseInt(this.options.element.offsetHeight);
        this.widthElement = parseInt(this.options.element.offsetWidth);

        if (this.orientation === 'horizontal') {

            const beforeAfterItems = [...this.options.element.querySelectorAll(this.options.selectors.itemActive)];
            beforeAfterItems.forEach(item => {
                item.style.position = 'absolute';
                item.style.top = '0px';
                item.style.width = this.widthElement;
            });

            if (this.options.direction === 'ltr') {
                valueMoveCSS = this.itemActive.offsetLeft;
                valueMoveTransform = `${valueMoveCSS}px, 0`;
            } else if (this.options.direction === 'rtl') {
                valueMoveCSS = (this.widthElement - this.itemActive.offsetWidth) * -1;
                valueMoveTransform = `${valueMoveCSS}px, 0`;
            }

        } else if (this.orientation === 'vertical') {

            if (this.options.direction === 'ttb') {
                valueMoveCSS = this.itemActive.offsetTop;
                valueMoveTransform = `0, ${valueMoveCSS}px`;
            } else if (this.options.direction === 'btt') {
                valueMoveCSS = (this.heightElement - this.itemActive.offsetHeight) * -1;
                valueMoveTransform = `0 , ${valueMoveCSS}px`;
            }

        }

        if (this.options.cursor) {
            this.cursor.style.transform = `translate(${valueMoveTransform}) translateZ(0)`;
        }

    }

    /**
     * Move images and cursor on user events
     * @param {Object} e Object from event listener
     */
    move(e) {
        e.preventDefault();

        //If user hover during animation, clear timer and stop animate
        if (this.timerGoTo !== null && !this.timerCleaned) {
            clearTimeout(this.timerGoTo);
            clearTimeout(this.timerGoToAfter);
            if (this.options.cursor) {
                this.updateCursor();
            }
            this.timerCleaned = true;
        }

        let valueMoveTransform = 0;
        let valueMoveCSS = 0;
        let valueMovePicture = 0;
        let pageX = 0;
        let pageY = 0;

        pageX = this.hasTouch ? e.touches[0].pageX : (this.hasMSPointer ? e.pageX : e.pageX);
        pageY = this.hasTouch ? e.touches[0].pageY : (this.hasMSPointer ? e.pageY : e.pageY);
        const elementBoundingClientRect = this.options.element.getBoundingClientRect();

        if (this.options.direction === 'ltr' || this.options.direction === 'rtl') {
            if (this.options.direction === 'ltr') {
                valueMoveCSS = parseInt(pageX - elementBoundingClientRect.x);
                valueMoveTransform = valueMoveCSS + 'px, 0px';
                valueMovePicture = this.widthElement - valueMoveCSS;
            } else {
                valueMoveCSS = parseInt(this.widthElement - (pageX - elementBoundingClientRect.x));
                valueMoveTransform = -valueMoveCSS + 'px, 0px';
                valueMovePicture = this.widthElement - valueMoveCSS;
            }
        } else if (this.options.direction === 'ttb' || this.options.direction === 'btt') {
            if (this.options.direction === 'ttb') {
                valueMoveCSS = parseInt(pageY - elementBoundingClientRect.y);
                valueMoveTransform = '0px, ' + valueMoveCSS + 'px';
                valueMovePicture = this.heightElement - valueMoveCSS;
            } else {
                valueMoveCSS = parseInt(this.heightElement - (pageY - elementBoundingClientRect.y));
                valueMoveTransform = '0px, ' + -valueMoveCSS + 'px';
                valueMovePicture = this.heightElement - valueMoveCSS;
            }
        }

        // If cursor enabled, apply new position
        if (this.options.cursor) {
            this.cursor.style.transform = `translate(${valueMoveTransform}) translateZ(0)`;
        }

        // Update new position on image
        this.itemActive.style[this.widthHeight] = `${valueMovePicture}px`;

        //Update current position available on instance
        this.position = valueMoveCSS;
    }

    /**
     * Move the animation of the image and cursor to a specific position
     * @param {Interger|Float} percentage Percentage of offset
     */
    goTo(percentage) {
        this.timerGoTo = setTimeout(() => {
            let valueMoveDependOnElement = 0;
            let valueMove = 0;
            let valueCursorTransform = 0;

            if (this.options.direction === 'ltr' || this.options.direction === 'rtl') {
                valueMoveDependOnElement = this.widthElement - (this.widthElement * percentage) / 100;
                valueMove = (this.widthElement * percentage) / 100;
            } else if (this.options.direction === 'ttb' || this.options.direction === 'btt') {
                valueMoveDependOnElement = this.heightElement - (this.heightElement * percentage) / 100;
                valueMove = (this.heightElement * percentage) / 100;
            }

            this.itemActive.style[this.widthHeight] = `${valueMoveDependOnElement}px`;

            if (this.options.cursor) {
                this.cursor.style[this.attrToAnimate] = valueMove;

                if (this.options.direction === 'ltr') {
                    valueCursorTransform = valueMoveDependOnElement + 'px, 0';
                    this.cursor.style[this.attrToAnimate] = 'auto';
                } else if (this.options.direction === 'rtl') {
                    valueCursorTransform = valueMoveDependOnElement + 'px, 0';
                    this.cursor.style[this.attrToAnimate] = 'auto';
                } else if (this.options.direction === 'ttb') {
                    valueCursorTransform = '0, ' + valueMoveDependOnElement + 'px';
                    this.cursor.style[this.attrToAnimate] = 0;
                } else if (this.options.direction === 'btt') {
                    this.cursor.style[this.attrToAnimate] = 'auto';
                    valueCursorTransform = '0, ' + valueMoveDependOnElement + 'px';
                }

                this.cursor.style.transform = `translate(${valueCursorTransform}) translateZ(0)`;
            }

            //Update current position available on instance
            this.position = valueMoveDependOnElement;
        }, 100);
    }

    /**
     * Reset the BeforeAfter item (image and cursor)
     */
    reset() {
        this.cursor.style.transform = 'none';

        if (this.orientation === 'horizontal') {
            this.itemActive.style.width = '100%';
            this.cursor.style.left = '0px';
        } else {
            this.itemActive.style.height = '100%';
            this.cursor.style.top = '0px';
        }
    }

    /**
     * Remove the BeforeAfter item
     */
    destroy() {

        this.reset();
        this.cursor.remove();
        this.removeEvents();
        this.removeImageWrappers();

    }
}

export default BeforeAfter;
module.exports = BeforeAfter;
