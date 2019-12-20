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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BeforeAfter =
/*#__PURE__*/
function () {
  /**
   * @param {options}
   */
  function BeforeAfter(options) {
    _classCallCheck(this, BeforeAfter);

    var userOptions = options || {};
    var defaultOptions = {
      element: null,
      cursor: true,
      direction: 'ltr',
      selectors: {
        item: '.beforeafter-item',
        itemActive: '.beforeafter-itemActive',
        cursor: '.beforeafter-cursor',
        imageWrapper: '.beforeafter-wrapperImage'
      } // Merge default options with user options

    };
    this.options = Object.assign(defaultOptions, userOptions); // Detect touch devices

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


  _createClass(BeforeAfter, [{
    key: "create",
    value: function create(callback) {
      var _this = this;

      // Check if item active exist
      if (this.itemActive === null) {
        console.warn('BeforeAfter::Item active is missing');
      } else {
        this.detectOrientation();
        this.itemActive.style.zIndex = 1; // Build the cursor if option is enabled

        if (this.options.cursor) {
          this.updateCursor();
        } // Check images loaded before wrap it


        this.checkImagesLoaded(function () {
          _this.heightElement = parseInt(_this.options.element.offsetHeight);
          _this.widthElement = parseInt(_this.options.element.offsetWidth);

          _this.addImageWrapper();
        });
        this.addEvents(); // Excecute the callback function if it is available

        if (typeof callback === 'function') {
          callback();
        }
      }
    }
    /**
     * Detect the orientation and somes attributes from the direction
     */

  }, {
    key: "detectOrientation",
    value: function detectOrientation() {
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

  }, {
    key: "buildCursor",
    value: function buildCursor() {
      var htmlCursor = "<div class='".concat(this.options.selectors.cursor.substr(1), "'></div>");
      this.options.element.insertAdjacentHTML('beforeend', htmlCursor);
    }
    /**
     * Update the cursor position on move events
     */

  }, {
    key: "updateCursor",
    value: function updateCursor() {
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

  }, {
    key: "checkImagesLoaded",
    value: function checkImagesLoaded(callback) {
      var pictures = _toConsumableArray(this.options.element.querySelectorAll('img'));

      var counterLoaded = 0;
      pictures.forEach(function (picture) {
        var pictureTest = new Image();
        pictureTest.src = picture.getAttribute('src');

        pictureTest.onload = function () {
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

  }, {
    key: "addImageWrapper",
    value: function addImageWrapper() {
      var _this2 = this;

      var pictures = _toConsumableArray(this.options.element.querySelectorAll('img'));

      pictures.forEach(function (picture) {
        var wrapper = document.createElement('div');
        wrapper.classList.add(_this2.options.selectors.imageWrapper.substr(1));
        picture.parentNode.insertBefore(wrapper, picture);
        wrapper.appendChild(picture);

        if (_this2.orientation === 'horizontal') {
          wrapper.style.position = 'absolute';
          wrapper.style.top = '0px';
          wrapper.style.width = "".concat(_this2.widthElement, "px");
          _this2.itemActive.style.top = '0px';

          if (_this2.options.direction === 'ltr') {
            _this2.itemActive.style.left = 'auto';
            _this2.itemActive.style.right = '0';
            wrapper.style.right = '0px';
          }

          if (_this2.options.direction === 'rtl') {
            _this2.itemActive.style.left = '0';
            _this2.itemActive.style.right = 'auto';
            wrapper.style.left = '0px';
          }
        } else if (_this2.orientation === 'vertical') {
          wrapper.style.position = 'absolute';
          wrapper.style.left = '0px';
          wrapper.style.width = '100%';

          if (_this2.options.direction === 'ttb') {
            _this2.itemActive.style.bottom = '0';
            _this2.itemActive.style.top = 'auto';
            wrapper.style.bottom = '0px';
          }

          if (_this2.options.direction === 'btt') {
            _this2.itemActive.style.bottom = 'auto';
            _this2.itemActive.style.top = '0';
            wrapper.style.top = '0px';
          }
        }
      });
    }
    /**
     * Remove wrapper on each images
     */

  }, {
    key: "removeImageWrappers",
    value: function removeImageWrappers() {
      var _this3 = this;

      var items = _toConsumableArray(this.options.element.querySelectorAll(this.options.selectors.item));

      items.forEach(function (item) {
        item.appendChild(item.querySelector('img'));
        item.querySelector(_this3.options.selectors.imageWrapper).remove();
        item.removeAttribute('style');
      });
    }
    /**
     * Add event listeners on move and resize
     */

  }, {
    key: "addEvents",
    value: function addEvents() {
      var _this4 = this;

      this.onMove = function (e) {
        _this4.move(e);
      };

      this.getUserEventsToTrack().forEach(function (event) {
        _this4.options.element.addEventListener(event, _this4.onMove, false);
      });

      this.onResize = function () {
        _this4.resize();
      };

      window.addEventListener('resize', this.onResize, false);
    }
    /**
     * Remove event listeners on move and resize
     */

  }, {
    key: "removeEvents",
    value: function removeEvents() {
      var _this5 = this;

      this.getUserEventsToTrack().forEach(function (event) {
        _this5.options.element.removeEventListener(event, _this5.onMove);
      });
      window.removeEventListener('resize', this.onResize);
    }
    /**
     * Detect which events to track depending on the capabilities of the device
     * @returns {Array} with the list of events
     */

  }, {
    key: "getUserEventsToTrack",
    value: function getUserEventsToTrack() {
      return this.hasTouch ? this.hasMSPointer ? ['pointerstart', 'MSPointerMove'] : ['touchstart', 'touchmove'] : ['mousemove'];
    }
    /**
     * Update position on resize event
     */

  }, {
    key: "resize",
    value: function resize() {
      var _this6 = this;

      var valueMoveCSS = 0;
      var valueMoveTransform = null;
      this.heightElement = parseInt(this.options.element.offsetHeight);
      this.widthElement = parseInt(this.options.element.offsetWidth);

      if (this.orientation === 'horizontal') {
        var beforeAfterItems = _toConsumableArray(this.options.element.querySelectorAll(this.options.selectors.itemActive));

        beforeAfterItems.forEach(function (item) {
          item.style.position = 'absolute';
          item.style.top = '0px';
          item.style.width = _this6.widthElement;
        });

        if (this.options.direction === 'ltr') {
          valueMoveCSS = this.itemActive.offsetLeft;
          valueMoveTransform = "".concat(valueMoveCSS, "px, 0");
        } else if (this.options.direction === 'rtl') {
          valueMoveCSS = (this.widthElement - this.itemActive.offsetWidth) * -1;
          valueMoveTransform = "".concat(valueMoveCSS, "px, 0");
        }
      } else if (this.orientation === 'vertical') {
        if (this.options.direction === 'ttb') {
          valueMoveCSS = this.itemActive.offsetTop;
          valueMoveTransform = "0, ".concat(valueMoveCSS, "px");
        } else if (this.options.direction === 'btt') {
          valueMoveCSS = (this.heightElement - this.itemActive.offsetHeight) * -1;
          valueMoveTransform = "0 , ".concat(valueMoveCSS, "px");
        }
      }

      if (this.options.cursor) {
        this.cursor.style.transform = "translate(".concat(valueMoveTransform, ") translateZ(0)");
      }
    }
    /**
     * Move images and cursor on user events
     * @param {Object} e Object from event listener
     */

  }, {
    key: "move",
    value: function move(e) {
      e.preventDefault(); //If user hover during animation, clear timer and stop animate

      if (this.timerGoTo !== null && !this.timerCleaned) {
        clearTimeout(this.timerGoTo);
        clearTimeout(this.timerGoToAfter);

        if (this.options.cursor) {
          this.updateCursor();
        }

        this.timerCleaned = true;
      }

      var valueMoveTransform = 0;
      var valueMoveCSS = 0;
      var valueMovePicture = 0;
      var pageX = 0;
      var pageY = 0;
      pageX = this.hasTouch ? e.touches[0].pageX : this.hasMSPointer ? e.pageX : e.pageX;
      pageY = this.hasTouch ? e.touches[0].pageY : this.hasMSPointer ? e.pageY : e.pageY;
      var elementBoundingClientRect = this.options.element.getBoundingClientRect();

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
      } // If cursor enabled, apply new position


      if (this.options.cursor) {
        this.cursor.style.transform = "translate(".concat(valueMoveTransform, ") translateZ(0)");
      } // Update new position on image


      this.itemActive.style[this.widthHeight] = "".concat(valueMovePicture, "px"); //Update current position available on instance

      this.position = valueMoveCSS;
    }
    /**
     * Move the animation of the image and cursor to a specific position
     * @param {Interger|Float} percentage Percentage of offset
     */

  }, {
    key: "goTo",
    value: function goTo(percentage) {
      var _this7 = this;

      this.timerGoTo = setTimeout(function () {
        var valueMoveDependOnElement = 0;
        var valueMove = 0;
        var valueCursorTransform = 0;

        if (_this7.options.direction === 'ltr' || _this7.options.direction === 'rtl') {
          valueMoveDependOnElement = _this7.widthElement - _this7.widthElement * percentage / 100;
          valueMove = _this7.widthElement * percentage / 100;
        } else if (_this7.options.direction === 'ttb' || _this7.options.direction === 'btt') {
          valueMoveDependOnElement = _this7.heightElement - _this7.heightElement * percentage / 100;
          valueMove = _this7.heightElement * percentage / 100;
        }

        _this7.itemActive.style[_this7.widthHeight] = "".concat(valueMoveDependOnElement, "px");

        if (_this7.options.cursor) {
          _this7.cursor.style[_this7.attrToAnimate] = valueMove;

          if (_this7.options.direction === 'ltr') {
            valueCursorTransform = valueMoveDependOnElement + 'px, 0';
            _this7.cursor.style[_this7.attrToAnimate] = 'auto';
          } else if (_this7.options.direction === 'rtl') {
            valueCursorTransform = valueMoveDependOnElement + 'px, 0';
            _this7.cursor.style[_this7.attrToAnimate] = 'auto';
          } else if (_this7.options.direction === 'ttb') {
            valueCursorTransform = '0, ' + valueMoveDependOnElement + 'px';
            _this7.cursor.style[_this7.attrToAnimate] = 0;
          } else if (_this7.options.direction === 'btt') {
            _this7.cursor.style[_this7.attrToAnimate] = 'auto';
            valueCursorTransform = '0, ' + valueMoveDependOnElement + 'px';
          }

          _this7.cursor.style.transform = "translate(".concat(valueCursorTransform, ") translateZ(0)");
        } //Update current position available on instance


        _this7.position = valueMoveDependOnElement;
      }, 100);
    }
    /**
     * Reset the BeforeAfter item (image and cursor)
     */

  }, {
    key: "reset",
    value: function reset() {
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

  }, {
    key: "destroy",
    value: function destroy() {
      this.reset();
      this.cursor.remove();
      this.removeEvents();
      this.removeImageWrappers();
    }
  }]);

  return BeforeAfter;
}();

var _default = BeforeAfter;
exports["default"] = _default;
module.exports = BeforeAfter;
