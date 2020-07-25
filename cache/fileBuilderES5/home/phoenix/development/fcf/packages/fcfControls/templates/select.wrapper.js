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
  name: "fcfControls:templates/select.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js"],
  module: function module(Wrapper) {
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(SelectWrapper, _Wrapper);

      var _super = _createSuper(SelectWrapper);

      function SelectWrapper(a_initializeOptions) {
        var _this;

        _classCallCheck(this, SelectWrapper);

        _this = _super.call(this, a_initializeOptions);
        _this._cbClose = undefined;
        return _this;
      }

      _createClass(SelectWrapper, [{
        key: "getActionDomElement",
        value: function getActionDomElement() {
          return fcf.select(this.getDomElement(), "input")[0];
        }
      }, {
        key: "getCurrentData",
        value: function getCurrentData() {
          var select = fcf.first(fcf.select(this.getDomElement(), "input"));
          var items = this.getArg("items");
          if (select.value === undefined) return;
          return items[select.value];
        }
      }, {
        key: "showMenu",
        value: function showMenu(a_items) {
          var menu = this.getChild("menu");
          menu.setArg("display", "block");
          menu.setArg("width", this.getWidthPx());
          menu.setArg("titlePattern", this.getArg("titlePattern"));
          menu.setArg("blank", a_items === undefined ? this.getArg("blank") : false);
          menu.setArg("items", a_items ? a_items : this.getArg("items"));
          menu.update();
        }
      }, {
        key: "hideMenu",
        value: function hideMenu() {
          this.getChild("menu").close();
        }
      }, {
        key: "getEnableButton",
        value: function getEnableButton(a_name, a_value) {
          var buttons = this.getArg("buttons");
          var button = buttons[fcf.find(buttons, function (k, v) {
            return v.name == name;
          })];
          if (!button) return;
          return !!button.enable;
        }
      }, {
        key: "setEnableButton",
        value: function setEnableButton(a_name, a_value) {
          var buttons = this.getArg("buttons");
          var button = buttons[fcf.find(buttons, function (k, v) {
            return v.name == a_name;
          })];
          if (!button) return;
          button.enable = a_value;
          this.setArg("buttons", buttons, true);
          var element = this.select("[name='" + button.name + "']")[0];
          if (!element) return;
          if (button.enable) element.removeAttribute("disabled");else element.setAttribute("disabled", "disabled");
        }
      }, {
        key: "onArgValue",
        value: function onArgValue(a_value) {
          var data = this.getArg("items")[a_value];
          this.getActionDomElement().classList.remove(this.getTheme().getDecor().selectSearchModeClass);
          this.getActionDomElement().value = fcf.pattern(this.getArg("titlePattern"), {
            value: a_value,
            data: data
          });
          this.emit("change", {
            value: a_value,
            data: data
          });
        }
      }, {
        key: "onArgData",
        value: function onArgData(a_value) {
          var data = a_value;
          this.getActionDomElement().classList.remove(this.getTheme().getDecor().selectSearchModeClass);
          this.getActionDomElement().value = fcf.pattern(this.getArg("titlePattern"), {
            value: this.getArg("value"),
            data: data
          });
          this.emit("change", {
            value: this.getArg("value"),
            data: a_value
          });
        }
      }, {
        key: "onArgEnable",
        value: function onArgEnable(a_value) {
          this.update();
        }
      }, {
        key: "onArgWidth",
        value: function onArgWidth(a_value) {
          this.update();
        }
      }, {
        key: "onArgSearch",
        value: function onArgSearch(a_value) {
          this.update();
        }
      }, {
        key: "onArgButtons",
        value: function onArgButtons(a_value) {
          this.update();
        }
      }, {
        key: "onArgTitlePattern",
        value: function onArgTitlePattern(a_value) {
          this.update();
        }
      }, {
        key: "onArgItems",
        value: function onArgItems(a_value) {
          this.update();
        }
      }, {
        key: "onInput",
        value: function onInput(a_event) {
          this.getActionDomElement().classList.add(this.getTheme().getDecor().selectSearchModeClass);
          var content = this.getActionDomElement().value.toLowerCase();
          var filtredItems = {};
          var patern = this.getArg("titlePattern");
          fcf.each(this.getArg("items"), function (value, data) {
            var title = fcf.pattern(patern, {
              value: value,
              data: data
            }).toLowerCase();
            if (title.indexOf(content) != -1) filtredItems[value] = data;
          });
          this.showMenu(filtredItems);
        }
      }, {
        key: "onButtonClick",
        value: function onButtonClick(a_event) {
          if (!this.getArg("enable")) return;
          var name = a_event.target.getAttribute("name");
          var buttons = this.getArg("buttons");
          var button = buttons[fcf.find(buttons, function (k, v) {
            return v.name == name;
          })];
          if (!button) return;
          if (button.enable !== undefined && !button.enable) return;
          this.emit("button", {
            button: button.name,
            target: a_event.target,
            sender: this
          });
        }
      }, {
        key: "onExtend",
        value: function onExtend(a_event) {
          if (!this.getArg("enable")) return;
          if (this.getChild("menu").getArg("display") == "none") this.showMenu();else this.hideMenu();
          this.getActionDomElement().focus();
        }
      }, {
        key: "onCloseMenu",
        value: function onCloseMenu() {
          var data = this.getArg("data");
          this.getActionDomElement().classList.remove(this.getTheme().getDecor().selectSearchModeClass);
          this.getActionDomElement().value = fcf.pattern(this.getArg("titlePattern"), {
            value: this.getArg("value"),
            data: fcf.str(data)
          });
        }
      }, {
        key: "onChange",
        value: function onChange(a_event) {
          this.getActionDomElement().classList.remove(this.getTheme().getDecor().selectSearchModeClass);
          var value = a_event.value;
          var items = this.getArg("items");

          this._setValue(value, items[value] ? items[value] : "");
        }
      }, {
        key: "_setValue",
        value: function _setValue(a_value, a_data) {
          this.setArg("value", a_value);
          this.setArg("data", a_data);
        }
      }]);

      return SelectWrapper;
    }(Wrapper);
  }
});