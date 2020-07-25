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
  name: "fcfControls:templates/tabs.wrapper.js",
  dependencies: ["fcfControls:templates/base-control.wrapper.js"],
  module: function module(Wrapper) {
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(TabWrapper, _Wrapper);

      var _super = _createSuper(TabWrapper);

      function TabWrapper(a_initializeOptions) {
        _classCallCheck(this, TabWrapper);

        return _super.call(this, a_initializeOptions);
      }

      _createClass(TabWrapper, [{
        key: "onClick",
        value: function onClick(a_event) {
          this.setArg("tab", a_event.target.getAttribute("key"));
        }
      }, {
        key: "onArgTab",
        value: function onArgTab(a_tab) {
          var activeContainer = undefined;
          var activeName = undefined;
          var lastWrapper = undefined;
          var elemenets = fcf.select(this.getDomElement().parentElement, "[id=" + this.getId() + "]>div>[content]");
          fcf.each(elemenets, function (a_key, a_element) {
            var key = a_element.getAttribute("key");

            if (a_tab == key) {
              a_element.style.display = "block";
              activeContainer = a_element;
              activeName = key;
            } else {
              if (a_element.style.display !== "none" && !fcf.empty(a_element.firstElementChild)) {
                lastWrapper = fcf.getWrapper(a_element.firstElementChild.getAttribute("id"));
              }

              a_element.style.display = "none";
            }
          });
          elemenets = fcf.select(this.getDomElement().parentElement, "[id=" + this.getId() + "]>div>div>[tab]");
          fcf.each(elemenets, function (a_key, a_element) {
            var key = a_element.getAttribute("key");

            if (a_tab == key) {
              a_element.classList.add("active");
            } else {
              a_element.classList.remove("active");
            }
          });

          if (this.getArg("reload")) {
            if (lastWrapper) lastWrapper.destroy();
            var sources = fcf.application.getLocalData().getSourceItem(this._id, "items");
            sources = fcf.isArg(sources) ? sources.value : sources;
            var activeSource = sources[activeName];
            var dataSource = JSON.parse(fcf.lz.decompressFromBase64(activeSource.data));

            if (fcf.isArg(dataSource) && dataSource.type == "template") {
              activeContainer.innerHTML = "";
              dataSource.owner = activeContainer;
              if (!dataSource.args) dataSource.args = {};
              dataSource.args.fcfParent = this.getId();
              fcf.application.render(dataSource);
            } else if (fcf.isArg(dataSource) && dataSource.type == "value") {
              activeContainer.innerHTML = dataSource.value;
            } else {
              activeContainer.innerHTML = dataSource;
            }
          }
        }
      }]);

      return TabWrapper;
    }(Wrapper);
  }
});