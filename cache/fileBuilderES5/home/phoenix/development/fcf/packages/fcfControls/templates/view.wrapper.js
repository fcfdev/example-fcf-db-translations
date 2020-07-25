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
  name: "fcfControls:templates/view.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js", "fcf:NFSQL/NFilter/Filter.js"],
  module: function module(Wrapper, Filter) {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(WrapperEx, _Wrapper);

      var _super = _createSuper(WrapperEx);

      function WrapperEx(a_initializeOptions) {
        var _this;

        _classCallCheck(this, WrapperEx);

        _this = _super.call(this, a_initializeOptions);
        _this.filter = undefined;
        _this._mode = "edit";
        return _this;
      }

      _createClass(WrapperEx, [{
        key: "onAttach",
        value: function onAttach(a_cb) {
          var self = this;
          var view = this.getArg("view");
          return fcf.loadFilters([view]).then(function () {
            self._filter = fcf.getFilter(view);
          });
        }
      }, {
        key: "getCurrentData",
        value: function getCurrentData() {
          var child = fcf.first(this.getChilds());
          return child ? child.getCurrentData() : undefined;
        }
      }, {
        key: "validate",
        value: function validate(a_showError) {
          var self = this;
          var errors = [];

          this._filter.validate({
            data: this.getArg("value"),
            field: this.getArg("view")
          }, errors);

          var result = [];
          fcf.each(errors, function (a_key, a_error) {
            result.push({
              alias: self.getAlias(),
              error: a_error
            });
          });
          var lstErrors = this.getArg("errors");
          this.setArg("errors", result);
          if (a_showError && !fcf.equal(lstErrors, result)) this.update();
          return result;
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});