function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

fcf.module({
  name: "fcfControls:templates/select+menu.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js"],
  module: function module(Wrapper) {
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(WrapperEx, _Wrapper);

      var _super = _createSuper(WrapperEx);

      function WrapperEx(a_initializeOptions) {
        var _this;

        _classCallCheck(this, WrapperEx);

        _this = _super.call(this, a_initializeOptions);
        _this._cbClose = undefined;
        return _this;
      }

      _createClass(WrapperEx, [{
        key: "onAttach",
        value: function onAttach(a_event) {
          var self = this;
          if (this.getArg("display") != "none") document.addEventListener("click", function () {
            self.close();
          }, {
            once: true
          });
        }
      }, {
        key: "close",
        value: function close() {
          document.removeEventListener("click", this.close);
          this.setArg("display", "none");
        }
      }, {
        key: "onArgDisplay",
        value: function onArgDisplay(a_value) {
          if (a_value === "none") this.emit("close");
          this.update();
        }
      }, {
        key: "onItem",
        value: function onItem(a_event) {
          var value = a_event.target.getAttribute("value");
          this.emit("change", {
            value: value
          });
          this.close();
        }
      }, {
        key: "onKeyDown",
        value: function onKeyDown(a_event) {// a_event.preventDefault();
          // a_event.stopPropagation();
          // if (a_event.keyCode == 40)
          //   this.onDown();
          // else if (a_event.keyCode == 38) 
          //   this.onUp();
        }
      }, {
        key: "onUp",
        value: function onUp() {
          var activeElements = this.select("[name=item].active");
          fcf.each(activeElements, function (k, el) {
            el.classList.remove("active");
          });
          var el = fcf.first(activeElements).previousElementSibling;
          if (el) this._setActiveElement(el);else this._setActiveElement(fcf.first(this.select("[name=item]")));
        }
      }, {
        key: "onDown",
        value: function onDown() {
          var activeElements = this.select("[name=item].active");
          fcf.each(activeElements, function (k, el) {
            el.classList.remove("active");
          });

          if (fcf.empty(activeElements)) {
            var el = fcf.first(this.select("[name=item]"));
            if (el) el.classList.add("active");
          } else {
            var el = fcf.first(activeElements).nextElementSibling;
            if (el) this._setActiveElement(el);else this._setActiveElement(fcf.first(activeElements));
          }
        }
      }, {
        key: "_setActiveElement",
        value: function _setActiveElement(a_element) {
          if (!a_element) return;
          a_element.classList.add("active");
          var offset = a_element.getBoundingClientRect().top - this.getActionDomElement().getBoundingClientRect().top;
          this.getActionDomElement().scrollTo(0, offset);
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});