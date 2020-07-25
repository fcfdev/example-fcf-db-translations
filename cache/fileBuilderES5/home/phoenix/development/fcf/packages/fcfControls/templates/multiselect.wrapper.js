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
  name: "fcfControls:templates/multiselect.wrapper.js",
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
        key: "onSwitchElementAdd",
        value: function onSwitchElementAdd(event) {
          this.getChild("select").setEnableButton("add", event.value != "");
        }
      }, {
        key: "onArgValue",
        value: function onArgValue(a_value) {
          var data = {};
          var items = this.getArg("items");
          fcf.each(a_value, function (index, key) {
            data[key] = items[key];
          });
          this.setArg("data", data);
          this.emit("change", {
            value: a_value,
            data: data
          });
        }
      }, {
        key: "onArgData",
        value: function onArgData(a_data) {
          var value = [];
          fcf.each(a_data, function (index, key) {
            value.push(index);
          });
          this.setArg("value", value, true);
          this.emit("change", {
            value: value,
            data: a_data
          });
        }
      }, {
        key: "onArgEnable",
        value: function onArgEnable(a_data) {
          this.update();
        }
      }, {
        key: "onArgItems",
        value: function onArgItems(a_data) {
          this.update();
        }
      }, {
        key: "onArgSearch",
        value: function onArgSearch(a_data) {
          this.update();
        }
      }, {
        key: "onArgTitlePattern",
        value: function onArgTitlePattern(a_data) {
          this.update();
        }
      }, {
        key: "onRemoveItem",
        value: function onRemoveItem(a_event) {
          var value = this.getArg("value");
          fcf.removeByValue(value, a_event.target.getAttribute("value"));
          this.setArg("value", value);
        }
      }, {
        key: "onAdd",
        value: function onAdd(event) {
          var keyAdd = this.getChild("select").getArg("value");
          var dataAdd = this.getChild("select").getArg("data");
          var data = this.getArg("data");
          var value = this.getArg("value");
          if (fcf.find(data, function (k, v) {
            return fcf.equal(v, dataAdd);
          }) !== undefined) return;
          value.push(keyAdd);
          this.setArg("value", value);
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});