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
  name: "fcfManagement:templates/blocks/dialog.wrapper.js",
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

        var self = _assertThisInitialized(_this);

        _this._resizeCaller = function (a_event) {
          self.onResize(a_event);
        };

        return _this;
      }

      _createClass(WrapperEx, [{
        key: "onDestroy",
        value: function onDestroy() {
          window.removeEventListener('resize', this._resizeCaller);
        }
      }, {
        key: "onAttach",
        value: function onAttach() {
          window.removeEventListener('resize', this._resizeCaller);
          window.addEventListener('resize', this._resizeCaller);
          this.onResize();
        }
      }, {
        key: "onResize",
        value: function onResize() {
          var wpHeight = window.innerHeight;
          var wpWidth = window.innerWidth;
          var bodyMaxHeight = wpHeight * 0.9 - 130;
          this.getDomElement().style.width = wpWidth;
          this.getDomElement().style.height = wpHeight;
          this.getDomElement().style.display = "table";
          var deBody = this.select("[name=body]")[0];
          deBody.style.maxHeight = bodyMaxHeight + "px";
        }
      }, {
        key: "onArg",
        value: function onArg(a_argName, a_value, a_suffix) {
          this.update();
        }
      }, {
        key: "onButtonClick",
        value: function onButtonClick(a_button) {
          var event = this.emit("close", {
            button: a_button
          });
          if (!event.stopDefault) this.destroy();
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});