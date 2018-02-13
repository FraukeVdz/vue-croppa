/*
 * vue-croppa v1.2.0
 * https://github.com/zhanziyang/vue-croppa
 * 
 * Copyright (c) 2018 zhanziyang
 * Released under the ISC license
 */
  
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Croppa = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        undefined([], factory);
    } else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {
  'use strict';

  function drawImage(img, orientation, x, y, width, height) {
    if (!/^[1-8]$/.test(orientation)) throw new Error('orientation should be [1-8]');

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (width == null) width = img.width;
    if (height == null) height = img.height;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    ctx.save();
    switch (+orientation) {
      // 1 = The 0th row is at the visual top of the image, and the 0th column is the visual left-hand side.
      case 1:
          break;

      // 2 = The 0th row is at the visual top of the image, and the 0th column is the visual right-hand side.
      case 2:
         ctx.translate(width, 0);
         ctx.scale(-1, 1);
         break;

      // 3 = The 0th row is at the visual bottom of the image, and the 0th column is the visual right-hand side.
      case 3:
          ctx.translate(width, height);
          ctx.rotate(180 / 180 * Math.PI);
          break;

      // 4 = The 0th row is at the visual bottom of the image, and the 0th column is the visual left-hand side.
      case 4:
          ctx.translate(0, height);
          ctx.scale(1, -1);
          break;

      // 5 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual top.
      case 5:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.scale(1, -1);
          break;

      // 6 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual top.
      case 6:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(90 / 180 * Math.PI);
          ctx.translate(0, -height);
          break;

      // 7 = The 0th row is the visual right-hand side of the image, and the 0th column is the visual bottom.
      case 7:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(270 / 180 * Math.PI);
          ctx.translate(-width, height);
          ctx.scale(1, -1);
          break;

      // 8 = The 0th row is the visual left-hand side of the image, and the 0th column is the visual bottom.
      case 8:
          canvas.width = height;
          canvas.height = width;
          ctx.translate(0, width);
          ctx.rotate(270 / 180 * Math.PI);
          break;
    }

    ctx.drawImage(img, x, y, width, height);
    ctx.restore();

    return canvas;
  }

  return {
    drawImage: drawImage
  };
}));
});

var u = {
  onePointCoord: function onePointCoord(point, vm) {
    var canvas = vm.canvas,
        quality = vm.quality;

    var rect = canvas.getBoundingClientRect();
    var clientX = point.clientX;
    var clientY = point.clientY;
    return {
      x: (clientX - rect.left) * quality,
      y: (clientY - rect.top) * quality
    };
  },
  getPointerCoords: function getPointerCoords(evt, vm) {
    var pointer = void 0;
    if (evt.touches && evt.touches[0]) {
      pointer = evt.touches[0];
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      pointer = evt.changedTouches[0];
    } else {
      pointer = evt;
    }
    return this.onePointCoord(pointer, vm);
  },
  getPinchDistance: function getPinchDistance(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2));
  },
  getPinchCenterCoord: function getPinchCenterCoord(evt, vm) {
    var pointer1 = evt.touches[0];
    var pointer2 = evt.touches[1];
    var coord1 = this.onePointCoord(pointer1, vm);
    var coord2 = this.onePointCoord(pointer2, vm);

    return {
      x: (coord1.x + coord2.x) / 2,
      y: (coord1.y + coord2.y) / 2
    };
  },
  imageLoaded: function imageLoaded(img) {
    return img.complete && img.naturalWidth !== 0;
  },
  rAFPolyfill: function rAFPolyfill() {
    // rAF polyfill
    if (typeof document == 'undefined' || typeof window == 'undefined') return;
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || // Webkit中此取消方法的名字变了
      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          var arg = currTime + timeToCall;
          callback(arg);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }

    Array.isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  },
  toBlobPolyfill: function toBlobPolyfill() {
    if (typeof document == 'undefined' || typeof window == 'undefined' || !HTMLCanvasElement) return;
    var binStr, len, arr;
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function value(callback, type, quality) {
          binStr = atob(this.toDataURL(type, quality).split(',')[1]);
          len = binStr.length;
          arr = new Uint8Array(len);

          for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
          }

          callback(new Blob([arr], { type: type || 'image/png' }));
        }
      });
    }
  },
  eventHasFile: function eventHasFile(evt) {
    var dt = evt.dataTransfer || evt.originalEvent.dataTransfer;
    if (dt.types) {
      for (var i = 0, len = dt.types.length; i < len; i++) {
        if (dt.types[i] == 'Files') {
          return true;
        }
      }
    }

    return false;
  },
  getFileOrientation: function getFileOrientation(arrayBuffer) {
    var view = new DataView(arrayBuffer);
    if (view.getUint16(0, false) != 0xFFD8) return -2;
    var length = view.byteLength;
    var offset = 2;
    while (offset < length) {
      var marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xFFE1) {
        if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
        var little = view.getUint16(offset += 6, false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        var tags = view.getUint16(offset, little);
        offset += 2;
        for (var i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return view.getUint16(offset + i * 12 + 8, little);
          }
        }
      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
    }
    return -1;
  },
  base64ToArrayBuffer: function base64ToArrayBuffer(base64) {
    base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
    var binaryString = atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
  getRotatedImage: function getRotatedImage(img, orientation) {
    var _canvas = index.drawImage(img, orientation);
    var _img = new Image();
    _img.src = _canvas.toDataURL();
    return _img;
  },
  flipX: function flipX(ori) {
    if (ori % 2 == 0) {
      return ori - 1;
    }

    return ori + 1;
  },
  flipY: function flipY(ori) {
    var map = {
      1: 4,
      4: 1,
      2: 3,
      3: 2,
      5: 8,
      8: 5,
      6: 7,
      7: 6
    };

    return map[ori];
  },
  rotate90: function rotate90(ori) {
    var map = {
      1: 6,
      2: 7,
      3: 8,
      4: 5,
      5: 2,
      6: 3,
      7: 4,
      8: 1
    };

    return map[ori];
  },
  numberValid: function numberValid(n) {
    return typeof n === 'number' && !isNaN(n);
  }
};

Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

var initialImageType = String;
if (typeof window !== 'undefined' && window.Image) {
  initialImageType = [String, Image];
}

var props = {
  value: Object,
  width: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  height: {
    type: Number,
    default: 200,
    validator: function validator(val) {
      return val > 0;
    }
  },
  placeholder: {
    type: String,
    default: 'Choose an image'
  },
  placeholderColor: {
    default: '#606060'
  },
  placeholderFontSize: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  canvasColor: {
    default: 'transparent'
  },
  quality: {
    type: Number,
    default: 2,
    validator: function validator(val) {
      return val > 0;
    }
  },
  zoomSpeed: {
    default: 3,
    type: Number,
    validator: function validator(val) {
      return val > 0;
    }
  },
  accept: String,
  fileSizeLimit: {
    type: Number,
    default: 0,
    validator: function validator(val) {
      return val >= 0;
    }
  },
  disabled: Boolean,
  disableDragAndDrop: Boolean,
  disableClickToChoose: Boolean,
  disableDragToMove: Boolean,
  disableScrollToZoom: Boolean,
  disablePinchToZoom: Boolean,
  disableRotation: Boolean,
  reverseScrollToZoom: Boolean,
  preventWhiteSpace: Boolean,
  showRemoveButton: {
    type: Boolean,
    default: true
  },
  removeButtonColor: {
    type: String,
    default: 'red'
  },
  removeButtonSize: {
    type: Number
  },
  initialImage: initialImageType,
  initialSize: {
    type: String,
    default: 'cover',
    validator: function validator(val) {
      return val === 'cover' || val === 'contain' || val === 'natural';
    }
  },
  initialPosition: {
    type: String,
    default: 'center',
    validator: function validator(val) {
      var valids = ['center', 'top', 'bottom', 'left', 'right'];
      return val.split(' ').every(function (word) {
        return valids.indexOf(word) >= 0;
      }) || /^-?\d+% -?\d+%$/.test(val);
    }
  },
  inputAttrs: Object,
  showLoading: Boolean,
  loadingSize: {
    type: Number,
    default: 20
  },
  loadingColor: {
    type: String,
    default: '#606060'
  },
  replaceDrop: Boolean,
  passive: Boolean,
  imageBorderRadius: {
    type: [Number, String],
    default: 0
  }
};

var events = {
  INIT_EVENT: 'init',
  FILE_CHOOSE_EVENT: 'file-choose',
  FILE_SIZE_EXCEED_EVENT: 'file-size-exceed',
  FILE_TYPE_MISMATCH_EVENT: 'file-type-mismatch',
  NEW_IMAGE: 'new-image',
  NEW_IMAGE_DRAWN: 'new-image-drawn',
  IMAGE_REMOVE_EVENT: 'image-remove',
  MOVE_EVENT: 'move',
  ZOOM_EVENT: 'zoom',
  DRAW: 'draw',
  INITIAL_IMAGE_LOADED_EVENT: 'initial-image-loaded',
  LOADING_START: 'loading-start',
  LOADING_END: 'loading-end'
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PCT_PER_ZOOM = 1 / 100000; // The amount of zooming everytime it happens, in percentage of image width.
var MIN_MS_PER_CLICK = 500; // If touch duration is shorter than the value, then it is considered as a click.
var CLICK_MOVE_THRESHOLD = 100; // If touch move distance is greater than this value, then it will by no mean be considered as a click.
var MIN_WIDTH = 10; // The minimal width the user can zoom to.
var DEFAULT_PLACEHOLDER_TAKEUP = 2 / 3; // Placeholder text by default takes up this amount of times of canvas width.
var PINCH_ACCELERATION = 1; // The amount of times by which the pinching is more sensitive than the scolling

var syncData = ['imgData', 'img', 'imgSet', 'originalImage', 'naturalHeight', 'naturalWidth', 'orientation', 'scaleRatio'];
// const DEBUG = false

var component = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { ref: "wrapper", class: 'croppa-container ' + (_vm.img ? 'croppa--has-target' : '') + ' ' + (_vm.passive ? 'croppa--passive' : '') + ' ' + (_vm.disabled ? 'croppa--disabled' : '') + ' ' + (_vm.disableClickToChoose ? 'croppa--disabled-cc' : '') + ' ' + (_vm.disableDragToMove && _vm.disableScrollToZoom ? 'croppa--disabled-mz' : '') + ' ' + (_vm.fileDraggedOver ? 'croppa--dropzone' : ''), on: { "dragenter": function dragenter($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragEnter($event);
        }, "dragleave": function dragleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragLeave($event);
        }, "dragover": function dragover($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDragOver($event);
        }, "drop": function drop($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleDrop($event);
        } } }, [_c('input', _vm._b({ ref: "fileInput", staticStyle: { "height": "1px", "width": "1px", "overflow": "hidden", "margin-left": "-99999px", "position": "absolute" }, attrs: { "type": "file", "accept": _vm.accept, "disabled": _vm.disabled }, on: { "change": _vm._handleInputChange } }, 'input', _vm.inputAttrs)), _c('div', { staticClass: "slots", staticStyle: { "width": "0", "height": "0", "visibility": "hidden" } }, [_vm._t("initial"), _vm._t("placeholder")], 2), _c('canvas', { ref: "canvas", on: { "click": function click($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handleClick($event);
        }, "touchstart": function touchstart($event) {
          $event.stopPropagation();_vm._handlePointerStart($event);
        }, "mousedown": function mousedown($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "pointerstart": function pointerstart($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerStart($event);
        }, "touchend": function touchend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchcancel": function touchcancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "mouseup": function mouseup($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointerend": function pointerend($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "pointercancel": function pointercancel($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerEnd($event);
        }, "touchmove": function touchmove($event) {
          $event.stopPropagation();_vm._handlePointerMove($event);
        }, "mousemove": function mousemove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointermove": function pointermove($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerMove($event);
        }, "pointerleave": function pointerleave($event) {
          $event.stopPropagation();$event.preventDefault();_vm._handlePointerLeave($event);
        }, "DOMMouseScroll": function DOMMouseScroll($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "wheel": function wheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        }, "mousewheel": function mousewheel($event) {
          $event.stopPropagation();_vm._handleWheel($event);
        } } }), _vm.showRemoveButton && _vm.img && !_vm.passive ? _c('svg', { staticClass: "icon icon-remove", style: 'top: -' + _vm.height / 40 + 'px; right: -' + _vm.width / 40 + 'px', attrs: { "viewBox": "0 0 1024 1024", "version": "1.1", "xmlns": "http://www.w3.org/2000/svg", "xmlns:xlink": "http://www.w3.org/1999/xlink", "width": _vm.removeButtonSize || _vm.width / 10, "height": _vm.removeButtonSize || _vm.width / 10 }, on: { "click": _vm.remove } }, [_c('path', { attrs: { "d": "M511.921231 0C229.179077 0 0 229.257846 0 512 0 794.702769 229.179077 1024 511.921231 1024 794.781538 1024 1024 794.702769 1024 512 1024 229.257846 794.781538 0 511.921231 0ZM732.041846 650.633846 650.515692 732.081231C650.515692 732.081231 521.491692 593.683692 511.881846 593.683692 502.429538 593.683692 373.366154 732.081231 373.366154 732.081231L291.761231 650.633846C291.761231 650.633846 430.316308 523.500308 430.316308 512.196923 430.316308 500.696615 291.761231 373.523692 291.761231 373.523692L373.366154 291.918769C373.366154 291.918769 503.453538 430.395077 511.881846 430.395077 520.349538 430.395077 650.515692 291.918769 650.515692 291.918769L732.041846 373.523692C732.041846 373.523692 593.447385 502.547692 593.447385 512.196923 593.447385 521.412923 732.041846 650.633846 732.041846 650.633846Z", "fill": _vm.removeButtonColor } })]) : _vm._e(), _vm.showLoading && _vm.loading ? _c('div', { staticClass: "sk-fading-circle", style: _vm.loadingStyle }, _vm._l(12, function (i) {
      return _c('div', { key: i, class: 'sk-circle' + i + ' sk-circle' }, [_c('div', { staticClass: "sk-circle-indicator", style: { backgroundColor: _vm.loadingColor } })]);
    })) : _vm._e(), _vm._t("default")], 2);
  }, staticRenderFns: [],
  model: {
    prop: 'value',
    event: events.INIT_EVENT
  },

  props: props,

  data: function data() {
    return {
      canvas: null,
      ctx: null,
      originalImage: null,
      img: null,
      dragging: false,
      lastMovingCoord: null,
      imgData: {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      },
      fileDraggedOver: false,
      tabStart: 0,
      scrolling: false,
      pinching: false,
      rotating: false,
      pinchDistance: 0,
      supportTouch: false,
      pointerMoved: false,
      pointerStartCoord: null,
      naturalWidth: 0,
      naturalHeight: 0,
      scaleRatio: null,
      orientation: 1,
      userMetadata: null,
      imageSet: false,
      currentPointerCoord: null,
      currentIsInitial: false,
      loading: false,
      oldOutputHeight: 0,
      oldOutputWidth: 0,
      chosenX: 0,
      chosenY: 0,
      moveDir: null
    };
  },


  computed: {
    outputWidth: function outputWidth() {
      return this.width * this.quality;
    },
    outputHeight: function outputHeight() {
      return this.height * this.quality;
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      return this.placeholderFontSize * this.quality;
    },
    aspectRatio: function aspectRatio() {
      return this.naturalWidth / this.naturalHeight;
    },
    loadingStyle: function loadingStyle() {
      return {
        width: this.loadingSize + 'px',
        height: this.loadingSize + 'px',
        right: '15px',
        bottom: '10px'
      };
    }
  },

  mounted: function mounted() {
    var _this = this;

    this._initialize();
    u.rAFPolyfill();
    u.toBlobPolyfill();

    var supports = this.supportDetection();
    if (!supports.basic) {
      console.warn('Your browser does not support vue-croppa functionality.');
    }

    if (this.passive) {
      this.$watch('value._data', function (data) {
        var set$$1 = false;
        if (!data) return;
        for (var key in data) {
          if (syncData.indexOf(key) >= 0) {
            var val = data[key];
            if (val !== _this[key]) {
              _this.$set(_this, key, val);
              set$$1 = true;
            }
          }
        }
        if (set$$1) {
          if (!_this.img) {
            _this.remove();
          } else {
            _this.$nextTick(function () {
              _this._draw();
            });
          }
        }
      }, {
        deep: true
      });
    }

    this.oldOutputHeight = this.outputHeight * this.quality;
    this.oldOutputWidth = this.outputWidth * this.quality;
  },


  watch: {
    outputWidth: function outputWidth() {
      this.onDimensionChange();
    },
    canvasColor: function canvasColor() {
      if (!this.img) {
        this._setPlaceholders();
      } else {
        this._draw();
      }
    },
    imageBorderRadius: function imageBorderRadius() {
      if (this.img) {
        this._draw();
      }
    },
    placeholder: function placeholder() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    placeholderColor: function placeholderColor() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    computedPlaceholderFontSize: function computedPlaceholderFontSize() {
      if (!this.img) {
        this._setPlaceholders();
      }
    },
    preventWhiteSpace: function preventWhiteSpace(val) {
      if (val) {
        this.imageSet = false;
      }
      this._placeImage();
    },
    scaleRatio: function scaleRatio(val, oldVal) {
      if (this.passive) return;
      if (!this.img) return;
      if (!u.numberValid(val)) return;

      var x = 1;
      if (u.numberValid(oldVal) && oldVal !== 0) {
        x = val / oldVal;
      }
      var pos = this.currentPointerCoord || {
        x: this.imgData.startX + this.imgData.width / 2,
        y: this.imgData.startY + this.imgData.height / 2
      };
      this.imgData.width = this.naturalWidth * val;
      this.imgData.height = this.naturalHeight * val;

      if (!this.userMetadata && this.imageSet && !this.rotating) {
        var offsetX = (x - 1) * (pos.x - this.imgData.startX);
        var offsetY = (x - 1) * (pos.y - this.imgData.startY);
        this.imgData.startX = this.imgData.startX - offsetX;
        this.imgData.startY = this.imgData.startY - offsetY;
      }

      if (this.preventWhiteSpace) {
        this._preventZoomingToWhiteSpace();
        this._preventMovingToWhiteSpace();
      }
    },

    'imgData.width': function imgDataWidth(val, oldVal) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalWidth;
      if (this.hasImage()) {
        if (Math.abs(val - oldVal) > val * (1 / 100000)) {
          this.$emit(events.ZOOM_EVENT);
          this._draw();
        }
      }
    },
    'imgData.height': function imgDataHeight(val) {
      // if (this.passive) return
      if (!u.numberValid(val)) return;
      this.scaleRatio = val / this.naturalHeight;
    },
    'imgData.startX': function imgDataStartX(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    'imgData.startY': function imgDataStartY(val) {
      // if (this.passive) return
      if (this.hasImage()) {
        this.$nextTick(this._draw);
      }
    },
    loading: function loading(val) {
      if (this.passive) return;
      if (val) {
        this.$emit(events.LOADING_START);
      } else {
        this.$emit(events.LOADING_END);
      }
    }
  },

  methods: {
    getCanvas: function getCanvas() {
      return this.canvas;
    },
    getContext: function getContext() {
      return this.ctx;
    },
    getChosenFile: function getChosenFile() {
      var file = this.$refs.fileInput.files[0];
      if (typeof file === 'undefined' || file === null) file = this.originalImage;
      return file;
    },
    move: function move(offset) {
      if (!offset || this.passive) return;
      var oldX = this.imgData.startX;
      var oldY = this.imgData.startY;
      this.imgData.startX += offset.x;
      this.imgData.startY += offset.y;
      this.chosenX += offset.x;
      this.chosenY += offset.y;
      if (this.preventWhiteSpace) {
        this._preventMovingToWhiteSpace();
      }
      if (this.imgData.startX !== oldX || this.imgData.startY !== oldY) {
        this.$emit(events.MOVE_EVENT);
        this._draw();
      }
    },
    moveUpwards: function moveUpwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: -amount });
    },
    moveDownwards: function moveDownwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: 0, y: amount });
    },
    moveLeftwards: function moveLeftwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: -amount, y: 0 });
    },
    moveRightwards: function moveRightwards() {
      var amount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this.move({ x: amount, y: 0 });
    },
    zoom: function zoom() {
      var zoomIn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var acceleration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      if (this.passive) return;
      var realSpeed = this.zoomSpeed * acceleration;
      var speed = this.outputWidth * PCT_PER_ZOOM * realSpeed;
      var x = 1;
      if (zoomIn) {
        x = 1 + speed;
      } else if (this.imgData.width > MIN_WIDTH) {
        x = 1 - speed;
      }

      this.scaleRatio *= x;
    },
    zoomIn: function zoomIn() {
      this.zoom(true);
    },
    zoomOut: function zoomOut() {
      this.zoom(false);
    },
    rotate: function rotate() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (this.disableRotation || this.disabled || this.passive) return;
      step = parseInt(step);
      if (isNaN(step) || step > 3 || step < -3) {
        console.warn('Invalid argument for rotate() method. It should one of the integers from -3 to 3.');
        step = 1;
      }
      this._rotateByStep(step);
    },
    flipX: function flipX() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(2);
    },
    flipY: function flipY() {
      if (this.disableRotation || this.disabled || this.passive) return;
      this._setOrientation(4);
    },
    refresh: function refresh() {
      this.$nextTick(this._initialize);
    },
    hasImage: function hasImage() {
      return !!this.imageSet;
    },
    applyMetadata: function applyMetadata(metadata) {
      if (!metadata || this.passive) return;
      this.userMetadata = metadata;
      var ori = metadata.orientation || this.orientation || 1;
      this._setOrientation(ori, true);
    },
    generateDataUrl: function generateDataUrl(type, compressionRate) {
      if (!this.hasImage()) return '';
      return this.canvas.toDataURL(type, compressionRate);
    },
    generateBlob: function generateBlob(callback, mimeType, qualityArgument) {
      if (!this.hasImage()) {
        callback(null);
        return;
      }
      this.canvas.toBlob(callback, mimeType, qualityArgument);
    },
    promisedBlob: function promisedBlob() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (typeof Promise == 'undefined') {
        console.warn('No Promise support. Please add Promise polyfill if you want to use this method.');
        return;
      }
      return new Promise(function (resolve, reject) {
        try {
          _this2.generateBlob.apply(_this2, [function (blob) {
            resolve(blob);
          }].concat(args));
        } catch (err) {
          reject(err);
        }
      });
    },
    getMetadata: function getMetadata() {
      if (!this.hasImage()) return {};
      var _imgData = this.imgData,
          startX = _imgData.startX,
          startY = _imgData.startY;


      var canvasHeight = this.canvas.style.height;
      canvasHeight = Number(canvasHeight.substr(0, canvasHeight.length - 2));

      var canvasWidth = this.canvas.style.width;
      canvasWidth = Number(canvasWidth.substr(0, canvasWidth.length - 2));

      var height = this.naturalHeight / this.naturalWidth * canvasWidth;
      var width = this.naturalWidth / this.naturalHeight * canvasHeight;

      var y = Math.abs(this.imgData.startY / height * 100);
      var x = Math.abs(this.imgData.startX / width * 100);

      return {
        startX: startX,
        startY: startY,
        scale: this.scaleRatio,
        orientation: this.orientation,
        x: x,
        y: y
      };
    },
    supportDetection: function supportDetection() {
      if (typeof window === 'undefined') return;
      var div = document.createElement('div');
      return {
        'basic': window.requestAnimationFrame && window.File && window.FileReader && window.FileList && window.Blob,
        'dnd': 'ondragstart' in div && 'ondrop' in div
      };
    },
    chooseFile: function chooseFile() {
      if (this.passive) return;
      this.$refs.fileInput.click();
    },
    remove: function remove() {
      this._setPlaceholders();

      var hadImage = this.img != null;
      this.originalImage = null;
      this.img = null;
      this.$refs.fileInput.value = '';
      this.imgData = {
        width: 0,
        height: 0,
        startX: 0,
        startY: 0
      };
      this.orientation = 1;
      this.scaleRatio = null;
      this.userMetadata = null;
      this.imageSet = false;
      this.loading = false;

      if (hadImage) {
        this.$emit(events.IMAGE_REMOVE_EVENT);
      }
    },
    addClipPlugin: function addClipPlugin(plugin) {
      if (!this.clipPlugins) {
        this.clipPlugins = [];
      }
      if (typeof plugin === 'function' && this.clipPlugins.indexOf(plugin) < 0) {
        this.clipPlugins.push(plugin);
      } else {
        throw Error('Clip plugins should be functions');
      }
    },
    _initialize: function _initialize() {
      this.canvas = this.$refs.canvas;
      this._setSize();
      this.canvas.style.backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : typeof this.canvasColor === 'string' ? this.canvasColor : '';
      this.ctx = this.canvas.getContext('2d');
      this.originalImage = null;
      this.img = null;
      this.imageSet = false;
      this._setInitial();
      if (!this.passive) {
        this.$emit(events.INIT_EVENT, this);
      }
    },
    _setSize: function _setSize() {
      this.canvas.width = this.outputWidth;
      this.canvas.height = this.outputHeight;
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
    },
    _rotateByStep: function _rotateByStep(step) {
      var orientation = 1;
      switch (step) {
        case 1:
          orientation = 6;
          break;
        case 2:
          orientation = 3;
          break;
        case 3:
          orientation = 8;
          break;
        case -1:
          orientation = 8;
          break;
        case -2:
          orientation = 3;
          break;
        case -3:
          orientation = 6;
          break;
      }
      this._setOrientation(orientation);
    },
    _setImagePlaceholder: function _setImagePlaceholder() {
      var _this3 = this;

      var img = void 0;
      if (this.$slots.placeholder && this.$slots.placeholder[0]) {
        var vNode = this.$slots.placeholder[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }

      if (!img) return;

      var onLoad = function onLoad() {
        _this3.ctx.drawImage(img, 0, 0, _this3.outputWidth, _this3.outputHeight);
      };

      if (u.imageLoaded(img)) {
        onLoad();
      } else {
        img.onload = onLoad;
      }
    },
    _setTextPlaceholder: function _setTextPlaceholder() {
      var ctx = this.ctx;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      var defaultFontSize = this.outputWidth * DEFAULT_PLACEHOLDER_TAKEUP / this.placeholder.length;
      var fontSize = !this.computedPlaceholderFontSize || this.computedPlaceholderFontSize == 0 ? defaultFontSize : this.computedPlaceholderFontSize;
      ctx.font = fontSize + 'px sans-serif';
      ctx.fillStyle = !this.placeholderColor || this.placeholderColor == 'default' ? '#606060' : this.placeholderColor;
      ctx.fillText(this.placeholder, this.outputWidth / 2, this.outputHeight / 2);
    },
    _setPlaceholders: function _setPlaceholders() {
      this._paintBackground();
      this._setImagePlaceholder();
      this._setTextPlaceholder();
    },
    _setInitial: function _setInitial() {
      var _this4 = this;

      var src = void 0,
          img = void 0;
      if (this.$slots.initial && this.$slots.initial[0]) {
        var vNode = this.$slots.initial[0];
        var tag = vNode.tag,
            elm = vNode.elm;

        if (tag == 'img' && elm) {
          img = elm;
        }
      }
      if (this.initialImage && typeof this.initialImage === 'string') {
        src = this.initialImage;
        img = new Image();
        if (!/^data:/.test(src) && !/^blob:/.test(src)) {
          img.setAttribute('crossOrigin', 'anonymous');
        }
        img.src = src;
      } else if (_typeof(this.initialImage) === 'object' && this.initialImage instanceof Image) {
        img = this.initialImage;
      }
      if (!src && !img) {
        this._setPlaceholders();
        return;
      }
      this.currentIsInitial = true;
      if (u.imageLoaded(img)) {
        // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
        this._onload(img, +img.dataset['exifOrientation'], true);
      } else {
        this.loading = true;
        img.onload = function () {
          // this.$emit(events.INITIAL_IMAGE_LOADED_EVENT)
          _this4._onload(img, +img.dataset['exifOrientation'], true);
        };

        img.onerror = function () {
          _this4._setPlaceholders();
        };
      }
    },
    _onload: function _onload(img) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var initial = arguments[2];

      this.originalImage = img;
      this.img = img;

      if (isNaN(orientation)) {
        orientation = 1;
      }

      this._setOrientation(orientation);

      if (initial) {
        this.$emit(events.INITIAL_IMAGE_LOADED_EVENT);
      }
    },
    _handleClick: function _handleClick() {
      if (!this.hasImage() && !this.disableClickToChoose && !this.disabled && !this.supportTouch && !this.passive) {
        this.chooseFile();
      }
    },
    _handleInputChange: function _handleInputChange() {
      var input = this.$refs.fileInput;
      if (!input.files.length || this.passive) return;

      var file = input.files[0];
      this._onNewFileIn(file);
    },
    _onNewFileIn: function _onNewFileIn(file) {
      var _this5 = this;

      this.currentIsInitial = false;
      this.loading = true;
      this.$emit(events.FILE_CHOOSE_EVENT, file);
      if (!this._fileSizeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_SIZE_EXCEED_EVENT, file);
        throw new Error('File size exceeds limit which is ' + this.fileSizeLimit + ' bytes.');
      }
      if (!this._fileTypeIsValid(file)) {
        this.loading = false;
        this.$emit(events.FILE_TYPE_MISMATCH_EVENT, file);
        var type = file.type || file.name.toLowerCase().split('.').pop();
        throw new Error('File type (' + type + ') mimatches (' + this.accept + ').');
      }
      if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
        var fr = new FileReader();
        fr.onload = function (e) {
          var fileData = e.target.result;
          var orientation = 1;
          try {
            orientation = u.getFileOrientation(u.base64ToArrayBuffer(fileData));
          } catch (err) {}
          if (orientation < 1) orientation = 1;
          var img = new Image();
          img.src = fileData;
          img.onload = function () {
            _this5._onload(img, orientation);
            _this5.$emit(events.NEW_IMAGE);
          };
        };
        fr.readAsDataURL(file);
      }
    },
    _fileSizeIsValid: function _fileSizeIsValid(file) {
      if (!file) return false;
      if (!this.fileSizeLimit || this.fileSizeLimit == 0) return true;

      return file.size < this.fileSizeLimit;
    },
    _fileTypeIsValid: function _fileTypeIsValid(file) {
      if (!this.accept) return true;
      var accept = this.accept;
      var baseMimetype = accept.replace(/\/.*$/, '');
      var types = accept.split(',');
      for (var i = 0, len = types.length; i < len; i++) {
        var type = types[i];
        var t = type.trim();
        if (t.charAt(0) == '.') {
          if (file.name.toLowerCase().split('.').pop() === t.toLowerCase().slice(1)) return true;
        } else if (/\/\*$/.test(t)) {
          var fileBaseType = file.type.replace(/\/.*$/, '');
          if (fileBaseType === baseMimetype) {
            return true;
          }
        } else if (file.type === type) {
          return true;
        }
      }

      return false;
    },
    _placeImage: function _placeImage(applyMetadata) {
      if (!this.img) return;
      var imgData = this.imgData;

      this.naturalWidth = this.img.naturalWidth;
      this.naturalHeight = this.img.naturalHeight;

      imgData.startX = u.numberValid(imgData.startX) ? imgData.startX : 0;
      imgData.startY = u.numberValid(imgData.startY) ? imgData.startY : 0;

      if (this.preventWhiteSpace) {
        this._aspectFill();
      } else if (!this.imageSet) {
        if (this.initialSize == 'contain') {
          this._aspectFit();
        } else if (this.initialSize == 'natural') {
          this._naturalSize();
        } else {
          this._aspectFill();
        }
      } else {
        this.imgData.width = this.naturalWidth * this.scaleRatio;
        this.imgData.height = this.naturalHeight * this.scaleRatio;
      }

      if (!this.imageSet) {
        if (/top/.test(this.initialPosition)) {
          imgData.startY = 0;
        } else if (/bottom/.test(this.initialPosition)) {
          imgData.startY = this.outputHeight - imgData.height;
        }

        if (/left/.test(this.initialPosition)) {
          imgData.startX = 0;
        } else if (/right/.test(this.initialPosition)) {
          imgData.startX = this.outputWidth - imgData.width;
        }

        if (/^-?\d+% -?\d+%$/.test(this.initialPosition)) {
          var result = /^(-?\d+)% (-?\d+)%$/.exec(this.initialPosition);
          var x = +result[1] / 100;
          var y = +result[2] / 100;
          imgData.startX = x * (this.outputWidth - imgData.width);
          imgData.startY = y * (this.outputHeight - imgData.height);
        }
      }

      applyMetadata && this._applyMetadata();

      if (applyMetadata && this.preventWhiteSpace) {
        this.zoom(false, 0);
      } else {
        this.move({ x: 0, y: 0 });
        this._draw();
      }
    },
    _aspectFill: function _aspectFill() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;

      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startY = 0;
        if (this.moveDir === 'vertical') {
          this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
        } else {
          this.imgData.startX = this.chosenX / this.oldOutputWidth * this.outputWidth;
        }
      } else {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startX = 0;
        if (this.moveDir === 'horizontal') {
          this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
        } else {
          this.imgData.startY = this.chosenY / this.oldOutputHeight * this.outputHeight;
        }
      }
    },
    _aspectFit: function _aspectFit() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      var canvasRatio = this.outputWidth / this.outputHeight;
      var scaleRatio = void 0;
      if (this.aspectRatio > canvasRatio) {
        scaleRatio = imgWidth / this.outputWidth;
        this.imgData.height = imgHeight / scaleRatio;
        this.imgData.width = this.outputWidth;
        this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
      } else {
        scaleRatio = imgHeight / this.outputHeight;
        this.imgData.width = imgWidth / scaleRatio;
        this.imgData.height = this.outputHeight;
        this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      }
    },
    _naturalSize: function _naturalSize() {
      var imgWidth = this.naturalWidth;
      var imgHeight = this.naturalHeight;
      this.imgData.width = imgWidth;
      this.imgData.height = imgHeight;
      this.imgData.startX = -(this.imgData.width - this.outputWidth) / 2;
      this.imgData.startY = -(this.imgData.height - this.outputHeight) / 2;
    },
    _handlePointerStart: function _handlePointerStart(evt) {
      if (this.passive) return;
      this.supportTouch = true;
      this.pointerMoved = false;
      var pointerCoord = u.getPointerCoords(evt, this);
      this.pointerStartCoord = pointerCoord;

      if (this.disabled) return;
      // simulate click with touch on mobile devices
      if (!this.hasImage() && !this.disableClickToChoose) {
        this.tabStart = new Date().valueOf();
        return;
      }
      // ignore mouse right click and middle click
      if (evt.which && evt.which > 1) return;

      if (!evt.touches || evt.touches.length === 1) {
        this.dragging = true;
        this.pinching = false;
        var coord = u.getPointerCoords(evt, this);
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        this.dragging = false;
        this.pinching = true;
        this.pinchDistance = u.getPinchDistance(evt, this);
      }

      var cancelEvents = ['mouseup', 'touchend', 'touchcancel', 'pointerend', 'pointercancel'];
      for (var i = 0, len = cancelEvents.length; i < len; i++) {
        var e = cancelEvents[i];
        document.addEventListener(e, this._handlePointerEnd);
      }
    },
    _handlePointerEnd: function _handlePointerEnd(evt) {
      if (this.passive) return;
      var pointerMoveDistance = 0;
      if (this.pointerStartCoord) {
        var pointerCoord = u.getPointerCoords(evt, this);
        pointerMoveDistance = Math.sqrt(Math.pow(pointerCoord.x - this.pointerStartCoord.x, 2) + Math.pow(pointerCoord.y - this.pointerStartCoord.y, 2)) || 0;
      }
      if (this.disabled) return;
      if (!this.hasImage() && !this.disableClickToChoose) {
        var tabEnd = new Date().valueOf();
        if (pointerMoveDistance < CLICK_MOVE_THRESHOLD && tabEnd - this.tabStart < MIN_MS_PER_CLICK && this.supportTouch) {
          this.chooseFile();
        }
        this.tabStart = 0;
        return;
      }

      this.dragging = false;
      this.pinching = false;
      this.pinchDistance = 0;
      this.lastMovingCoord = null;
      this.pointerMoved = false;
      this.pointerStartCoord = null;

      this.oldOutputWidth = this.outputWidth;
      this.oldOutputHeight = this.outputHeight;
      if (this.aspectRatio > this.outputWidth / this.outputHeight) {
        this.moveDir = 'horizontal';
      } else {
        this.moveDir = 'vertical';
      }
    },
    _handlePointerMove: function _handlePointerMove(evt) {
      if (this.passive) return;
      this.pointerMoved = true;
      if (!this.hasImage()) return;
      var coord = u.getPointerCoords(evt, this);
      this.currentPointerCoord = coord;

      if (this.disabled || this.disableDragToMove) return;

      evt.preventDefault();
      if (!evt.touches || evt.touches.length === 1) {
        if (!this.dragging) return;
        if (this.lastMovingCoord) {
          this.move({
            x: coord.x - this.lastMovingCoord.x,
            y: coord.y - this.lastMovingCoord.y
          });
        }
        this.lastMovingCoord = coord;
      }

      if (evt.touches && evt.touches.length === 2 && !this.disablePinchToZoom) {
        if (!this.pinching) return;
        var distance = u.getPinchDistance(evt, this);
        var delta = distance - this.pinchDistance;
        this.zoom(delta > 0, PINCH_ACCELERATION);
        this.pinchDistance = distance;
      }
    },
    _handlePointerLeave: function _handlePointerLeave() {
      if (this.passive) return;
      this.currentPointerCoord = null;
    },
    _handleWheel: function _handleWheel(evt) {
      var _this6 = this;

      if (this.passive) return;
      if (this.disabled || this.disableScrollToZoom || !this.hasImage()) return;
      evt.preventDefault();
      this.scrolling = true;
      if (evt.wheelDelta < 0 || evt.deltaY > 0 || evt.detail > 0) {
        this.zoom(this.reverseScrollToZoom);
      } else if (evt.wheelDelta > 0 || evt.deltaY < 0 || evt.detail < 0) {
        this.zoom(!this.reverseScrollToZoom);
      }
      this.$nextTick(function () {
        _this6.scrolling = false;
      });
    },
    _handleDragEnter: function _handleDragEnter(evt) {
      if (this.passive) return;
      if (this.disabled || this.disableDragAndDrop || !u.eventHasFile(evt)) return;
      if (this.hasImage() && !this.replaceDrop) return;
      this.fileDraggedOver = true;
    },
    _handleDragLeave: function _handleDragLeave(evt) {
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      this.fileDraggedOver = false;
    },
    _handleDragOver: function _handleDragOver(evt) {},
    _handleDrop: function _handleDrop(evt) {
      if (this.passive) return;
      if (!this.fileDraggedOver || !u.eventHasFile(evt)) return;
      if (this.hasImage() && this.replaceDrop) {
        this.remove();
      }
      this.fileDraggedOver = false;

      var file = void 0;
      var dt = evt.dataTransfer;
      if (!dt) return;
      if (dt.items) {
        for (var i = 0, len = dt.items.length; i < len; i++) {
          var item = dt.items[i];
          if (item.kind == 'file') {
            file = item.getAsFile();
            break;
          }
        }
      } else {
        file = dt.files[0];
      }

      if (file) {
        this._onNewFileIn(file);
      }
    },
    _preventMovingToWhiteSpace: function _preventMovingToWhiteSpace() {
      if (this.imgData.startX > 0) {
        this.imgData.startX = 0;
      }
      if (this.imgData.startY > 0) {
        this.imgData.startY = 0;
      }
      if (this.outputWidth - this.imgData.startX > this.imgData.width) {
        this.imgData.startX = -(this.imgData.width - this.outputWidth);
      }
      if (this.outputHeight - this.imgData.startY > this.imgData.height) {
        this.imgData.startY = -(this.imgData.height - this.outputHeight);
      }
    },
    _preventZoomingToWhiteSpace: function _preventZoomingToWhiteSpace() {
      if (this.imgData.width < this.outputWidth) {
        this.scaleRatio = this.outputWidth / this.naturalWidth;
      }

      if (this.imgData.height < this.outputHeight) {
        this.scaleRatio = this.outputHeight / this.naturalHeight;
      }
    },
    _setOrientation: function _setOrientation() {
      var _this7 = this;

      var orientation = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
      var applyMetadata = arguments[1];

      var useOriginal = applyMetadata;
      if (orientation > 1 || useOriginal) {
        if (!this.img) return;
        this.rotating = true;
        var _img = u.getRotatedImage(useOriginal ? this.originalImage : this.img, orientation);
        _img.onload = function () {
          _this7.img = _img;
          _this7._placeImage(applyMetadata);
        };
      } else {
        this._placeImage(applyMetadata);
      }

      if (orientation == 2) {
        // flip x
        this.orientation = u.flipX(this.orientation);
      } else if (orientation == 4) {
        // flip y
        this.orientation = u.flipY(this.orientation);
      } else if (orientation == 6) {
        // 90 deg
        this.orientation = u.rotate90(this.orientation);
      } else if (orientation == 3) {
        // 180 deg
        this.orientation = u.rotate90(u.rotate90(this.orientation));
      } else if (orientation == 8) {
        // 270 deg
        this.orientation = u.rotate90(u.rotate90(u.rotate90(this.orientation)));
      } else {
        this.orientation = orientation;
      }

      if (useOriginal) {
        this.orientation = orientation;
      }
    },
    _paintBackground: function _paintBackground() {
      var backgroundColor = !this.canvasColor || this.canvasColor == 'default' ? 'transparent' : this.canvasColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.clearRect(0, 0, this.outputWidth, this.outputHeight);
      this.ctx.fillRect(0, 0, this.outputWidth, this.outputHeight);
    },
    _draw: function _draw() {
      var _this8 = this;

      this.$nextTick(function () {
        if (!_this8.img) return;
        if (typeof window !== 'undefined' && window.requestAnimationFrame) {
          requestAnimationFrame(_this8._drawFrame);
        } else {
          _this8._drawFrame();
        }
      });
    },
    _drawFrame: function _drawFrame() {
      this.loading = false;
      var ctx = this.ctx;
      var _imgData2 = this.imgData,
          startX = _imgData2.startX,
          startY = _imgData2.startY,
          width = _imgData2.width,
          height = _imgData2.height;


      this._paintBackground();
      ctx.drawImage(this.img, startX, startY, width, height);

      if (this.preventWhiteSpace) {
        this._clip(this._createContainerClipPath
        // this._clip(this._createImageClipPath)
        );
      }

      this.$emit(events.DRAW, ctx);
      if (!this.imageSet) {
        this.imageSet = true;
        this.$emit(events.NEW_IMAGE_DRAWN);
      }
      this.rotating = false;
    },
    _clipPathFactory: function _clipPathFactory(x, y, width, height) {
      var ctx = this.ctx;
      var radius = typeof this.imageBorderRadius === 'number' ? this.imageBorderRadius : !isNaN(Number(this.imageBorderRadius)) ? Number(this.imageBorderRadius) : 0;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    },
    _createContainerClipPath: function _createContainerClipPath() {
      var _this9 = this;

      this._clipPathFactory(0, 0, this.outputWidth, this.outputHeight);
      if (this.clipPlugins && this.clipPlugins.length) {
        this.clipPlugins.forEach(function (func) {
          func(_this9.ctx, 0, 0, _this9.outputWidth, _this9.outputHeight);
        });
      }
    },


    // _createImageClipPath () {
    //   let { startX, startY, width, height } = this.imgData
    //   let w = width
    //   let h = height
    //   let x = startX
    //   let y = startY
    //   if (w < h) {
    //     h = this.outputHeight * (width / this.outputWidth)
    //   }
    //   if (h < w) {
    //     w = this.outputWidth * (height / this.outputHeight)
    //     x = startX + (width - this.outputWidth) / 2
    //   }
    //   this._clipPathFactory(x, startY, w, h)
    // },

    _clip: function _clip(createPath) {
      var ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.globalCompositeOperation = 'destination-in';
      createPath();
      ctx.fill();
      ctx.restore();
    },
    _applyMetadata: function _applyMetadata() {
      var _this10 = this;

      if (!this.userMetadata) return;
      var _userMetadata = this.userMetadata,
          startX = _userMetadata.startX,
          startY = _userMetadata.startY,
          scale = _userMetadata.scale;


      if (u.numberValid(startX)) {
        this.imgData.startX = startX;
      }

      if (u.numberValid(startY)) {
        this.imgData.startY = startY;
      }

      if (u.numberValid(scale)) {
        this.scaleRatio = scale;
      }

      this.$nextTick(function () {
        _this10.userMetadata = null;
      });
    },
    onDimensionChange: function onDimensionChange() {
      if (!this.img) {
        this._initialize();
      } else {
        if (this.preventWhiteSpace) {
          this.imageSet = false;
        }
        this._setSize();
        this._placeImage();
      }
    }
  }
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$1 = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var defaultOptions = {
  componentName: 'croppa'
};

var VueCroppa = {
  install: function install(Vue, options) {
    options = index$1({}, defaultOptions, options);
    var version = Number(Vue.version.split('.')[0]);
    if (version < 2) {
      throw new Error('vue-croppa supports vue version 2.0 and above. You are using Vue@' + version + '. Please upgrade to the latest version of Vue.');
    }
    var componentName = options.componentName || 'croppa';

    // registration
    Vue.component(componentName, component);
  },

  component: component
};

return VueCroppa;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLWNyb3BwYS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NhbnZhcy1leGlmLW9yaWVudGF0aW9uL2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL3V0aWwuanMiLCIuLi8uLi8uLi9zcmMvcHJvcHMuanMiLCIuLi8uLi8uLi9zcmMvZXZlbnRzLmpzIiwiLi4vLi4vLi4vc3JjL2Nyb3BwZXIudnVlIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL29iamVjdC1hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5DYW52YXNFeGlmT3JpZW50YXRpb24gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24sIHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBpZiAoIS9eWzEtOF0kLy50ZXN0KG9yaWVudGF0aW9uKSkgdGhyb3cgbmV3IEVycm9yKCdvcmllbnRhdGlvbiBzaG91bGQgYmUgWzEtOF0nKTtcblxuICAgIGlmICh4ID09IG51bGwpIHggPSAwO1xuICAgIGlmICh5ID09IG51bGwpIHkgPSAwO1xuICAgIGlmICh3aWR0aCA9PSBudWxsKSB3aWR0aCA9IGltZy53aWR0aDtcbiAgICBpZiAoaGVpZ2h0ID09IG51bGwpIGhlaWdodCA9IGltZy5oZWlnaHQ7XG5cbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAvLyAxID0gVGhlIDB0aCByb3cgaXMgYXQgdGhlIHZpc3VhbCB0b3Agb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gMiA9IFRoZSAwdGggcm93IGlzIGF0IHRoZSB2aXN1YWwgdG9wIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSAyOlxuICAgICAgICAgY3R4LnRyYW5zbGF0ZSh3aWR0aCwgMCk7XG4gICAgICAgICBjdHguc2NhbGUoLTEsIDEpO1xuICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDMgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHJpZ2h0LWhhbmQgc2lkZS5cbiAgICAgIGNhc2UgMzpcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMTgwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgIC8vIDQgPSBUaGUgMHRoIHJvdyBpcyBhdCB0aGUgdmlzdWFsIGJvdHRvbSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGxlZnQtaGFuZCBzaWRlLlxuICAgICAgY2FzZSA0OlxuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA1ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIHRvcC5cbiAgICAgIGNhc2UgNTpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC5yb3RhdGUoOTAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA2ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCByaWdodC1oYW5kIHNpZGUgb2YgdGhlIGltYWdlLCBhbmQgdGhlIDB0aCBjb2x1bW4gaXMgdGhlIHZpc3VhbCB0b3AuXG4gICAgICBjYXNlIDY6XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gaGVpZ2h0O1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgICBjdHgucm90YXRlKDkwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgwLCAtaGVpZ2h0KTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgLy8gNyA9IFRoZSAwdGggcm93IGlzIHRoZSB2aXN1YWwgcmlnaHQtaGFuZCBzaWRlIG9mIHRoZSBpbWFnZSwgYW5kIHRoZSAwdGggY29sdW1uIGlzIHRoZSB2aXN1YWwgYm90dG9tLlxuICAgICAgY2FzZSA3OlxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGhlaWdodDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2lkdGg7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgyNzAgLyAxODAgKiBNYXRoLlBJKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC13aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgICBjdHguc2NhbGUoMSwgLTEpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyA4ID0gVGhlIDB0aCByb3cgaXMgdGhlIHZpc3VhbCBsZWZ0LWhhbmQgc2lkZSBvZiB0aGUgaW1hZ2UsIGFuZCB0aGUgMHRoIGNvbHVtbiBpcyB0aGUgdmlzdWFsIGJvdHRvbS5cbiAgICAgIGNhc2UgODpcbiAgICAgICAgICBjYW52YXMud2lkdGggPSBoZWlnaHQ7XG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgd2lkdGgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoMjcwIC8gMTgwICogTWF0aC5QSSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICByZXR1cm4gY2FudmFzO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkcmF3SW1hZ2U6IGRyYXdJbWFnZVxuICB9O1xufSkpO1xuIiwiaW1wb3J0IENhbnZhc0V4aWZPcmllbnRhdGlvbiBmcm9tICdjYW52YXMtZXhpZi1vcmllbnRhdGlvbidcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBvbmVQb2ludENvb3JkIChwb2ludCwgdm0pIHtcclxuICAgIGxldCB7IGNhbnZhcywgcXVhbGl0eSB9ID0gdm1cclxuICAgIGxldCByZWN0ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICBsZXQgY2xpZW50WCA9IHBvaW50LmNsaWVudFhcclxuICAgIGxldCBjbGllbnRZID0gcG9pbnQuY2xpZW50WVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgeDogKGNsaWVudFggLSByZWN0LmxlZnQpICogcXVhbGl0eSxcclxuICAgICAgeTogKGNsaWVudFkgLSByZWN0LnRvcCkgKiBxdWFsaXR5XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0UG9pbnRlckNvb3JkcyAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXJcclxuICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIH0gZWxzZSBpZiAoZXZ0LmNoYW5nZWRUb3VjaGVzICYmIGV2dC5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICBwb2ludGVyID0gZXZ0LmNoYW5nZWRUb3VjaGVzWzBdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBwb2ludGVyID0gZXZ0XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIsIHZtKVxyXG4gIH0sXHJcblxyXG4gIGdldFBpbmNoRGlzdGFuY2UgKGV2dCwgdm0pIHtcclxuICAgIGxldCBwb2ludGVyMSA9IGV2dC50b3VjaGVzWzBdXHJcbiAgICBsZXQgcG9pbnRlcjIgPSBldnQudG91Y2hlc1sxXVxyXG4gICAgbGV0IGNvb3JkMSA9IHRoaXMub25lUG9pbnRDb29yZChwb2ludGVyMSwgdm0pXHJcbiAgICBsZXQgY29vcmQyID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIyLCB2bSlcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KGNvb3JkMS54IC0gY29vcmQyLngsIDIpICsgTWF0aC5wb3coY29vcmQxLnkgLSBjb29yZDIueSwgMikpXHJcbiAgfSxcclxuXHJcbiAgZ2V0UGluY2hDZW50ZXJDb29yZCAoZXZ0LCB2bSkge1xyXG4gICAgbGV0IHBvaW50ZXIxID0gZXZ0LnRvdWNoZXNbMF1cclxuICAgIGxldCBwb2ludGVyMiA9IGV2dC50b3VjaGVzWzFdXHJcbiAgICBsZXQgY29vcmQxID0gdGhpcy5vbmVQb2ludENvb3JkKHBvaW50ZXIxLCB2bSlcclxuICAgIGxldCBjb29yZDIgPSB0aGlzLm9uZVBvaW50Q29vcmQocG9pbnRlcjIsIHZtKVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHg6IChjb29yZDEueCArIGNvb3JkMi54KSAvIDIsXHJcbiAgICAgIHk6IChjb29yZDEueSArIGNvb3JkMi55KSAvIDJcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBpbWFnZUxvYWRlZCAoaW1nKSB7XHJcbiAgICByZXR1cm4gaW1nLmNvbXBsZXRlICYmIGltZy5uYXR1cmFsV2lkdGggIT09IDBcclxuICB9LFxyXG5cclxuICByQUZQb2x5ZmlsbCAoKSB7XHJcbiAgICAvLyByQUYgcG9seWZpbGxcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICB2YXIgbGFzdFRpbWUgPSAwXHJcbiAgICB2YXIgdmVuZG9ycyA9IFsnd2Via2l0JywgJ21veiddXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddXHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdICsgJ0NhbmNlbEFuaW1hdGlvbkZyYW1lJ10gfHwgICAgLy8gV2Via2l05Lit5q2k5Y+W5raI5pa55rOV55qE5ZCN5a2X5Y+Y5LqGXHJcbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyAnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ11cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHtcclxuICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXHJcbiAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNi43IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKVxyXG4gICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZhciBhcmcgPSBjdXJyVGltZSArIHRpbWVUb0NhbGxcclxuICAgICAgICAgIGNhbGxiYWNrKGFyZylcclxuICAgICAgICB9LCB0aW1lVG9DYWxsKVxyXG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsXHJcbiAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpZClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEFycmF5LmlzQXJyYXkgPSBmdW5jdGlvbiAoYXJnKSB7XHJcbiAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRvQmxvYlBvbHlmaWxsICgpIHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHdpbmRvdyA9PSAndW5kZWZpbmVkJyB8fCAhSFRNTENhbnZhc0VsZW1lbnQpIHJldHVyblxyXG4gICAgdmFyIGJpblN0ciwgbGVuLCBhcnJcclxuICAgIGlmICghSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYikge1xyXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTENhbnZhc0VsZW1lbnQucHJvdG90eXBlLCAndG9CbG9iJywge1xyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUsIHF1YWxpdHkpIHtcclxuICAgICAgICAgIGJpblN0ciA9IGF0b2IodGhpcy50b0RhdGFVUkwodHlwZSwgcXVhbGl0eSkuc3BsaXQoJywnKVsxXSlcclxuICAgICAgICAgIGxlbiA9IGJpblN0ci5sZW5ndGhcclxuICAgICAgICAgIGFyciA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuXHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFycltpXSA9IGJpblN0ci5jaGFyQ29kZUF0KGkpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2sobmV3IEJsb2IoW2Fycl0sIHsgdHlwZTogdHlwZSB8fCAnaW1hZ2UvcG5nJyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZXZlbnRIYXNGaWxlIChldnQpIHtcclxuICAgIHZhciBkdCA9IGV2dC5kYXRhVHJhbnNmZXIgfHwgZXZ0Lm9yaWdpbmFsRXZlbnQuZGF0YVRyYW5zZmVyXHJcbiAgICBpZiAoZHQudHlwZXMpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGR0LnR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGR0LnR5cGVzW2ldID09ICdGaWxlcycpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfSxcclxuXHJcbiAgZ2V0RmlsZU9yaWVudGF0aW9uIChhcnJheUJ1ZmZlcikge1xyXG4gICAgdmFyIHZpZXcgPSBuZXcgRGF0YVZpZXcoYXJyYXlCdWZmZXIpXHJcbiAgICBpZiAodmlldy5nZXRVaW50MTYoMCwgZmFsc2UpICE9IDB4RkZEOCkgcmV0dXJuIC0yXHJcbiAgICB2YXIgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoXHJcbiAgICB2YXIgb2Zmc2V0ID0gMlxyXG4gICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xyXG4gICAgICB2YXIgbWFya2VyID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgaWYgKG1hcmtlciA9PSAweEZGRTEpIHtcclxuICAgICAgICBpZiAodmlldy5nZXRVaW50MzIob2Zmc2V0ICs9IDIsIGZhbHNlKSAhPSAweDQ1Nzg2OTY2KSByZXR1cm4gLTFcclxuICAgICAgICB2YXIgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PSAweDQ5NDlcclxuICAgICAgICBvZmZzZXQgKz0gdmlldy5nZXRVaW50MzIob2Zmc2V0ICsgNCwgbGl0dGxlKVxyXG4gICAgICAgIHZhciB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpXHJcbiAgICAgICAgb2Zmc2V0ICs9IDJcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KG9mZnNldCArIChpICogMTIpLCBsaXR0bGUpID09IDB4MDExMikge1xyXG4gICAgICAgICAgICByZXR1cm4gdmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMikgKyA4LCBsaXR0bGUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKChtYXJrZXIgJiAweEZGMDApICE9IDB4RkYwMCkgYnJlYWtcclxuICAgICAgZWxzZSBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSlcclxuICAgIH1cclxuICAgIHJldHVybiAtMVxyXG4gIH0sXHJcblxyXG4gIGJhc2U2NFRvQXJyYXlCdWZmZXIgKGJhc2U2NCkge1xyXG4gICAgYmFzZTY0ID0gYmFzZTY0LnJlcGxhY2UoL15kYXRhOihbXjtdKyk7YmFzZTY0LC9nbWksICcnKVxyXG4gICAgdmFyIGJpbmFyeVN0cmluZyA9IGF0b2IoYmFzZTY0KVxyXG4gICAgdmFyIGxlbiA9IGJpbmFyeVN0cmluZy5sZW5ndGhcclxuICAgIHZhciBieXRlcyA9IG5ldyBVaW50OEFycmF5KGxlbilcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgYnl0ZXNbaV0gPSBiaW5hcnlTdHJpbmcuY2hhckNvZGVBdChpKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ5dGVzLmJ1ZmZlclxyXG4gIH0sXHJcblxyXG4gIGdldFJvdGF0ZWRJbWFnZSAoaW1nLCBvcmllbnRhdGlvbikge1xyXG4gICAgdmFyIF9jYW52YXMgPSBDYW52YXNFeGlmT3JpZW50YXRpb24uZHJhd0ltYWdlKGltZywgb3JpZW50YXRpb24pXHJcbiAgICB2YXIgX2ltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICBfaW1nLnNyYyA9IF9jYW52YXMudG9EYXRhVVJMKClcclxuICAgIHJldHVybiBfaW1nXHJcbiAgfSxcclxuXHJcbiAgZmxpcFggKG9yaSkge1xyXG4gICAgaWYgKG9yaSAlIDIgPT0gMCkge1xyXG4gICAgICByZXR1cm4gb3JpIC0gMVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvcmkgKyAxXHJcbiAgfSxcclxuXHJcbiAgZmxpcFkgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA0LFxyXG4gICAgICA0OiAxLFxyXG4gICAgICAyOiAzLFxyXG4gICAgICAzOiAyLFxyXG4gICAgICA1OiA4LFxyXG4gICAgICA4OiA1LFxyXG4gICAgICA2OiA3LFxyXG4gICAgICA3OiA2XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgcm90YXRlOTAgKG9yaSkge1xyXG4gICAgY29uc3QgbWFwID0ge1xyXG4gICAgICAxOiA2LFxyXG4gICAgICAyOiA3LFxyXG4gICAgICAzOiA4LFxyXG4gICAgICA0OiA1LFxyXG4gICAgICA1OiAyLFxyXG4gICAgICA2OiAzLFxyXG4gICAgICA3OiA0LFxyXG4gICAgICA4OiAxXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hcFtvcmldXHJcbiAgfSxcclxuXHJcbiAgbnVtYmVyVmFsaWQgKG4pIHtcclxuICAgIHJldHVybiB0eXBlb2YgbiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKG4pXHJcbiAgfVxyXG59IiwiTnVtYmVyLmlzSW50ZWdlciA9XHJcbiAgTnVtYmVyLmlzSW50ZWdlciB8fFxyXG4gIGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxyXG4gICAgICBpc0Zpbml0ZSh2YWx1ZSkgJiZcclxuICAgICAgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlXHJcbiAgICApXHJcbiAgfVxyXG5cclxudmFyIGluaXRpYWxJbWFnZVR5cGUgPSBTdHJpbmdcclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5JbWFnZSkge1xyXG4gIGluaXRpYWxJbWFnZVR5cGUgPSBbU3RyaW5nLCBJbWFnZV1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIHZhbHVlOiBPYmplY3QsXHJcbiAgd2lkdGg6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgaGVpZ2h0OiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAyMDAsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlaG9sZGVyOiB7XHJcbiAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICBkZWZhdWx0OiAnQ2hvb3NlIGFuIGltYWdlJ1xyXG4gIH0sXHJcbiAgcGxhY2Vob2xkZXJDb2xvcjoge1xyXG4gICAgZGVmYXVsdDogJyM2MDYwNjAnXHJcbiAgfSxcclxuICBwbGFjZWhvbGRlckZvbnRTaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICBkZWZhdWx0OiAwLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHJldHVybiB2YWwgPj0gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2FudmFzQ29sb3I6IHtcclxuICAgIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICB9LFxyXG4gIHF1YWxpdHk6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIsXHJcbiAgICB2YWxpZGF0b3I6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgcmV0dXJuIHZhbCA+IDBcclxuICAgIH1cclxuICB9LFxyXG4gIHpvb21TcGVlZDoge1xyXG4gICAgZGVmYXVsdDogMyxcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID4gMFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYWNjZXB0OiBTdHJpbmcsXHJcbiAgZmlsZVNpemVMaW1pdDoge1xyXG4gICAgdHlwZTogTnVtYmVyLFxyXG4gICAgZGVmYXVsdDogMCxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID49IDBcclxuICAgIH1cclxuICB9LFxyXG4gIGRpc2FibGVkOiBCb29sZWFuLFxyXG4gIGRpc2FibGVEcmFnQW5kRHJvcDogQm9vbGVhbixcclxuICBkaXNhYmxlQ2xpY2tUb0Nob29zZTogQm9vbGVhbixcclxuICBkaXNhYmxlRHJhZ1RvTW92ZTogQm9vbGVhbixcclxuICBkaXNhYmxlU2Nyb2xsVG9ab29tOiBCb29sZWFuLFxyXG4gIGRpc2FibGVQaW5jaFRvWm9vbTogQm9vbGVhbixcclxuICBkaXNhYmxlUm90YXRpb246IEJvb2xlYW4sXHJcbiAgcmV2ZXJzZVNjcm9sbFRvWm9vbTogQm9vbGVhbixcclxuICBwcmV2ZW50V2hpdGVTcGFjZTogQm9vbGVhbixcclxuICBzaG93UmVtb3ZlQnV0dG9uOiB7XHJcbiAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgZGVmYXVsdDogdHJ1ZVxyXG4gIH0sXHJcbiAgcmVtb3ZlQnV0dG9uQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdyZWQnXHJcbiAgfSxcclxuICByZW1vdmVCdXR0b25TaXplOiB7XHJcbiAgICB0eXBlOiBOdW1iZXJcclxuICB9LFxyXG4gIGluaXRpYWxJbWFnZTogaW5pdGlhbEltYWdlVHlwZSxcclxuICBpbml0aWFsU2l6ZToge1xyXG4gICAgdHlwZTogU3RyaW5nLFxyXG4gICAgZGVmYXVsdDogJ2NvdmVyJyxcclxuICAgIHZhbGlkYXRvcjogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICByZXR1cm4gdmFsID09PSAnY292ZXInIHx8IHZhbCA9PT0gJ2NvbnRhaW4nIHx8IHZhbCA9PT0gJ25hdHVyYWwnXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0aWFsUG9zaXRpb246IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICdjZW50ZXInLFxyXG4gICAgdmFsaWRhdG9yOiBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHZhciB2YWxpZHMgPSBbJ2NlbnRlcicsICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXVxyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIHZhbC5zcGxpdCgnICcpLmV2ZXJ5KHdvcmQgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHZhbGlkcy5pbmRleE9mKHdvcmQpID49IDBcclxuICAgICAgICB9KSB8fCAvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodmFsKVxyXG4gICAgICApXHJcbiAgICB9XHJcbiAgfSxcclxuICBpbnB1dEF0dHJzOiBPYmplY3QsXHJcbiAgc2hvd0xvYWRpbmc6IEJvb2xlYW4sXHJcbiAgbG9hZGluZ1NpemU6IHtcclxuICAgIHR5cGU6IE51bWJlcixcclxuICAgIGRlZmF1bHQ6IDIwXHJcbiAgfSxcclxuICBsb2FkaW5nQ29sb3I6IHtcclxuICAgIHR5cGU6IFN0cmluZyxcclxuICAgIGRlZmF1bHQ6ICcjNjA2MDYwJ1xyXG4gIH0sXHJcbiAgcmVwbGFjZURyb3A6IEJvb2xlYW4sXHJcbiAgcGFzc2l2ZTogQm9vbGVhbixcclxuICBpbWFnZUJvcmRlclJhZGl1czoge1xyXG4gICAgdHlwZTogW051bWJlciwgU3RyaW5nXSxcclxuICAgIGRlZmF1bHQ6IDBcclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQge1xyXG4gIElOSVRfRVZFTlQ6ICdpbml0JyxcclxuICBGSUxFX0NIT09TRV9FVkVOVDogJ2ZpbGUtY2hvb3NlJyxcclxuICBGSUxFX1NJWkVfRVhDRUVEX0VWRU5UOiAnZmlsZS1zaXplLWV4Y2VlZCcsXHJcbiAgRklMRV9UWVBFX01JU01BVENIX0VWRU5UOiAnZmlsZS10eXBlLW1pc21hdGNoJyxcclxuICBORVdfSU1BR0U6ICduZXctaW1hZ2UnLFxyXG4gIE5FV19JTUFHRV9EUkFXTjogJ25ldy1pbWFnZS1kcmF3bicsXHJcbiAgSU1BR0VfUkVNT1ZFX0VWRU5UOiAnaW1hZ2UtcmVtb3ZlJyxcclxuICBNT1ZFX0VWRU5UOiAnbW92ZScsXHJcbiAgWk9PTV9FVkVOVDogJ3pvb20nLFxyXG4gIERSQVc6ICdkcmF3JyxcclxuICBJTklUSUFMX0lNQUdFX0xPQURFRF9FVkVOVDogJ2luaXRpYWwtaW1hZ2UtbG9hZGVkJyxcclxuICBMT0FESU5HX1NUQVJUOiAnbG9hZGluZy1zdGFydCcsXHJcbiAgTE9BRElOR19FTkQ6ICdsb2FkaW5nLWVuZCdcclxufVxyXG4iLCI8dGVtcGxhdGU+XHJcbiAgPGRpdiByZWY9XCJ3cmFwcGVyXCJcclxuICAgIDpjbGFzcz1cImBjcm9wcGEtY29udGFpbmVyICR7aW1nID8gJ2Nyb3BwYS0taGFzLXRhcmdldCcgOiAnJ30gJHtwYXNzaXZlID8gJ2Nyb3BwYS0tcGFzc2l2ZScgOiAnJ30gJHtkaXNhYmxlZCA/ICdjcm9wcGEtLWRpc2FibGVkJyA6ICcnfSAke2Rpc2FibGVDbGlja1RvQ2hvb3NlID8gJ2Nyb3BwYS0tZGlzYWJsZWQtY2MnIDogJyd9ICR7ZGlzYWJsZURyYWdUb01vdmUgJiYgZGlzYWJsZVNjcm9sbFRvWm9vbSA/ICdjcm9wcGEtLWRpc2FibGVkLW16JyA6ICcnfSAke2ZpbGVEcmFnZ2VkT3ZlciA/ICdjcm9wcGEtLWRyb3B6b25lJyA6ICcnfWBcIlxyXG4gICAgQGRyYWdlbnRlci5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlRHJhZ0VudGVyXCJcclxuICAgIEBkcmFnbGVhdmUuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdMZWF2ZVwiXHJcbiAgICBAZHJhZ292ZXIuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZURyYWdPdmVyXCJcclxuICAgIEBkcm9wLnN0b3AucHJldmVudD1cIl9oYW5kbGVEcm9wXCI+XHJcbiAgICA8aW5wdXQgdHlwZT1cImZpbGVcIlxyXG4gICAgICA6YWNjZXB0PVwiYWNjZXB0XCJcclxuICAgICAgOmRpc2FibGVkPVwiZGlzYWJsZWRcIlxyXG4gICAgICB2LWJpbmQ9XCJpbnB1dEF0dHJzXCJcclxuICAgICAgcmVmPVwiZmlsZUlucHV0XCJcclxuICAgICAgQGNoYW5nZT1cIl9oYW5kbGVJbnB1dENoYW5nZVwiXHJcbiAgICAgIHN0eWxlPVwiaGVpZ2h0OjFweDt3aWR0aDoxcHg7b3ZlcmZsb3c6aGlkZGVuO21hcmdpbi1sZWZ0Oi05OTk5OXB4O3Bvc2l0aW9uOmFic29sdXRlO1wiIC8+XHJcbiAgICA8ZGl2IGNsYXNzPVwic2xvdHNcIlxyXG4gICAgICBzdHlsZT1cIndpZHRoOiAwOyBoZWlnaHQ6IDA7IHZpc2liaWxpdHk6IGhpZGRlbjtcIj5cclxuICAgICAgPHNsb3QgbmFtZT1cImluaXRpYWxcIj48L3Nsb3Q+XHJcbiAgICAgIDxzbG90IG5hbWU9XCJwbGFjZWhvbGRlclwiPjwvc2xvdD5cclxuICAgIDwvZGl2PlxyXG4gICAgPGNhbnZhcyByZWY9XCJjYW52YXNcIlxyXG4gICAgICBAY2xpY2suc3RvcC5wcmV2ZW50PVwiX2hhbmRsZUNsaWNrXCJcclxuICAgICAgQHRvdWNoc3RhcnQuc3RvcD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAbW91c2Vkb3duLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAcG9pbnRlcnN0YXJ0LnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyU3RhcnRcIlxyXG4gICAgICBAdG91Y2hlbmQuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2hjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAbW91c2V1cC5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlckVuZFwiXHJcbiAgICAgIEBwb2ludGVyZW5kLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyRW5kXCJcclxuICAgICAgQHBvaW50ZXJjYW5jZWwuc3RvcC5wcmV2ZW50PVwiX2hhbmRsZVBvaW50ZXJFbmRcIlxyXG4gICAgICBAdG91Y2htb3ZlLnN0b3A9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAbW91c2Vtb3ZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTW92ZVwiXHJcbiAgICAgIEBwb2ludGVybW92ZS5zdG9wLnByZXZlbnQ9XCJfaGFuZGxlUG9pbnRlck1vdmVcIlxyXG4gICAgICBAcG9pbnRlcmxlYXZlLnN0b3AucHJldmVudD1cIl9oYW5kbGVQb2ludGVyTGVhdmVcIlxyXG4gICAgICBARE9NTW91c2VTY3JvbGwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiXHJcbiAgICAgIEB3aGVlbC5zdG9wPVwiX2hhbmRsZVdoZWVsXCJcclxuICAgICAgQG1vdXNld2hlZWwuc3RvcD1cIl9oYW5kbGVXaGVlbFwiPjwvY2FudmFzPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb24gaWNvbi1yZW1vdmVcIlxyXG4gICAgICB2LWlmPVwic2hvd1JlbW92ZUJ1dHRvbiAmJiBpbWcgJiYgIXBhc3NpdmVcIlxyXG4gICAgICBAY2xpY2s9XCJyZW1vdmVcIlxyXG4gICAgICA6c3R5bGU9XCJgdG9wOiAtJHtoZWlnaHQvNDB9cHg7IHJpZ2h0OiAtJHt3aWR0aC80MH1weGBcIlxyXG4gICAgICB2aWV3Qm94PVwiMCAwIDEwMjQgMTAyNFwiXHJcbiAgICAgIHZlcnNpb249XCIxLjFcIlxyXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcclxuICAgICAgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCJcclxuICAgICAgOndpZHRoPVwicmVtb3ZlQnV0dG9uU2l6ZSB8fCB3aWR0aC8xMFwiXHJcbiAgICAgIDpoZWlnaHQ9XCJyZW1vdmVCdXR0b25TaXplIHx8IHdpZHRoLzEwXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNTExLjkyMTIzMSAwQzIyOS4xNzkwNzcgMCAwIDIyOS4yNTc4NDYgMCA1MTIgMCA3OTQuNzAyNzY5IDIyOS4xNzkwNzcgMTAyNCA1MTEuOTIxMjMxIDEwMjQgNzk0Ljc4MTUzOCAxMDI0IDEwMjQgNzk0LjcwMjc2OSAxMDI0IDUxMiAxMDI0IDIyOS4yNTc4NDYgNzk0Ljc4MTUzOCAwIDUxMS45MjEyMzEgMFpNNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDY1MC41MTU2OTIgNzMyLjA4MTIzMUM2NTAuNTE1NjkyIDczMi4wODEyMzEgNTIxLjQ5MTY5MiA1OTMuNjgzNjkyIDUxMS44ODE4NDYgNTkzLjY4MzY5MiA1MDIuNDI5NTM4IDU5My42ODM2OTIgMzczLjM2NjE1NCA3MzIuMDgxMjMxIDM3My4zNjYxNTQgNzMyLjA4MTIzMUwyOTEuNzYxMjMxIDY1MC42MzM4NDZDMjkxLjc2MTIzMSA2NTAuNjMzODQ2IDQzMC4zMTYzMDggNTIzLjUwMDMwOCA0MzAuMzE2MzA4IDUxMi4xOTY5MjMgNDMwLjMxNjMwOCA1MDAuNjk2NjE1IDI5MS43NjEyMzEgMzczLjUyMzY5MiAyOTEuNzYxMjMxIDM3My41MjM2OTJMMzczLjM2NjE1NCAyOTEuOTE4NzY5QzM3My4zNjYxNTQgMjkxLjkxODc2OSA1MDMuNDUzNTM4IDQzMC4zOTUwNzcgNTExLjg4MTg0NiA0MzAuMzk1MDc3IDUyMC4zNDk1MzggNDMwLjM5NTA3NyA2NTAuNTE1NjkyIDI5MS45MTg3NjkgNjUwLjUxNTY5MiAyOTEuOTE4NzY5TDczMi4wNDE4NDYgMzczLjUyMzY5MkM3MzIuMDQxODQ2IDM3My41MjM2OTIgNTkzLjQ0NzM4NSA1MDIuNTQ3NjkyIDU5My40NDczODUgNTEyLjE5NjkyMyA1OTMuNDQ3Mzg1IDUyMS40MTI5MjMgNzMyLjA0MTg0NiA2NTAuNjMzODQ2IDczMi4wNDE4NDYgNjUwLjYzMzg0NlpcIlxyXG4gICAgICAgIDpmaWxsPVwicmVtb3ZlQnV0dG9uQ29sb3JcIj48L3BhdGg+XHJcbiAgICA8L3N2Zz5cclxuICAgIDxkaXYgY2xhc3M9XCJzay1mYWRpbmctY2lyY2xlXCJcclxuICAgICAgOnN0eWxlPVwibG9hZGluZ1N0eWxlXCJcclxuICAgICAgdi1pZj1cInNob3dMb2FkaW5nICYmIGxvYWRpbmdcIj5cclxuICAgICAgPGRpdiA6Y2xhc3M9XCJgc2stY2lyY2xlJHtpfSBzay1jaXJjbGVgXCJcclxuICAgICAgICB2LWZvcj1cImkgaW4gMTJcIlxyXG4gICAgICAgIDprZXk9XCJpXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNrLWNpcmNsZS1pbmRpY2F0b3JcIlxyXG4gICAgICAgICAgOnN0eWxlPVwie2JhY2tncm91bmRDb2xvcjogbG9hZGluZ0NvbG9yfVwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNsb3Q+PC9zbG90PlxyXG4gIDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuICBpbXBvcnQgdSBmcm9tICcuL3V0aWwnXHJcbiAgaW1wb3J0IHByb3BzIGZyb20gJy4vcHJvcHMnXHJcbiAgaW1wb3J0IGV2ZW50cyBmcm9tICcuL2V2ZW50cydcclxuXHJcbiAgY29uc3QgUENUX1BFUl9aT09NID0gMSAvIDEwMDAwMCAvLyBUaGUgYW1vdW50IG9mIHpvb21pbmcgZXZlcnl0aW1lIGl0IGhhcHBlbnMsIGluIHBlcmNlbnRhZ2Ugb2YgaW1hZ2Ugd2lkdGguXHJcbiAgY29uc3QgTUlOX01TX1BFUl9DTElDSyA9IDUwMCAvLyBJZiB0b3VjaCBkdXJhdGlvbiBpcyBzaG9ydGVyIHRoYW4gdGhlIHZhbHVlLCB0aGVuIGl0IGlzIGNvbnNpZGVyZWQgYXMgYSBjbGljay5cclxuICBjb25zdCBDTElDS19NT1ZFX1RIUkVTSE9MRCA9IDEwMCAvLyBJZiB0b3VjaCBtb3ZlIGRpc3RhbmNlIGlzIGdyZWF0ZXIgdGhhbiB0aGlzIHZhbHVlLCB0aGVuIGl0IHdpbGwgYnkgbm8gbWVhbiBiZSBjb25zaWRlcmVkIGFzIGEgY2xpY2suXHJcbiAgY29uc3QgTUlOX1dJRFRIID0gMTAgLy8gVGhlIG1pbmltYWwgd2lkdGggdGhlIHVzZXIgY2FuIHpvb20gdG8uXHJcbiAgY29uc3QgREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgPSAyIC8gMyAvLyBQbGFjZWhvbGRlciB0ZXh0IGJ5IGRlZmF1bHQgdGFrZXMgdXAgdGhpcyBhbW91bnQgb2YgdGltZXMgb2YgY2FudmFzIHdpZHRoLlxyXG4gIGNvbnN0IFBJTkNIX0FDQ0VMRVJBVElPTiA9IDEgLy8gVGhlIGFtb3VudCBvZiB0aW1lcyBieSB3aGljaCB0aGUgcGluY2hpbmcgaXMgbW9yZSBzZW5zaXRpdmUgdGhhbiB0aGUgc2NvbGxpbmdcclxuXHJcbiAgY29uc3Qgc3luY0RhdGEgPSBbJ2ltZ0RhdGEnLCAnaW1nJywgJ2ltZ1NldCcsICdvcmlnaW5hbEltYWdlJywgJ25hdHVyYWxIZWlnaHQnLCAnbmF0dXJhbFdpZHRoJywgJ29yaWVudGF0aW9uJywgJ3NjYWxlUmF0aW8nXVxyXG4gIC8vIGNvbnN0IERFQlVHID0gZmFsc2VcclxuXHJcbiAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgbW9kZWw6IHtcclxuICAgICAgcHJvcDogJ3ZhbHVlJyxcclxuICAgICAgZXZlbnQ6IGV2ZW50cy5JTklUX0VWRU5UXHJcbiAgICB9LFxyXG5cclxuICAgIHByb3BzOiBwcm9wcyxcclxuXHJcbiAgICBkYXRhICgpIHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgIG9yaWdpbmFsSW1hZ2U6IG51bGwsXHJcbiAgICAgICAgaW1nOiBudWxsLFxyXG4gICAgICAgIGRyYWdnaW5nOiBmYWxzZSxcclxuICAgICAgICBsYXN0TW92aW5nQ29vcmQ6IG51bGwsXHJcbiAgICAgICAgaW1nRGF0YToge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZpbGVEcmFnZ2VkT3ZlcjogZmFsc2UsXHJcbiAgICAgICAgdGFiU3RhcnQ6IDAsXHJcbiAgICAgICAgc2Nyb2xsaW5nOiBmYWxzZSxcclxuICAgICAgICBwaW5jaGluZzogZmFsc2UsXHJcbiAgICAgICAgcm90YXRpbmc6IGZhbHNlLFxyXG4gICAgICAgIHBpbmNoRGlzdGFuY2U6IDAsXHJcbiAgICAgICAgc3VwcG9ydFRvdWNoOiBmYWxzZSxcclxuICAgICAgICBwb2ludGVyTW92ZWQ6IGZhbHNlLFxyXG4gICAgICAgIHBvaW50ZXJTdGFydENvb3JkOiBudWxsLFxyXG4gICAgICAgIG5hdHVyYWxXaWR0aDogMCxcclxuICAgICAgICBuYXR1cmFsSGVpZ2h0OiAwLFxyXG4gICAgICAgIHNjYWxlUmF0aW86IG51bGwsXHJcbiAgICAgICAgb3JpZW50YXRpb246IDEsXHJcbiAgICAgICAgdXNlck1ldGFkYXRhOiBudWxsLFxyXG4gICAgICAgIGltYWdlU2V0OiBmYWxzZSxcclxuICAgICAgICBjdXJyZW50UG9pbnRlckNvb3JkOiBudWxsLFxyXG4gICAgICAgIGN1cnJlbnRJc0luaXRpYWw6IGZhbHNlLFxyXG4gICAgICAgIGxvYWRpbmc6IGZhbHNlLFxyXG4gICAgICAgIG9sZE91dHB1dEhlaWdodDogMCxcclxuICAgICAgICBvbGRPdXRwdXRXaWR0aDogMCxcclxuICAgICAgICBjaG9zZW5YOiAwLFxyXG4gICAgICAgIGNob3Nlblk6IDAsXHJcbiAgICAgICAgbW92ZURpcjogbnVsbFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGNvbXB1dGVkOiB7XHJcbiAgICAgIG91dHB1dFdpZHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMucXVhbGl0eVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgb3V0cHV0SGVpZ2h0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgfSxcclxuICAgICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGFjZWhvbGRlckZvbnRTaXplICogdGhpcy5xdWFsaXR5XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhc3BlY3RSYXRpbyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBsb2FkaW5nU3R5bGUgKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICB3aWR0aDogdGhpcy5sb2FkaW5nU2l6ZSArICdweCcsXHJcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMubG9hZGluZ1NpemUgKyAncHgnLFxyXG4gICAgICAgICAgcmlnaHQ6ICcxNXB4JyxcclxuICAgICAgICAgIGJvdHRvbTogJzEwcHgnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdW50ZWQgKCkge1xyXG4gICAgICB0aGlzLl9pbml0aWFsaXplKClcclxuICAgICAgdS5yQUZQb2x5ZmlsbCgpXHJcbiAgICAgIHUudG9CbG9iUG9seWZpbGwoKVxyXG5cclxuICAgICAgbGV0IHN1cHBvcnRzID0gdGhpcy5zdXBwb3J0RGV0ZWN0aW9uKClcclxuICAgICAgaWYgKCFzdXBwb3J0cy5iYXNpYykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybignWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdnVlLWNyb3BwYSBmdW5jdGlvbmFsaXR5LicpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHtcclxuICAgICAgICB0aGlzLiR3YXRjaCgndmFsdWUuX2RhdGEnLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNldCA9IGZhbHNlXHJcbiAgICAgICAgICBpZiAoIWRhdGEpIHJldHVyblxyXG4gICAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKHN5bmNEYXRhLmluZGV4T2Yoa2V5KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbCA9IGRhdGFba2V5XVxyXG4gICAgICAgICAgICAgIGlmICh2YWwgIT09IHRoaXNba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kc2V0KHRoaXMsIGtleSwgdmFsKVxyXG4gICAgICAgICAgICAgICAgc2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHNldCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGRlZXA6IHRydWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMub2xkT3V0cHV0SGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHQgKiB0aGlzLnF1YWxpdHlcclxuICAgICAgdGhpcy5vbGRPdXRwdXRXaWR0aCA9IHRoaXMub3V0cHV0V2lkdGggKiB0aGlzLnF1YWxpdHlcclxuICAgIH0sXHJcblxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgb3V0cHV0V2lkdGg6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm9uRGltZW5zaW9uQ2hhbmdlKClcclxuICAgICAgfSxcclxuICAgICAgY2FudmFzQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGltYWdlQm9yZGVyUmFkaXVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHBsYWNlaG9sZGVyQ29sb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaW1nKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZXRQbGFjZWhvbGRlcnMoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY29tcHV0ZWRQbGFjZWhvbGRlckZvbnRTaXplOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHByZXZlbnRXaGl0ZVNwYWNlICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcGxhY2VJbWFnZSgpXHJcbiAgICAgIH0sXHJcbiAgICAgIHNjYWxlUmF0aW8gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG5cclxuICAgICAgICB2YXIgeCA9IDFcclxuICAgICAgICBpZiAodS5udW1iZXJWYWxpZChvbGRWYWwpICYmIG9sZFZhbCAhPT0gMCkge1xyXG4gICAgICAgICAgeCA9IHZhbCAvIG9sZFZhbFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5jdXJyZW50UG9pbnRlckNvb3JkIHx8IHtcclxuICAgICAgICAgIHg6IHRoaXMuaW1nRGF0YS5zdGFydFggKyB0aGlzLmltZ0RhdGEud2lkdGggLyAyLFxyXG4gICAgICAgICAgeTogdGhpcy5pbWdEYXRhLnN0YXJ0WSArIHRoaXMuaW1nRGF0YS5oZWlnaHQgLyAyXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoICogdmFsXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHZhbFxyXG5cclxuICAgICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhICYmIHRoaXMuaW1hZ2VTZXQgJiYgIXRoaXMucm90YXRpbmcpIHtcclxuICAgICAgICAgIGxldCBvZmZzZXRYID0gKHggLSAxKSAqIChwb3MueCAtIHRoaXMuaW1nRGF0YS5zdGFydFgpXHJcbiAgICAgICAgICBsZXQgb2Zmc2V0WSA9ICh4IC0gMSkgKiAocG9zLnkgLSB0aGlzLmltZ0RhdGEuc3RhcnRZKVxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IHRoaXMuaW1nRGF0YS5zdGFydFggLSBvZmZzZXRYXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gdGhpcy5pbWdEYXRhLnN0YXJ0WSAtIG9mZnNldFlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50Wm9vbWluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50TW92aW5nVG9XaGl0ZVNwYWNlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLndpZHRoJzogZnVuY3Rpb24gKHZhbCwgb2xkVmFsKSB7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF1Lm51bWJlclZhbGlkKHZhbCkpIHJldHVyblxyXG4gICAgICAgIHRoaXMuc2NhbGVSYXRpbyA9IHZhbCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgaWYgKHRoaXMuaGFzSW1hZ2UoKSkge1xyXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHZhbCAtIG9sZFZhbCkgPiAodmFsICogKDEgLyAxMDAwMDApKSkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5aT09NX0VWRU5UKVxyXG4gICAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLmhlaWdodCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXUubnVtYmVyVmFsaWQodmFsKSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdmFsIC8gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgIH0sXHJcbiAgICAgICdpbWdEYXRhLnN0YXJ0WCc6IGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAvLyBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLiRuZXh0VGljayh0aGlzLl9kcmF3KVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgJ2ltZ0RhdGEuc3RhcnRZJzogZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgIC8vIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIHRoaXMuJG5leHRUaWNrKHRoaXMuX2RyYXcpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBsb2FkaW5nICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAodmFsKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5MT0FESU5HX1NUQVJUKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5MT0FESU5HX0VORClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbWV0aG9kczoge1xyXG4gICAgICBnZXRDYW52YXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNhbnZhc1xyXG4gICAgICB9LFxyXG5cclxuICAgICAgZ2V0Q29udGV4dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRDaG9zZW5GaWxlICgpIHtcclxuICAgICAgICBsZXQgZmlsZSA9IHRoaXMuJHJlZnMuZmlsZUlucHV0LmZpbGVzWzBdXHJcbiAgICAgICAgaWYodHlwZW9mIGZpbGUgPT09ICd1bmRlZmluZWQnIHx8IGZpbGUgPT09IG51bGwpXHJcbiAgICAgICAgICBmaWxlID0gdGhpcy5vcmlnaW5hbEltYWdlXHJcbiAgICAgICAgcmV0dXJuIGZpbGVcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmUgKG9mZnNldCkge1xyXG4gICAgICAgIGlmICghb2Zmc2V0IHx8IHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgbGV0IG9sZFggPSB0aGlzLmltZ0RhdGEuc3RhcnRYXHJcbiAgICAgICAgbGV0IG9sZFkgPSB0aGlzLmltZ0RhdGEuc3RhcnRZXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCArPSBvZmZzZXQueFxyXG4gICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgKz0gb2Zmc2V0LnlcclxuICAgICAgICB0aGlzLmNob3NlblggKz0gb2Zmc2V0LnhcclxuICAgICAgICB0aGlzLmNob3NlblkgKz0gb2Zmc2V0LnlcclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fcHJldmVudE1vdmluZ1RvV2hpdGVTcGFjZSgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYICE9PSBvbGRYIHx8IHRoaXMuaW1nRGF0YS5zdGFydFkgIT09IG9sZFkpIHtcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLk1PVkVfRVZFTlQpXHJcbiAgICAgICAgICB0aGlzLl9kcmF3KClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlVXB3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IC1hbW91bnQgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmVEb3dud2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAwLCB5OiBhbW91bnQgfSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIG1vdmVMZWZ0d2FyZHMgKGFtb3VudCA9IDEpIHtcclxuICAgICAgICB0aGlzLm1vdmUoeyB4OiAtYW1vdW50LCB5OiAwIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBtb3ZlUmlnaHR3YXJkcyAoYW1vdW50ID0gMSkge1xyXG4gICAgICAgIHRoaXMubW92ZSh7IHg6IGFtb3VudCwgeTogMCB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgem9vbSAoem9vbUluID0gdHJ1ZSwgYWNjZWxlcmF0aW9uID0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIGxldCByZWFsU3BlZWQgPSB0aGlzLnpvb21TcGVlZCAqIGFjY2VsZXJhdGlvblxyXG4gICAgICAgIGxldCBzcGVlZCA9ICh0aGlzLm91dHB1dFdpZHRoICogUENUX1BFUl9aT09NKSAqIHJlYWxTcGVlZFxyXG4gICAgICAgIGxldCB4ID0gMVxyXG4gICAgICAgIGlmICh6b29tSW4pIHtcclxuICAgICAgICAgIHggPSAxICsgc3BlZWRcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW1nRGF0YS53aWR0aCA+IE1JTl9XSURUSCkge1xyXG4gICAgICAgICAgeCA9IDEgLSBzcGVlZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVJhdGlvICo9IHhcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHpvb21JbiAoKSB7XHJcbiAgICAgICAgdGhpcy56b29tKHRydWUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICB6b29tT3V0ICgpIHtcclxuICAgICAgICB0aGlzLnpvb20oZmFsc2UpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICByb3RhdGUgKHN0ZXAgPSAxKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBzdGVwID0gcGFyc2VJbnQoc3RlcClcclxuICAgICAgICBpZiAoaXNOYU4oc3RlcCkgfHwgc3RlcCA+IDMgfHwgc3RlcCA8IC0zKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgYXJndW1lbnQgZm9yIHJvdGF0ZSgpIG1ldGhvZC4gSXQgc2hvdWxkIG9uZSBvZiB0aGUgaW50ZWdlcnMgZnJvbSAtMyB0byAzLicpXHJcbiAgICAgICAgICBzdGVwID0gMVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9yb3RhdGVCeVN0ZXAoc3RlcClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGZsaXBYICgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlUm90YXRpb24gfHwgdGhpcy5kaXNhYmxlZCB8fCB0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKDIpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBmbGlwWSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZVJvdGF0aW9uIHx8IHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbig0KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcmVmcmVzaCAoKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2sodGhpcy5faW5pdGlhbGl6ZSlcclxuICAgICAgfSxcclxuXHJcbiAgICAgIGhhc0ltYWdlICgpIHtcclxuICAgICAgICByZXR1cm4gISF0aGlzLmltYWdlU2V0XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBhcHBseU1ldGFkYXRhIChtZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghbWV0YWRhdGEgfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICB0aGlzLnVzZXJNZXRhZGF0YSA9IG1ldGFkYXRhXHJcbiAgICAgICAgdmFyIG9yaSA9IG1ldGFkYXRhLm9yaWVudGF0aW9uIHx8IHRoaXMub3JpZW50YXRpb24gfHwgMVxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaSwgdHJ1ZSlcclxuICAgICAgfSxcclxuICAgICAgZ2VuZXJhdGVEYXRhVXJsICh0eXBlLCBjb21wcmVzc2lvblJhdGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSkgcmV0dXJuICcnXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLnRvRGF0YVVSTCh0eXBlLCBjb21wcmVzc2lvblJhdGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZW5lcmF0ZUJsb2IgKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHtcclxuICAgICAgICAgIGNhbGxiYWNrKG51bGwpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jYW52YXMudG9CbG9iKGNhbGxiYWNrLCBtaW1lVHlwZSwgcXVhbGl0eUFyZ3VtZW50KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgcHJvbWlzZWRCbG9iICguLi5hcmdzKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBQcm9taXNlID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIFByb21pc2Ugc3VwcG9ydC4gUGxlYXNlIGFkZCBQcm9taXNlIHBvbHlmaWxsIGlmIHlvdSB3YW50IHRvIHVzZSB0aGlzIG1ldGhvZC4nKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlQmxvYigoYmxvYikgPT4ge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUoYmxvYilcclxuICAgICAgICAgICAgfSwgLi4uYXJncylcclxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBnZXRNZXRhZGF0YSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkpIHJldHVybiB7fVxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZIH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgbGV0IGNhbnZhc0hlaWdodCA9IHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodFxyXG4gICAgICAgIGNhbnZhc0hlaWdodCA9IE51bWJlcihjYW52YXNIZWlnaHQuc3Vic3RyKDAsIGNhbnZhc0hlaWdodC5sZW5ndGggLSAyKSlcclxuXHJcbiAgICAgICAgbGV0IGNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXMuc3R5bGUud2lkdGhcclxuICAgICAgICBjYW52YXNXaWR0aCA9IE51bWJlcihjYW52YXNXaWR0aC5zdWJzdHIoMCwgY2FudmFzV2lkdGgubGVuZ3RoIC0gMikpXHJcblxyXG5cclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHQgLyB0aGlzLm5hdHVyYWxXaWR0aCAqIGNhbnZhc1dpZHRoXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAvIHRoaXMubmF0dXJhbEhlaWdodCAqIGNhbnZhc0hlaWdodFxyXG5cclxuXHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGguYWJzKHRoaXMuaW1nRGF0YS5zdGFydFkgLyBoZWlnaHQgKiAxMDApXHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguYWJzKHRoaXMuaW1nRGF0YS5zdGFydFggLyB3aWR0aCAqIDEwMClcclxuICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBzdGFydFgsXHJcbiAgICAgICAgICBzdGFydFksXHJcbiAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZVJhdGlvLFxyXG4gICAgICAgICAgb3JpZW50YXRpb246IHRoaXMub3JpZW50YXRpb24sXHJcbiAgICAgICAgICB4OiB4LFxyXG4gICAgICAgICAgeTogeVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIHN1cHBvcnREZXRlY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXHJcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICdiYXNpYyc6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgJiYgd2luZG93LkZpbGUgJiYgd2luZG93LkZpbGVSZWFkZXIgJiYgd2luZG93LkZpbGVMaXN0ICYmIHdpbmRvdy5CbG9iLFxyXG4gICAgICAgICAgJ2RuZCc6ICdvbmRyYWdzdGFydCcgaW4gZGl2ICYmICdvbmRyb3AnIGluIGRpdlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIGNob29zZUZpbGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuJHJlZnMuZmlsZUlucHV0LmNsaWNrKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIHJlbW92ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0UGxhY2Vob2xkZXJzKClcclxuXHJcbiAgICAgICAgbGV0IGhhZEltYWdlID0gdGhpcy5pbWcgIT0gbnVsbFxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLiRyZWZzLmZpbGVJbnB1dC52YWx1ZSA9ICcnXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhID0ge1xyXG4gICAgICAgICAgd2lkdGg6IDAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSBudWxsXHJcbiAgICAgICAgdGhpcy51c2VyTWV0YWRhdGEgPSBudWxsXHJcbiAgICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlXHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuXHJcbiAgICAgICAgaWYgKGhhZEltYWdlKSB7XHJcbiAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5JTUFHRV9SRU1PVkVfRVZFTlQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgYWRkQ2xpcFBsdWdpbiAocGx1Z2luKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNsaXBQbHVnaW5zKSB7XHJcbiAgICAgICAgICB0aGlzLmNsaXBQbHVnaW5zID0gW11cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jbGlwUGx1Z2lucy5pbmRleE9mKHBsdWdpbikgPCAwKSB7XHJcbiAgICAgICAgICB0aGlzLmNsaXBQbHVnaW5zLnB1c2gocGx1Z2luKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcignQ2xpcCBwbHVnaW5zIHNob3VsZCBiZSBmdW5jdGlvbnMnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9pbml0aWFsaXplICgpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJHJlZnMuY2FudmFzXHJcbiAgICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gKCF0aGlzLmNhbnZhc0NvbG9yIHx8IHRoaXMuY2FudmFzQ29sb3IgPT0gJ2RlZmF1bHQnKSA/ICd0cmFuc3BhcmVudCcgOiAodHlwZW9mIHRoaXMuY2FudmFzQ29sb3IgPT09ICdzdHJpbmcnID8gdGhpcy5jYW52YXNDb2xvciA6ICcnKVxyXG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxJbWFnZSA9IG51bGxcclxuICAgICAgICB0aGlzLmltZyA9IG51bGxcclxuICAgICAgICB0aGlzLmltYWdlU2V0ID0gZmFsc2VcclxuICAgICAgICB0aGlzLl9zZXRJbml0aWFsKClcclxuICAgICAgICBpZiAoIXRoaXMucGFzc2l2ZSkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVF9FVkVOVCwgdGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfc2V0U2l6ZSAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLm91dHB1dFdpZHRoXHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnXHJcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyAncHgnXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcm90YXRlQnlTdGVwIChzdGVwKSB7XHJcbiAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgIHN3aXRjaCAoc3RlcCkge1xyXG4gICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDZcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSAzXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gOFxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgb3JpZW50YXRpb24gPSA4XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBjYXNlIC0yOlxyXG4gICAgICAgICAgICBvcmllbnRhdGlvbiA9IDNcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGNhc2UgLTM6XHJcbiAgICAgICAgICAgIG9yaWVudGF0aW9uID0gNlxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zZXRPcmllbnRhdGlvbihvcmllbnRhdGlvbilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRJbWFnZVBsYWNlaG9sZGVyICgpIHtcclxuICAgICAgICBsZXQgaW1nXHJcbiAgICAgICAgaWYgKHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyICYmIHRoaXMuJHNsb3RzLnBsYWNlaG9sZGVyWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5wbGFjZWhvbGRlclswXVxyXG4gICAgICAgICAgbGV0IHsgdGFnLCBlbG0gfSA9IHZOb2RlXHJcbiAgICAgICAgICBpZiAodGFnID09ICdpbWcnICYmIGVsbSkge1xyXG4gICAgICAgICAgICBpbWcgPSBlbG1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaW1nKSByZXR1cm5cclxuXHJcbiAgICAgICAgdmFyIG9uTG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY3R4LmRyYXdJbWFnZShpbWcsIDAsIDAsIHRoaXMub3V0cHV0V2lkdGgsIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHUuaW1hZ2VMb2FkZWQoaW1nKSkge1xyXG4gICAgICAgICAgb25Mb2FkKClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9IG9uTG9hZFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRUZXh0UGxhY2Vob2xkZXIgKCkge1xyXG4gICAgICAgIHZhciBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJ1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJ1xyXG4gICAgICAgIGxldCBkZWZhdWx0Rm9udFNpemUgPSB0aGlzLm91dHB1dFdpZHRoICogREVGQVVMVF9QTEFDRUhPTERFUl9UQUtFVVAgLyB0aGlzLnBsYWNlaG9sZGVyLmxlbmd0aFxyXG4gICAgICAgIGxldCBmb250U2l6ZSA9ICghdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgfHwgdGhpcy5jb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUgPT0gMCkgPyBkZWZhdWx0Rm9udFNpemUgOiB0aGlzLmNvbXB1dGVkUGxhY2Vob2xkZXJGb250U2l6ZVxyXG4gICAgICAgIGN0eC5mb250ID0gZm9udFNpemUgKyAncHggc2Fucy1zZXJpZidcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gKCF0aGlzLnBsYWNlaG9sZGVyQ29sb3IgfHwgdGhpcy5wbGFjZWhvbGRlckNvbG9yID09ICdkZWZhdWx0JykgPyAnIzYwNjA2MCcgOiB0aGlzLnBsYWNlaG9sZGVyQ29sb3JcclxuICAgICAgICBjdHguZmlsbFRleHQodGhpcy5wbGFjZWhvbGRlciwgdGhpcy5vdXRwdXRXaWR0aCAvIDIsIHRoaXMub3V0cHV0SGVpZ2h0IC8gMilcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRQbGFjZWhvbGRlcnMgKCkge1xyXG4gICAgICAgIHRoaXMuX3BhaW50QmFja2dyb3VuZCgpXHJcbiAgICAgICAgdGhpcy5fc2V0SW1hZ2VQbGFjZWhvbGRlcigpXHJcbiAgICAgICAgdGhpcy5fc2V0VGV4dFBsYWNlaG9sZGVyKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRJbml0aWFsICgpIHtcclxuICAgICAgICBsZXQgc3JjLCBpbWdcclxuICAgICAgICBpZiAodGhpcy4kc2xvdHMuaW5pdGlhbCAmJiB0aGlzLiRzbG90cy5pbml0aWFsWzBdKSB7XHJcbiAgICAgICAgICBsZXQgdk5vZGUgPSB0aGlzLiRzbG90cy5pbml0aWFsWzBdXHJcbiAgICAgICAgICBsZXQgeyB0YWcsIGVsbSB9ID0gdk5vZGVcclxuICAgICAgICAgIGlmICh0YWcgPT0gJ2ltZycgJiYgZWxtKSB7XHJcbiAgICAgICAgICAgIGltZyA9IGVsbVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbml0aWFsSW1hZ2UgJiYgdHlwZW9mIHRoaXMuaW5pdGlhbEltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgc3JjID0gdGhpcy5pbml0aWFsSW1hZ2VcclxuICAgICAgICAgIGltZyA9IG5ldyBJbWFnZSgpXHJcbiAgICAgICAgICBpZiAoIS9eZGF0YTovLnRlc3Qoc3JjKSAmJiAhL15ibG9iOi8udGVzdChzcmMpKSB7XHJcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpbWcuc3JjID0gc3JjXHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5pbml0aWFsSW1hZ2UgPT09ICdvYmplY3QnICYmIHRoaXMuaW5pdGlhbEltYWdlIGluc3RhbmNlb2YgSW1hZ2UpIHtcclxuICAgICAgICAgIGltZyA9IHRoaXMuaW5pdGlhbEltYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3JjICYmICFpbWcpIHtcclxuICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SXNJbml0aWFsID0gdHJ1ZVxyXG4gICAgICAgIGlmICh1LmltYWdlTG9hZGVkKGltZykpIHtcclxuICAgICAgICAgIC8vIHRoaXMuJGVtaXQoZXZlbnRzLklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UKVxyXG4gICAgICAgICAgdGhpcy5fb25sb2FkKGltZywgK2ltZy5kYXRhc2V0WydleGlmT3JpZW50YXRpb24nXSwgdHJ1ZSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgLy8gdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgICAgIHRoaXMuX29ubG9hZChpbWcsICtpbWcuZGF0YXNldFsnZXhpZk9yaWVudGF0aW9uJ10sIHRydWUpXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldFBsYWNlaG9sZGVycygpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX29ubG9hZCAoaW1nLCBvcmllbnRhdGlvbiA9IDEsIGluaXRpYWwpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsSW1hZ2UgPSBpbWdcclxuICAgICAgICB0aGlzLmltZyA9IGltZ1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4ob3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IDFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NldE9yaWVudGF0aW9uKG9yaWVudGF0aW9uKVxyXG5cclxuICAgICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuSU5JVElBTF9JTUFHRV9MT0FERURfRVZFTlQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZUNsaWNrICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzSW1hZ2UoKSAmJiAhdGhpcy5kaXNhYmxlQ2xpY2tUb0Nob29zZSAmJiAhdGhpcy5kaXNhYmxlZCAmJiAhdGhpcy5zdXBwb3J0VG91Y2ggJiYgIXRoaXMucGFzc2l2ZSkge1xyXG4gICAgICAgICAgdGhpcy5jaG9vc2VGaWxlKClcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlSW5wdXRDaGFuZ2UgKCkge1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHRoaXMuJHJlZnMuZmlsZUlucHV0XHJcbiAgICAgICAgaWYgKCFpbnB1dC5maWxlcy5sZW5ndGggfHwgdGhpcy5wYXNzaXZlKSByZXR1cm5cclxuXHJcbiAgICAgICAgbGV0IGZpbGUgPSBpbnB1dC5maWxlc1swXVxyXG4gICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfb25OZXdGaWxlSW4gKGZpbGUpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJc0luaXRpYWwgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWVcclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5GSUxFX0NIT09TRV9FVkVOVCwgZmlsZSlcclxuICAgICAgICBpZiAoIXRoaXMuX2ZpbGVTaXplSXNWYWxpZChmaWxlKSkge1xyXG4gICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2VcclxuICAgICAgICAgIHRoaXMuJGVtaXQoZXZlbnRzLkZJTEVfU0laRV9FWENFRURfRVZFTlQsIGZpbGUpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpbGUgc2l6ZSBleGNlZWRzIGxpbWl0IHdoaWNoIGlzICcgKyB0aGlzLmZpbGVTaXplTGltaXQgKyAnIGJ5dGVzLicpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5fZmlsZVR5cGVJc1ZhbGlkKGZpbGUpKSB7XHJcbiAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuRklMRV9UWVBFX01JU01BVENIX0VWRU5ULCBmaWxlKVxyXG4gICAgICAgICAgbGV0IHR5cGUgPSBmaWxlLnR5cGUgfHwgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGaWxlIHR5cGUgKCR7dHlwZX0pIG1pbWF0Y2hlcyAoJHt0aGlzLmFjY2VwdH0pLmApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93LkZpbGVSZWFkZXIgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBsZXQgZnIgPSBuZXcgRmlsZVJlYWRlcigpXHJcbiAgICAgICAgICBmci5vbmxvYWQgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZmlsZURhdGEgPSBlLnRhcmdldC5yZXN1bHRcclxuICAgICAgICAgICAgbGV0IG9yaWVudGF0aW9uID0gMVxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uID0gdS5nZXRGaWxlT3JpZW50YXRpb24odS5iYXNlNjRUb0FycmF5QnVmZmVyKGZpbGVEYXRhKSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7IH1cclxuICAgICAgICAgICAgaWYgKG9yaWVudGF0aW9uIDwgMSkgb3JpZW50YXRpb24gPSAxXHJcbiAgICAgICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKVxyXG4gICAgICAgICAgICBpbWcuc3JjID0gZmlsZURhdGFcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLl9vbmxvYWQoaW1nLCBvcmllbnRhdGlvbilcclxuICAgICAgICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5ORVdfSU1BR0UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGZyLnJlYWRBc0RhdGFVUkwoZmlsZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZmlsZVNpemVJc1ZhbGlkIChmaWxlKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSByZXR1cm4gZmFsc2VcclxuICAgICAgICBpZiAoIXRoaXMuZmlsZVNpemVMaW1pdCB8fCB0aGlzLmZpbGVTaXplTGltaXQgPT0gMCkgcmV0dXJuIHRydWVcclxuXHJcbiAgICAgICAgcmV0dXJuIGZpbGUuc2l6ZSA8IHRoaXMuZmlsZVNpemVMaW1pdFxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2ZpbGVUeXBlSXNWYWxpZCAoZmlsZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5hY2NlcHQpIHJldHVybiB0cnVlXHJcbiAgICAgICAgbGV0IGFjY2VwdCA9IHRoaXMuYWNjZXB0XHJcbiAgICAgICAgbGV0IGJhc2VNaW1ldHlwZSA9IGFjY2VwdC5yZXBsYWNlKC9cXC8uKiQvLCAnJylcclxuICAgICAgICBsZXQgdHlwZXMgPSBhY2NlcHQuc3BsaXQoJywnKVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0eXBlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgbGV0IHR5cGUgPSB0eXBlc1tpXVxyXG4gICAgICAgICAgbGV0IHQgPSB0eXBlLnRyaW0oKVxyXG4gICAgICAgICAgaWYgKHQuY2hhckF0KDApID09ICcuJykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuc3BsaXQoJy4nKS5wb3AoKSA9PT0gdC50b0xvd2VyQ2FzZSgpLnNsaWNlKDEpKSByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfSBlbHNlIGlmICgvXFwvXFwqJC8udGVzdCh0KSkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZUJhc2VUeXBlID0gZmlsZS50eXBlLnJlcGxhY2UoL1xcLy4qJC8sICcnKVxyXG4gICAgICAgICAgICBpZiAoZmlsZUJhc2VUeXBlID09PSBiYXNlTWltZXR5cGUpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGZpbGUudHlwZSA9PT0gdHlwZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfcGxhY2VJbWFnZSAoYXBwbHlNZXRhZGF0YSkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgIHZhciBpbWdEYXRhID0gdGhpcy5pbWdEYXRhXHJcblxyXG4gICAgICAgIHRoaXMubmF0dXJhbFdpZHRoID0gdGhpcy5pbWcubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgdGhpcy5uYXR1cmFsSGVpZ2h0ID0gdGhpcy5pbWcubmF0dXJhbEhlaWdodFxyXG5cclxuICAgICAgICBpbWdEYXRhLnN0YXJ0WCA9IHUubnVtYmVyVmFsaWQoaW1nRGF0YS5zdGFydFgpID8gaW1nRGF0YS5zdGFydFggOiAwXHJcbiAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB1Lm51bWJlclZhbGlkKGltZ0RhdGEuc3RhcnRZKSA/IGltZ0RhdGEuc3RhcnRZIDogMFxyXG5cclxuICAgICAgICBpZiAodGhpcy5wcmV2ZW50V2hpdGVTcGFjZSkge1xyXG4gICAgICAgICAgdGhpcy5fYXNwZWN0RmlsbCgpXHJcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pbWFnZVNldCkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ2NvbnRhaW4nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpdCgpXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT0gJ25hdHVyYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25hdHVyYWxTaXplKClcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FzcGVjdEZpbGwoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEud2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodCAqIHRoaXMuc2NhbGVSYXRpb1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICBpZiAoL3RvcC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9ib3R0b20vLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRZID0gdGhpcy5vdXRwdXRIZWlnaHQgLSBpbWdEYXRhLmhlaWdodFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvbGVmdC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKC9yaWdodC8udGVzdCh0aGlzLmluaXRpYWxQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFggPSB0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGlmICgvXi0/XFxkKyUgLT9cXGQrJSQvLnRlc3QodGhpcy5pbml0aWFsUG9zaXRpb24pKSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAvXigtP1xcZCspJSAoLT9cXGQrKSUkLy5leGVjKHRoaXMuaW5pdGlhbFBvc2l0aW9uKVxyXG4gICAgICAgICAgICB2YXIgeCA9ICtyZXN1bHRbMV0gLyAxMDBcclxuICAgICAgICAgICAgdmFyIHkgPSArcmVzdWx0WzJdIC8gMTAwXHJcbiAgICAgICAgICAgIGltZ0RhdGEuc3RhcnRYID0geCAqICh0aGlzLm91dHB1dFdpZHRoIC0gaW1nRGF0YS53aWR0aClcclxuICAgICAgICAgICAgaW1nRGF0YS5zdGFydFkgPSB5ICogKHRoaXMub3V0cHV0SGVpZ2h0IC0gaW1nRGF0YS5oZWlnaHQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhcHBseU1ldGFkYXRhICYmIHRoaXMuX2FwcGx5TWV0YWRhdGEoKVxyXG5cclxuICAgICAgICBpZiAoYXBwbHlNZXRhZGF0YSAmJiB0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICB0aGlzLnpvb20oZmFsc2UsIDApXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubW92ZSh7IHg6IDAsIHk6IDAgfSlcclxuICAgICAgICAgIHRoaXMuX2RyYXcoKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hc3BlY3RGaWxsICgpIHtcclxuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLm5hdHVyYWxXaWR0aFxyXG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcclxuICAgICAgICBsZXQgY2FudmFzUmF0aW8gPSB0aGlzLm91dHB1dFdpZHRoIC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICBsZXQgc2NhbGVSYXRpb1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hc3BlY3RSYXRpbyA+IGNhbnZhc1JhdGlvKSB7XHJcbiAgICAgICAgICBzY2FsZVJhdGlvID0gaW1nSGVpZ2h0IC8gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IGltZ1dpZHRoIC8gc2NhbGVSYXRpb1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgICAgaWYodGhpcy5tb3ZlRGlyID09PSAndmVydGljYWwnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9ICh0aGlzLmNob3NlblggLyB0aGlzLm9sZE91dHB1dFdpZHRoICogdGhpcy5vdXRwdXRXaWR0aClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAwXHJcbiAgICAgICAgICBpZih0aGlzLm1vdmVEaXIgPT09ICdob3Jpem9udGFsJykge1xyXG4gICAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpIC8gMlxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9ICh0aGlzLmNob3NlblkgLyB0aGlzLm9sZE91dHB1dEhlaWdodCAqIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hc3BlY3RGaXQgKCkge1xyXG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIGxldCBjYW52YXNSYXRpbyA9IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgIGxldCBzY2FsZVJhdGlvXHJcbiAgICAgICAgaWYgKHRoaXMuYXNwZWN0UmF0aW8gPiBjYW52YXNSYXRpbykge1xyXG4gICAgICAgICAgc2NhbGVSYXRpbyA9IGltZ1dpZHRoIC8gdGhpcy5vdXRwdXRXaWR0aFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLmhlaWdodCA9IGltZ0hlaWdodCAvIHNjYWxlUmF0aW9cclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS53aWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSAtKHRoaXMuaW1nRGF0YS5oZWlnaHQgLSB0aGlzLm91dHB1dEhlaWdodCkgLyAyXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNjYWxlUmF0aW8gPSBpbWdIZWlnaHQgLyB0aGlzLm91dHB1dEhlaWdodFxyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGggLyBzY2FsZVJhdGlvXHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gdGhpcy5vdXRwdXRIZWlnaHRcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9uYXR1cmFsU2l6ZSAoKSB7XHJcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5uYXR1cmFsV2lkdGhcclxuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLndpZHRoID0gaW1nV2lkdGhcclxuICAgICAgICB0aGlzLmltZ0RhdGEuaGVpZ2h0ID0gaW1nSGVpZ2h0XHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IC0odGhpcy5pbWdEYXRhLndpZHRoIC0gdGhpcy5vdXRwdXRXaWR0aCkgLyAyXHJcbiAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WSA9IC0odGhpcy5pbWdEYXRhLmhlaWdodCAtIHRoaXMub3V0cHV0SGVpZ2h0KSAvIDJcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVQb2ludGVyU3RhcnQgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuc3VwcG9ydFRvdWNoID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gZmFsc2VcclxuICAgICAgICBsZXQgcG9pbnRlckNvb3JkID0gdS5nZXRQb2ludGVyQ29vcmRzKGV2dCwgdGhpcylcclxuICAgICAgICB0aGlzLnBvaW50ZXJTdGFydENvb3JkID0gcG9pbnRlckNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm5cclxuICAgICAgICAvLyBzaW11bGF0ZSBjbGljayB3aXRoIHRvdWNoIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICAgIHRoaXMudGFiU3RhcnQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlnbm9yZSBtb3VzZSByaWdodCBjbGljayBhbmQgbWlkZGxlIGNsaWNrXHJcbiAgICAgICAgaWYgKGV2dC53aGljaCAmJiBldnQud2hpY2ggPiAxKSByZXR1cm5cclxuXHJcbiAgICAgICAgaWYgKCFldnQudG91Y2hlcyB8fCBldnQudG91Y2hlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICAgIGxldCBjb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICB0aGlzLmxhc3RNb3ZpbmdDb29yZCA9IGNvb3JkXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZ0LnRvdWNoZXMgJiYgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAyICYmICF0aGlzLmRpc2FibGVQaW5jaFRvWm9vbSkge1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlXHJcbiAgICAgICAgICB0aGlzLnBpbmNoaW5nID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy5waW5jaERpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjYW5jZWxFdmVudHMgPSBbJ21vdXNldXAnLCAndG91Y2hlbmQnLCAndG91Y2hjYW5jZWwnLCAncG9pbnRlcmVuZCcsICdwb2ludGVyY2FuY2VsJ11cclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gY2FuY2VsRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICBsZXQgZSA9IGNhbmNlbEV2ZW50c1tpXVxyXG4gICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihlLCB0aGlzLl9oYW5kbGVQb2ludGVyRW5kKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVQb2ludGVyRW5kIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBsZXQgcG9pbnRlck1vdmVEaXN0YW5jZSA9IDBcclxuICAgICAgICBpZiAodGhpcy5wb2ludGVyU3RhcnRDb29yZCkge1xyXG4gICAgICAgICAgbGV0IHBvaW50ZXJDb29yZCA9IHUuZ2V0UG9pbnRlckNvb3JkcyhldnQsIHRoaXMpXHJcbiAgICAgICAgICBwb2ludGVyTW92ZURpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHBvaW50ZXJDb29yZC54IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC54LCAyKSArIE1hdGgucG93KHBvaW50ZXJDb29yZC55IC0gdGhpcy5wb2ludGVyU3RhcnRDb29yZC55LCAyKSkgfHwgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMuZGlzYWJsZUNsaWNrVG9DaG9vc2UpIHtcclxuICAgICAgICAgIGxldCB0YWJFbmQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKVxyXG4gICAgICAgICAgaWYgKChwb2ludGVyTW92ZURpc3RhbmNlIDwgQ0xJQ0tfTU9WRV9USFJFU0hPTEQpICYmIHRhYkVuZCAtIHRoaXMudGFiU3RhcnQgPCBNSU5fTVNfUEVSX0NMSUNLICYmIHRoaXMuc3VwcG9ydFRvdWNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvb3NlRmlsZSgpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLnRhYlN0YXJ0ID0gMFxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoaW5nID0gZmFsc2VcclxuICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSAwXHJcbiAgICAgICAgdGhpcy5sYXN0TW92aW5nQ29vcmQgPSBudWxsXHJcbiAgICAgICAgdGhpcy5wb2ludGVyTW92ZWQgPSBmYWxzZVxyXG4gICAgICAgIHRoaXMucG9pbnRlclN0YXJ0Q29vcmQgPSBudWxsXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbGRPdXRwdXRXaWR0aCA9IHRoaXMub3V0cHV0V2lkdGhcclxuICAgICAgICB0aGlzLm9sZE91dHB1dEhlaWdodCA9IHRoaXMub3V0cHV0SGVpZ2h0XHJcbiAgICAgICAgaWYodGhpcy5hc3BlY3RSYXRpbyA+IHRoaXMub3V0cHV0V2lkdGggLyB0aGlzLm91dHB1dEhlaWdodCkge1xyXG4gICAgICAgICAgdGhpcy5tb3ZlRGlyID0gJ2hvcml6b250YWwnXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubW92ZURpciA9ICd2ZXJ0aWNhbCdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfaGFuZGxlUG9pbnRlck1vdmUgKGV2dCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMucG9pbnRlck1vdmVkID0gdHJ1ZVxyXG4gICAgICAgIGlmICghdGhpcy5oYXNJbWFnZSgpKSByZXR1cm5cclxuICAgICAgICBsZXQgY29vcmQgPSB1LmdldFBvaW50ZXJDb29yZHMoZXZ0LCB0aGlzKVxyXG4gICAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IGNvb3JkXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkIHx8IHRoaXMuZGlzYWJsZURyYWdUb01vdmUpIHJldHVyblxyXG5cclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgIGlmICghZXZ0LnRvdWNoZXMgfHwgZXZ0LnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dpbmcpIHJldHVyblxyXG4gICAgICAgICAgaWYgKHRoaXMubGFzdE1vdmluZ0Nvb3JkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZSh7XHJcbiAgICAgICAgICAgICAgeDogY29vcmQueCAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLngsXHJcbiAgICAgICAgICAgICAgeTogY29vcmQueSAtIHRoaXMubGFzdE1vdmluZ0Nvb3JkLnlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMubGFzdE1vdmluZ0Nvb3JkID0gY29vcmRcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldnQudG91Y2hlcyAmJiBldnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZGlzYWJsZVBpbmNoVG9ab29tKSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMucGluY2hpbmcpIHJldHVyblxyXG4gICAgICAgICAgbGV0IGRpc3RhbmNlID0gdS5nZXRQaW5jaERpc3RhbmNlKGV2dCwgdGhpcylcclxuICAgICAgICAgIGxldCBkZWx0YSA9IGRpc3RhbmNlIC0gdGhpcy5waW5jaERpc3RhbmNlXHJcbiAgICAgICAgICB0aGlzLnpvb20oZGVsdGEgPiAwLCBQSU5DSF9BQ0NFTEVSQVRJT04pXHJcbiAgICAgICAgICB0aGlzLnBpbmNoRGlzdGFuY2UgPSBkaXN0YW5jZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVQb2ludGVyTGVhdmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhc3NpdmUpIHJldHVyblxyXG4gICAgICAgIHRoaXMuY3VycmVudFBvaW50ZXJDb29yZCA9IG51bGxcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVXaGVlbCAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlU2Nyb2xsVG9ab29tIHx8ICF0aGlzLmhhc0ltYWdlKCkpIHJldHVyblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgdGhpcy5zY3JvbGxpbmcgPSB0cnVlXHJcbiAgICAgICAgaWYgKGV2dC53aGVlbERlbHRhIDwgMCB8fCBldnQuZGVsdGFZID4gMCB8fCBldnQuZGV0YWlsID4gMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKHRoaXMucmV2ZXJzZVNjcm9sbFRvWm9vbSlcclxuICAgICAgICB9IGVsc2UgaWYgKGV2dC53aGVlbERlbHRhID4gMCB8fCBldnQuZGVsdGFZIDwgMCB8fCBldnQuZGV0YWlsIDwgMCkge1xyXG4gICAgICAgICAgdGhpcy56b29tKCF0aGlzLnJldmVyc2VTY3JvbGxUb1pvb20pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMuc2Nyb2xsaW5nID0gZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZURyYWdFbnRlciAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5kaXNhYmxlRHJhZ0FuZERyb3AgfHwgIXUuZXZlbnRIYXNGaWxlKGV2dCkpIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmhhc0ltYWdlKCkgJiYgIXRoaXMucmVwbGFjZURyb3ApIHJldHVyblxyXG4gICAgICAgIHRoaXMuZmlsZURyYWdnZWRPdmVyID0gdHJ1ZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZURyYWdMZWF2ZSAoZXZ0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFzc2l2ZSkgcmV0dXJuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZpbGVEcmFnZ2VkT3ZlciB8fCAhdS5ldmVudEhhc0ZpbGUoZXZ0KSkgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX2hhbmRsZURyYWdPdmVyIChldnQpIHtcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9oYW5kbGVEcm9wIChldnQpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXNzaXZlKSByZXR1cm5cclxuICAgICAgICBpZiAoIXRoaXMuZmlsZURyYWdnZWRPdmVyIHx8ICF1LmV2ZW50SGFzRmlsZShldnQpKSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5oYXNJbWFnZSgpICYmIHRoaXMucmVwbGFjZURyb3ApIHtcclxuICAgICAgICAgIHRoaXMucmVtb3ZlKClcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5maWxlRHJhZ2dlZE92ZXIgPSBmYWxzZVxyXG5cclxuICAgICAgICBsZXQgZmlsZVxyXG4gICAgICAgIGxldCBkdCA9IGV2dC5kYXRhVHJhbnNmZXJcclxuICAgICAgICBpZiAoIWR0KSByZXR1cm5cclxuICAgICAgICBpZiAoZHQuaXRlbXMpIHtcclxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBkdC5pdGVtcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgaXRlbSA9IGR0Lml0ZW1zW2ldXHJcbiAgICAgICAgICAgIGlmIChpdGVtLmtpbmQgPT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgICAgICAgZmlsZSA9IGl0ZW0uZ2V0QXNGaWxlKClcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZpbGUgPSBkdC5maWxlc1swXVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgIHRoaXMuX29uTmV3RmlsZUluKGZpbGUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmltZ0RhdGEuc3RhcnRYID4gMCkge1xyXG4gICAgICAgICAgdGhpcy5pbWdEYXRhLnN0YXJ0WCA9IDBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRGF0YS5zdGFydFkgPiAwKSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gMFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5vdXRwdXRXaWR0aCAtIHRoaXMuaW1nRGF0YS5zdGFydFggPiB0aGlzLmltZ0RhdGEud2lkdGgpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSAtKHRoaXMuaW1nRGF0YS53aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm91dHB1dEhlaWdodCAtIHRoaXMuaW1nRGF0YS5zdGFydFkgPiB0aGlzLmltZ0RhdGEuaGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLmltZ0RhdGEuc3RhcnRZID0gLSh0aGlzLmltZ0RhdGEuaGVpZ2h0IC0gdGhpcy5vdXRwdXRIZWlnaHQpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLndpZHRoIDwgdGhpcy5vdXRwdXRXaWR0aCkge1xyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gdGhpcy5vdXRwdXRXaWR0aCAvIHRoaXMubmF0dXJhbFdpZHRoXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pbWdEYXRhLmhlaWdodCA8IHRoaXMub3V0cHV0SGVpZ2h0KSB7XHJcbiAgICAgICAgICB0aGlzLnNjYWxlUmF0aW8gPSB0aGlzLm91dHB1dEhlaWdodCAvIHRoaXMubmF0dXJhbEhlaWdodFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9zZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb24gPSA2LCBhcHBseU1ldGFkYXRhKSB7XHJcbiAgICAgICAgdmFyIHVzZU9yaWdpbmFsID0gYXBwbHlNZXRhZGF0YVxyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiA+IDEgfHwgdXNlT3JpZ2luYWwpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5pbWcpIHJldHVyblxyXG4gICAgICAgICAgdGhpcy5yb3RhdGluZyA9IHRydWVcclxuICAgICAgICAgIHZhciBfaW1nID0gdS5nZXRSb3RhdGVkSW1hZ2UodXNlT3JpZ2luYWwgPyB0aGlzLm9yaWdpbmFsSW1hZ2UgOiB0aGlzLmltZywgb3JpZW50YXRpb24pXHJcbiAgICAgICAgICBfaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5pbWcgPSBfaW1nXHJcbiAgICAgICAgICAgIHRoaXMuX3BsYWNlSW1hZ2UoYXBwbHlNZXRhZGF0YSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5fcGxhY2VJbWFnZShhcHBseU1ldGFkYXRhKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09IDIpIHtcclxuICAgICAgICAgIC8vIGZsaXAgeFxyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFgodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDQpIHtcclxuICAgICAgICAgIC8vIGZsaXAgeVxyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUuZmxpcFkodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDYpIHtcclxuICAgICAgICAgIC8vIDkwIGRlZ1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09IDMpIHtcclxuICAgICAgICAgIC8vIDE4MCBkZWdcclxuICAgICAgICAgIHRoaXMub3JpZW50YXRpb24gPSB1LnJvdGF0ZTkwKHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbikpXHJcbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PSA4KSB7XHJcbiAgICAgICAgICAvLyAyNzAgZGVnXHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gdS5yb3RhdGU5MCh1LnJvdGF0ZTkwKHUucm90YXRlOTAodGhpcy5vcmllbnRhdGlvbikpKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb25cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1c2VPcmlnaW5hbCkge1xyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgX3BhaW50QmFja2dyb3VuZCAoKSB7XHJcbiAgICAgICAgbGV0IGJhY2tncm91bmRDb2xvciA9ICghdGhpcy5jYW52YXNDb2xvciB8fCB0aGlzLmNhbnZhc0NvbG9yID09ICdkZWZhdWx0JykgPyAndHJhbnNwYXJlbnQnIDogdGhpcy5jYW52YXNDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGJhY2tncm91bmRDb2xvclxyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9kcmF3ICgpIHtcclxuICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuaW1nKSByZXR1cm5cclxuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLl9kcmF3RnJhbWUpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kcmF3RnJhbWUoKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfZHJhd0ZyYW1lICgpIHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZVxyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eFxyXG4gICAgICAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuXHJcbiAgICAgICAgdGhpcy5fcGFpbnRCYWNrZ3JvdW5kKClcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodClcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJldmVudFdoaXRlU3BhY2UpIHtcclxuICAgICAgICAgIHRoaXMuX2NsaXAodGhpcy5fY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgpXHJcbiAgICAgICAgICAvLyB0aGlzLl9jbGlwKHRoaXMuX2NyZWF0ZUltYWdlQ2xpcFBhdGgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRlbWl0KGV2ZW50cy5EUkFXLCBjdHgpXHJcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlU2V0KSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlU2V0ID0gdHJ1ZVxyXG4gICAgICAgICAgdGhpcy4kZW1pdChldmVudHMuTkVXX0lNQUdFX0RSQVdOKVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvdGF0aW5nID0gZmFsc2VcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9jbGlwUGF0aEZhY3RvcnkgKHgsIHksIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBsZXQgcmFkaXVzID0gdHlwZW9mIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgPT09ICdudW1iZXInID9cclxuICAgICAgICAgIHRoaXMuaW1hZ2VCb3JkZXJSYWRpdXMgOlxyXG4gICAgICAgICAgIWlzTmFOKE51bWJlcih0aGlzLmltYWdlQm9yZGVyUmFkaXVzKSkgPyBOdW1iZXIodGhpcy5pbWFnZUJvcmRlclJhZGl1cykgOiAwXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeCArIHJhZGl1cywgeSk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSByYWRpdXMsIHkpO1xyXG4gICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgcmFkaXVzKTtcclxuICAgICAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0LCB4ICsgd2lkdGggLSByYWRpdXMsIHkgKyBoZWlnaHQpO1xyXG4gICAgICAgIGN0eC5saW5lVG8oeCArIHJhZGl1cywgeSArIGhlaWdodCk7XHJcbiAgICAgICAgY3R4LnF1YWRyYXRpY0N1cnZlVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIHJhZGl1cyk7XHJcbiAgICAgICAgY3R4LmxpbmVUbyh4LCB5ICsgcmFkaXVzKTtcclxuICAgICAgICBjdHgucXVhZHJhdGljQ3VydmVUbyh4LCB5LCB4ICsgcmFkaXVzLCB5KTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGggKCkge1xyXG4gICAgICAgIHRoaXMuX2NsaXBQYXRoRmFjdG9yeSgwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICBpZiAodGhpcy5jbGlwUGx1Z2lucyAmJiB0aGlzLmNsaXBQbHVnaW5zLmxlbmd0aCkge1xyXG4gICAgICAgICAgdGhpcy5jbGlwUGx1Z2lucy5mb3JFYWNoKGZ1bmMgPT4ge1xyXG4gICAgICAgICAgICBmdW5jKHRoaXMuY3R4LCAwLCAwLCB0aGlzLm91dHB1dFdpZHRoLCB0aGlzLm91dHB1dEhlaWdodClcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gX2NyZWF0ZUltYWdlQ2xpcFBhdGggKCkge1xyXG4gICAgICAvLyAgIGxldCB7IHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmltZ0RhdGFcclxuICAgICAgLy8gICBsZXQgdyA9IHdpZHRoXHJcbiAgICAgIC8vICAgbGV0IGggPSBoZWlnaHRcclxuICAgICAgLy8gICBsZXQgeCA9IHN0YXJ0WFxyXG4gICAgICAvLyAgIGxldCB5ID0gc3RhcnRZXHJcbiAgICAgIC8vICAgaWYgKHcgPCBoKSB7XHJcbiAgICAgIC8vICAgICBoID0gdGhpcy5vdXRwdXRIZWlnaHQgKiAod2lkdGggLyB0aGlzLm91dHB1dFdpZHRoKVxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gICBpZiAoaCA8IHcpIHtcclxuICAgICAgLy8gICAgIHcgPSB0aGlzLm91dHB1dFdpZHRoICogKGhlaWdodCAvIHRoaXMub3V0cHV0SGVpZ2h0KVxyXG4gICAgICAvLyAgICAgeCA9IHN0YXJ0WCArICh3aWR0aCAtIHRoaXMub3V0cHV0V2lkdGgpIC8gMlxyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gICB0aGlzLl9jbGlwUGF0aEZhY3RvcnkoeCwgc3RhcnRZLCB3LCBoKVxyXG4gICAgICAvLyB9LFxyXG5cclxuICAgICAgX2NsaXAgKGNyZWF0ZVBhdGgpIHtcclxuICAgICAgICBsZXQgY3R4ID0gdGhpcy5jdHhcclxuICAgICAgICBjdHguc2F2ZSgpXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmZmJ1xyXG4gICAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnZGVzdGluYXRpb24taW4nXHJcbiAgICAgICAgY3JlYXRlUGF0aCgpXHJcbiAgICAgICAgY3R4LmZpbGwoKVxyXG4gICAgICAgIGN0eC5yZXN0b3JlKClcclxuICAgICAgfSxcclxuXHJcbiAgICAgIF9hcHBseU1ldGFkYXRhICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMudXNlck1ldGFkYXRhKSByZXR1cm5cclxuICAgICAgICB2YXIgeyBzdGFydFgsIHN0YXJ0WSwgc2NhbGUgfSA9IHRoaXMudXNlck1ldGFkYXRhXHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WCkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFggPSBzdGFydFhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHN0YXJ0WSkpIHtcclxuICAgICAgICAgIHRoaXMuaW1nRGF0YS5zdGFydFkgPSBzdGFydFlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1Lm51bWJlclZhbGlkKHNjYWxlKSkge1xyXG4gICAgICAgICAgdGhpcy5zY2FsZVJhdGlvID0gc2NhbGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJG5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgIHRoaXMudXNlck1ldGFkYXRhID0gbnVsbFxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICBvbkRpbWVuc2lvbkNoYW5nZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmltZykge1xyXG4gICAgICAgICAgdGhpcy5faW5pdGlhbGl6ZSgpXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGlzLnByZXZlbnRXaGl0ZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5fc2V0U2l6ZSgpXHJcbiAgICAgICAgICB0aGlzLl9wbGFjZUltYWdlKClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlIGxhbmc9XCJzdHlsdXNcIj5cclxuICAuY3JvcHBhLWNvbnRhaW5lclxyXG4gICAgZGlzcGxheSBpbmxpbmUtYmxvY2tcclxuICAgIGN1cnNvciBwb2ludGVyXHJcbiAgICB0cmFuc2l0aW9uIGFsbCAwLjNzXHJcbiAgICBwb3NpdGlvbiByZWxhdGl2ZVxyXG4gICAgZm9udC1zaXplIDBcclxuICAgIGFsaWduLXNlbGYgZmxleC1zdGFydFxyXG4gICAgYmFja2dyb3VuZC1jb2xvciAjZTZlNmU2XHJcblxyXG4gICAgY2FudmFzXHJcbiAgICAgIHRyYW5zaXRpb24gYWxsIDAuM3NcclxuXHJcbiAgICAmOmhvdmVyXHJcbiAgICAgIG9wYWNpdHkgMC43XHJcblxyXG4gICAgJi5jcm9wcGEtLWRyb3B6b25lXHJcbiAgICAgIGJveC1zaGFkb3cgaW5zZXQgMCAwIDEwcHggbGlnaHRuZXNzKGJsYWNrLCAyMCUpXHJcblxyXG4gICAgICBjYW52YXNcclxuICAgICAgICBvcGFjaXR5IDAuNVxyXG5cclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZC1jY1xyXG4gICAgICBjdXJzb3IgZGVmYXVsdFxyXG5cclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAgICYuY3JvcHBhLS1oYXMtdGFyZ2V0XHJcbiAgICAgIGN1cnNvciBtb3ZlXHJcblxyXG4gICAgICAmOmhvdmVyXHJcbiAgICAgICAgb3BhY2l0eSAxXHJcblxyXG4gICAgICAmLmNyb3BwYS0tZGlzYWJsZWQtbXpcclxuICAgICAgICBjdXJzb3IgZGVmYXVsdFxyXG5cclxuICAgICYuY3JvcHBhLS1kaXNhYmxlZFxyXG4gICAgICBjdXJzb3Igbm90LWFsbG93ZWRcclxuXHJcbiAgICAgICY6aG92ZXJcclxuICAgICAgICBvcGFjaXR5IDFcclxuXHJcbiAgICAmLmNyb3BwYS0tcGFzc2l2ZVxyXG4gICAgICBjdXJzb3IgZGVmYXVsdFxyXG5cclxuICAgICAgJjpob3ZlclxyXG4gICAgICAgIG9wYWNpdHkgMVxyXG5cclxuICAgIHN2Zy5pY29uLXJlbW92ZVxyXG4gICAgICBwb3NpdGlvbiBhYnNvbHV0ZVxyXG4gICAgICBiYWNrZ3JvdW5kIHdoaXRlXHJcbiAgICAgIGJvcmRlci1yYWRpdXMgNTAlXHJcbiAgICAgIGZpbHRlciBkcm9wLXNoYWRvdygtMnB4IDJweCAycHggcmdiYSgwLCAwLCAwLCAwLjcpKVxyXG4gICAgICB6LWluZGV4IDEwXHJcbiAgICAgIGN1cnNvciBwb2ludGVyXHJcbiAgICAgIGJvcmRlciAycHggc29saWQgd2hpdGVcclxuPC9zdHlsZT5cclxuXHJcbjxzdHlsZSBsYW5nPVwic2Nzc1wiPlxyXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90b2JpYXNhaGxpbi9TcGluS2l0L2Jsb2IvbWFzdGVyL3Njc3Mvc3Bpbm5lcnMvMTAtZmFkaW5nLWNpcmNsZS5zY3NzXHJcbiAgLnNrLWZhZGluZy1jaXJjbGUge1xyXG4gICAgJGNpcmNsZUNvdW50OiAxMjtcclxuICAgICRhbmltYXRpb25EdXJhdGlvbjogMXM7XHJcblxyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG5cclxuICAgIC5zay1jaXJjbGUge1xyXG4gICAgICB3aWR0aDogMTAwJTtcclxuICAgICAgaGVpZ2h0OiAxMDAlO1xyXG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgIGxlZnQ6IDA7XHJcbiAgICAgIHRvcDogMDtcclxuICAgIH1cclxuXHJcbiAgICAuc2stY2lyY2xlIC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcclxuICAgICAgZGlzcGxheTogYmxvY2s7XHJcbiAgICAgIG1hcmdpbjogMCBhdXRvO1xyXG4gICAgICB3aWR0aDogMTUlO1xyXG4gICAgICBoZWlnaHQ6IDE1JTtcclxuICAgICAgYm9yZGVyLXJhZGl1czogMTAwJTtcclxuICAgICAgYW5pbWF0aW9uOiBzay1jaXJjbGVGYWRlRGVsYXkgJGFuaW1hdGlvbkR1cmF0aW9uIGluZmluaXRlIGVhc2UtaW4tb3V0IGJvdGg7XHJcbiAgICB9XHJcblxyXG4gICAgQGZvciAkaSBmcm9tIDIgdGhyb3VnaCAkY2lyY2xlQ291bnQge1xyXG4gICAgICAuc2stY2lyY2xlI3skaX0ge1xyXG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyAvICRjaXJjbGVDb3VudCAqICgkaSAtIDEpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEBmb3IgJGkgZnJvbSAyIHRocm91Z2ggJGNpcmNsZUNvdW50IHtcclxuICAgICAgLnNrLWNpcmNsZSN7JGl9IC5zay1jaXJjbGUtaW5kaWNhdG9yIHtcclxuICAgICAgICBhbmltYXRpb24tZGVsYXk6IC0gJGFuaW1hdGlvbkR1cmF0aW9uICsgJGFuaW1hdGlvbkR1cmF0aW9uIC8gJGNpcmNsZUNvdW50ICpcclxuICAgICAgICAgIChcclxuICAgICAgICAgICAgJGkgLSAxXHJcbiAgICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIEBrZXlmcmFtZXMgc2stY2lyY2xlRmFkZURlbGF5IHtcclxuICAgIDAlLFxyXG4gICAgMzklLFxyXG4gICAgMTAwJSB7XHJcbiAgICAgIG9wYWNpdHk6IDA7XHJcbiAgICB9XHJcbiAgICA0MCUge1xyXG4gICAgICBvcGFjaXR5OiAxO1xyXG4gICAgfVxyXG4gIH1cclxuPC9zdHlsZT5cclxuXHJcbiIsIi8qXG5vYmplY3QtYXNzaWduXG4oYykgU2luZHJlIFNvcmh1c1xuQGxpY2Vuc2UgTUlUXG4qL1xuXG4ndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xudmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ldy13cmFwcGVyc1xuXHRcdHRlc3QxWzVdID0gJ2RlJztcblx0XHRpZiAoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGVzdDEpWzBdID09PSAnNScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QyID0ge307XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG5cdFx0XHR0ZXN0MlsnXycgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGkpXSA9IGk7XG5cdFx0fVxuXHRcdHZhciBvcmRlcjIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MikubWFwKGZ1bmN0aW9uIChuKSB7XG5cdFx0XHRyZXR1cm4gdGVzdDJbbl07XG5cdFx0fSk7XG5cdFx0aWYgKG9yZGVyMi5qb2luKCcnKSAhPT0gJzAxMjM0NTY3ODknKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzA1NlxuXHRcdHZhciB0ZXN0MyA9IHt9O1xuXHRcdCdhYmNkZWZnaGlqa2xtbm9wcXJzdCcuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGxldHRlcikge1xuXHRcdFx0dGVzdDNbbGV0dGVyXSA9IGxldHRlcjtcblx0XHR9KTtcblx0XHRpZiAoT2JqZWN0LmtleXMoT2JqZWN0LmFzc2lnbih7fSwgdGVzdDMpKS5qb2luKCcnKSAhPT1cblx0XHRcdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlcnIpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcblx0XHRcdHN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoZnJvbSk7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN5bWJvbHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYgKHByb3BJc0VudW1lcmFibGUuY2FsbChmcm9tLCBzeW1ib2xzW2ldKSkge1xuXHRcdFx0XHRcdHRvW3N5bWJvbHNbaV1dID0gZnJvbVtzeW1ib2xzW2ldXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0bztcbn07XG4iLCJpbXBvcnQgY29tcG9uZW50IGZyb20gJy4vY3JvcHBlci52dWUnXHJcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcclxuXHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIGNvbXBvbmVudE5hbWU6ICdjcm9wcGEnXHJcbn1cclxuXHJcbmNvbnN0IFZ1ZUNyb3BwYSA9IHtcclxuICBpbnN0YWxsOiBmdW5jdGlvbiAoVnVlLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zID0gYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcclxuICAgIGxldCB2ZXJzaW9uID0gTnVtYmVyKFZ1ZS52ZXJzaW9uLnNwbGl0KCcuJylbMF0pXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGB2dWUtY3JvcHBhIHN1cHBvcnRzIHZ1ZSB2ZXJzaW9uIDIuMCBhbmQgYWJvdmUuIFlvdSBhcmUgdXNpbmcgVnVlQCR7dmVyc2lvbn0uIFBsZWFzZSB1cGdyYWRlIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBWdWUuYClcclxuICAgIH1cclxuICAgIGxldCBjb21wb25lbnROYW1lID0gb3B0aW9ucy5jb21wb25lbnROYW1lIHx8ICdjcm9wcGEnXHJcblxyXG4gICAgLy8gcmVnaXN0cmF0aW9uXHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudClcclxuICB9LFxyXG5cclxuICBjb21wb25lbnRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBWdWVDcm9wcGEiXSwibmFtZXMiOlsiZGVmaW5lIiwidGhpcyIsInBvaW50Iiwidm0iLCJjYW52YXMiLCJxdWFsaXR5IiwicmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNsaWVudFgiLCJjbGllbnRZIiwibGVmdCIsInRvcCIsImV2dCIsInBvaW50ZXIiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJvbmVQb2ludENvb3JkIiwicG9pbnRlcjEiLCJwb2ludGVyMiIsImNvb3JkMSIsImNvb3JkMiIsIk1hdGgiLCJzcXJ0IiwicG93IiwieCIsInkiLCJpbWciLCJjb21wbGV0ZSIsIm5hdHVyYWxXaWR0aCIsImRvY3VtZW50Iiwid2luZG93IiwibGFzdFRpbWUiLCJ2ZW5kb3JzIiwibGVuZ3RoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsImN1cnJUaW1lIiwiRGF0ZSIsImdldFRpbWUiLCJ0aW1lVG9DYWxsIiwibWF4IiwiaWQiLCJzZXRUaW1lb3V0IiwiYXJnIiwiaXNBcnJheSIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsIkhUTUxDYW52YXNFbGVtZW50IiwiYmluU3RyIiwibGVuIiwiYXJyIiwidG9CbG9iIiwiZGVmaW5lUHJvcGVydHkiLCJ0eXBlIiwiYXRvYiIsInRvRGF0YVVSTCIsInNwbGl0IiwiVWludDhBcnJheSIsImkiLCJjaGFyQ29kZUF0IiwiQmxvYiIsImR0IiwiZGF0YVRyYW5zZmVyIiwib3JpZ2luYWxFdmVudCIsInR5cGVzIiwiYXJyYXlCdWZmZXIiLCJ2aWV3IiwiRGF0YVZpZXciLCJnZXRVaW50MTYiLCJieXRlTGVuZ3RoIiwib2Zmc2V0IiwibWFya2VyIiwiZ2V0VWludDMyIiwibGl0dGxlIiwidGFncyIsImJhc2U2NCIsInJlcGxhY2UiLCJiaW5hcnlTdHJpbmciLCJieXRlcyIsImJ1ZmZlciIsIm9yaWVudGF0aW9uIiwiX2NhbnZhcyIsIkNhbnZhc0V4aWZPcmllbnRhdGlvbiIsImRyYXdJbWFnZSIsIl9pbWciLCJJbWFnZSIsInNyYyIsIm9yaSIsIm1hcCIsIm4iLCJpc05hTiIsIk51bWJlciIsImlzSW50ZWdlciIsInZhbHVlIiwiaXNGaW5pdGUiLCJmbG9vciIsImluaXRpYWxJbWFnZVR5cGUiLCJTdHJpbmciLCJ2YWwiLCJCb29sZWFuIiwidmFsaWRzIiwiZXZlcnkiLCJpbmRleE9mIiwid29yZCIsInRlc3QiLCJQQ1RfUEVSX1pPT00iLCJNSU5fTVNfUEVSX0NMSUNLIiwiQ0xJQ0tfTU9WRV9USFJFU0hPTEQiLCJNSU5fV0lEVEgiLCJERUZBVUxUX1BMQUNFSE9MREVSX1RBS0VVUCIsIlBJTkNIX0FDQ0VMRVJBVElPTiIsInN5bmNEYXRhIiwicmVuZGVyIiwiZXZlbnRzIiwiSU5JVF9FVkVOVCIsInByb3BzIiwid2lkdGgiLCJoZWlnaHQiLCJwbGFjZWhvbGRlckZvbnRTaXplIiwibmF0dXJhbEhlaWdodCIsImxvYWRpbmdTaXplIiwiX2luaXRpYWxpemUiLCJyQUZQb2x5ZmlsbCIsInRvQmxvYlBvbHlmaWxsIiwic3VwcG9ydHMiLCJzdXBwb3J0RGV0ZWN0aW9uIiwiYmFzaWMiLCJ3YXJuIiwicGFzc2l2ZSIsIiR3YXRjaCIsImRhdGEiLCJzZXQiLCJrZXkiLCIkc2V0IiwicmVtb3ZlIiwiJG5leHRUaWNrIiwiX2RyYXciLCJvbGRPdXRwdXRIZWlnaHQiLCJvdXRwdXRIZWlnaHQiLCJvbGRPdXRwdXRXaWR0aCIsIm91dHB1dFdpZHRoIiwib25EaW1lbnNpb25DaGFuZ2UiLCJfc2V0UGxhY2Vob2xkZXJzIiwiaW1hZ2VTZXQiLCJfcGxhY2VJbWFnZSIsIm9sZFZhbCIsInUiLCJudW1iZXJWYWxpZCIsInBvcyIsImN1cnJlbnRQb2ludGVyQ29vcmQiLCJpbWdEYXRhIiwic3RhcnRYIiwic3RhcnRZIiwidXNlck1ldGFkYXRhIiwicm90YXRpbmciLCJvZmZzZXRYIiwib2Zmc2V0WSIsInByZXZlbnRXaGl0ZVNwYWNlIiwiX3ByZXZlbnRab29taW5nVG9XaGl0ZVNwYWNlIiwiX3ByZXZlbnRNb3ZpbmdUb1doaXRlU3BhY2UiLCJzY2FsZVJhdGlvIiwiaGFzSW1hZ2UiLCJhYnMiLCIkZW1pdCIsIlpPT01fRVZFTlQiLCJMT0FESU5HX1NUQVJUIiwiTE9BRElOR19FTkQiLCJjdHgiLCJmaWxlIiwiJHJlZnMiLCJmaWxlSW5wdXQiLCJmaWxlcyIsIm9yaWdpbmFsSW1hZ2UiLCJvbGRYIiwib2xkWSIsImNob3NlblgiLCJjaG9zZW5ZIiwiTU9WRV9FVkVOVCIsImFtb3VudCIsIm1vdmUiLCJ6b29tSW4iLCJhY2NlbGVyYXRpb24iLCJyZWFsU3BlZWQiLCJ6b29tU3BlZWQiLCJzcGVlZCIsInpvb20iLCJzdGVwIiwiZGlzYWJsZVJvdGF0aW9uIiwiZGlzYWJsZWQiLCJwYXJzZUludCIsIl9yb3RhdGVCeVN0ZXAiLCJfc2V0T3JpZW50YXRpb24iLCJtZXRhZGF0YSIsImNvbXByZXNzaW9uUmF0ZSIsIm1pbWVUeXBlIiwicXVhbGl0eUFyZ3VtZW50IiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2VuZXJhdGVCbG9iIiwiYmxvYiIsImVyciIsImNhbnZhc0hlaWdodCIsInN0eWxlIiwic3Vic3RyIiwiY2FudmFzV2lkdGgiLCJkaXYiLCJjcmVhdGVFbGVtZW50IiwiRmlsZSIsIkZpbGVSZWFkZXIiLCJGaWxlTGlzdCIsImNsaWNrIiwiaGFkSW1hZ2UiLCJsb2FkaW5nIiwiSU1BR0VfUkVNT1ZFX0VWRU5UIiwicGx1Z2luIiwiY2xpcFBsdWdpbnMiLCJwdXNoIiwiRXJyb3IiLCJfc2V0U2l6ZSIsImJhY2tncm91bmRDb2xvciIsImNhbnZhc0NvbG9yIiwiZ2V0Q29udGV4dCIsIl9zZXRJbml0aWFsIiwiJHNsb3RzIiwicGxhY2Vob2xkZXIiLCJ2Tm9kZSIsInRhZyIsImVsbSIsIm9uTG9hZCIsImltYWdlTG9hZGVkIiwib25sb2FkIiwidGV4dEJhc2VsaW5lIiwidGV4dEFsaWduIiwiZGVmYXVsdEZvbnRTaXplIiwiZm9udFNpemUiLCJjb21wdXRlZFBsYWNlaG9sZGVyRm9udFNpemUiLCJmb250IiwiZmlsbFN0eWxlIiwicGxhY2Vob2xkZXJDb2xvciIsImZpbGxUZXh0IiwiX3BhaW50QmFja2dyb3VuZCIsIl9zZXRJbWFnZVBsYWNlaG9sZGVyIiwiX3NldFRleHRQbGFjZWhvbGRlciIsImluaXRpYWwiLCJpbml0aWFsSW1hZ2UiLCJzZXRBdHRyaWJ1dGUiLCJiYWJlbEhlbHBlcnMudHlwZW9mIiwiY3VycmVudElzSW5pdGlhbCIsIl9vbmxvYWQiLCJkYXRhc2V0Iiwib25lcnJvciIsIklOSVRJQUxfSU1BR0VfTE9BREVEX0VWRU5UIiwiZGlzYWJsZUNsaWNrVG9DaG9vc2UiLCJzdXBwb3J0VG91Y2giLCJjaG9vc2VGaWxlIiwiaW5wdXQiLCJfb25OZXdGaWxlSW4iLCJGSUxFX0NIT09TRV9FVkVOVCIsIl9maWxlU2l6ZUlzVmFsaWQiLCJGSUxFX1NJWkVfRVhDRUVEX0VWRU5UIiwiZmlsZVNpemVMaW1pdCIsIl9maWxlVHlwZUlzVmFsaWQiLCJGSUxFX1RZUEVfTUlTTUFUQ0hfRVZFTlQiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJwb3AiLCJhY2NlcHQiLCJmciIsImUiLCJmaWxlRGF0YSIsInRhcmdldCIsInJlc3VsdCIsImdldEZpbGVPcmllbnRhdGlvbiIsImJhc2U2NFRvQXJyYXlCdWZmZXIiLCJORVdfSU1BR0UiLCJyZWFkQXNEYXRhVVJMIiwic2l6ZSIsImJhc2VNaW1ldHlwZSIsInQiLCJ0cmltIiwiY2hhckF0Iiwic2xpY2UiLCJmaWxlQmFzZVR5cGUiLCJhcHBseU1ldGFkYXRhIiwiX2FzcGVjdEZpbGwiLCJpbml0aWFsU2l6ZSIsIl9hc3BlY3RGaXQiLCJfbmF0dXJhbFNpemUiLCJpbml0aWFsUG9zaXRpb24iLCJleGVjIiwiX2FwcGx5TWV0YWRhdGEiLCJpbWdXaWR0aCIsImltZ0hlaWdodCIsImNhbnZhc1JhdGlvIiwiYXNwZWN0UmF0aW8iLCJtb3ZlRGlyIiwicG9pbnRlck1vdmVkIiwicG9pbnRlckNvb3JkIiwiZ2V0UG9pbnRlckNvb3JkcyIsInBvaW50ZXJTdGFydENvb3JkIiwidGFiU3RhcnQiLCJ2YWx1ZU9mIiwid2hpY2giLCJkcmFnZ2luZyIsInBpbmNoaW5nIiwiY29vcmQiLCJsYXN0TW92aW5nQ29vcmQiLCJkaXNhYmxlUGluY2hUb1pvb20iLCJwaW5jaERpc3RhbmNlIiwiZ2V0UGluY2hEaXN0YW5jZSIsImNhbmNlbEV2ZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJfaGFuZGxlUG9pbnRlckVuZCIsInBvaW50ZXJNb3ZlRGlzdGFuY2UiLCJ0YWJFbmQiLCJkaXNhYmxlRHJhZ1RvTW92ZSIsInByZXZlbnREZWZhdWx0IiwiZGlzdGFuY2UiLCJkZWx0YSIsImRpc2FibGVTY3JvbGxUb1pvb20iLCJzY3JvbGxpbmciLCJ3aGVlbERlbHRhIiwiZGVsdGFZIiwiZGV0YWlsIiwicmV2ZXJzZVNjcm9sbFRvWm9vbSIsImRpc2FibGVEcmFnQW5kRHJvcCIsImV2ZW50SGFzRmlsZSIsInJlcGxhY2VEcm9wIiwiZmlsZURyYWdnZWRPdmVyIiwiaXRlbXMiLCJpdGVtIiwia2luZCIsImdldEFzRmlsZSIsInVzZU9yaWdpbmFsIiwiZ2V0Um90YXRlZEltYWdlIiwiZmxpcFgiLCJmbGlwWSIsInJvdGF0ZTkwIiwiY2xlYXJSZWN0IiwiZmlsbFJlY3QiLCJfZHJhd0ZyYW1lIiwiX2NsaXAiLCJfY3JlYXRlQ29udGFpbmVyQ2xpcFBhdGgiLCJEUkFXIiwiTkVXX0lNQUdFX0RSQVdOIiwicmFkaXVzIiwiaW1hZ2VCb3JkZXJSYWRpdXMiLCJiZWdpblBhdGgiLCJtb3ZlVG8iLCJsaW5lVG8iLCJxdWFkcmF0aWNDdXJ2ZVRvIiwiY2xvc2VQYXRoIiwiX2NsaXBQYXRoRmFjdG9yeSIsImZvckVhY2giLCJjcmVhdGVQYXRoIiwic2F2ZSIsImdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiIsImZpbGwiLCJyZXN0b3JlIiwic2NhbGUiLCJkZWZhdWx0T3B0aW9ucyIsIlZ1ZUNyb3BwYSIsIlZ1ZSIsIm9wdGlvbnMiLCJhc3NpZ24iLCJ2ZXJzaW9uIiwiY29tcG9uZW50TmFtZSIsImNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLENBQUMsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3RCLElBQUksT0FBT0EsU0FBTSxLQUFLLFVBQVUsSUFBSUEsU0FBTSxDQUFDLEdBQUcsRUFBRTtRQUM1Q0EsU0FBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN2QixNQUFNLEFBQWlDO1FBQ3BDLGNBQWMsR0FBRyxPQUFPLEVBQUUsQ0FBQztLQUM5QixBQUVGO0NBQ0YsQ0FBQ0MsY0FBSSxFQUFFLFlBQVk7RUFDbEIsWUFBWSxDQUFDOztFQUViLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7SUFFakYsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQ3JDLElBQUksTUFBTSxJQUFJLElBQUksRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQzs7SUFFeEMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0s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
