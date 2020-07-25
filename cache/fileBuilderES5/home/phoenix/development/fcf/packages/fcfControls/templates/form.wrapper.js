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
  name: "fcfControls:templates/form.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js"],
  module: function module(Wrapper) {
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(WrapperEx, _Wrapper);

      var _super = _createSuper(WrapperEx);

      function WrapperEx(a_initializeOptions) {
        _classCallCheck(this, WrapperEx);

        return _super.call(this, a_initializeOptions);
      }

      _createClass(WrapperEx, [{
        key: "onArg",
        value: function onArg(a_argName, a_value, a_suffix) {// this.update();
        }
      }, {
        key: "getValidateErrorString",
        value: function getValidateErrorString(a_errors) {
          if (fcf.empty(a_errors)) return "";
          var message = "<div><errorheader>" + fcf.t("Invalid form fields") + ":</errorheader></div>";
          fcf.each(a_errors, function (a_key, a_errorInfo) {
            var view = fcf.getWrapper(a_errorInfo.id).getArg("view");
            var title = view && view.title ? view.title : a_errorInfo.alias;
            message += "<div><erroritem>" + fcf.t("Field") + " '" + fcf.t(title) + "': " + a_errorInfo.error.message + "</erroritem></div>";
          });
          return message;
        }
      }, {
        key: "validate",
        value: function validate(a_showError) {
          var result = [];
          var childs = this.getChilds();
          var mode = this.getArg("mode");
          fcf.each(childs, function (k, child) {
            var view = child.getArg("view");
            if (!view) return;
            if (mode.indexOf("add") == 0 && view.notAdd) return;
            if (mode.indexOf("edit") == 0 && view.notEdit) return;
            fcf.append(result, child.validate(a_showError));
          });
          if (a_showError) this.update();
          return result;
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});