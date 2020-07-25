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
  name: "fcfDBControls:templates/form.wrapper.js",
  dependencies: ["fcfControls:templates/form.wrapper.js"],
  module: function module(Form) {
    return /*#__PURE__*/function (_Form) {
      "use strict";

      _inherits(DBForm, _Form);

      var _super = _createSuper(DBForm);

      function DBForm(a_initializeOptions) {
        _classCallCheck(this, DBForm);

        return _super.call(this, a_initializeOptions);
      }

      _createClass(DBForm, [{
        key: "onAttach",
        value: function onAttach() {
          return fcf.loadFilters(this.getArg("views"));
        }
      }, {
        key: "validate",
        value: function validate(a_showError) {
          var result = [];
          var childs = this.getChilds();
          var mode = this.getArg("mode");
          var allErrors = this.getArg("allErrors");
          var values = this.getArg("_values");
          var views = this.getArg("views");
          var newAllErrors = {};
          var defaultLanguage = fcf.getSystemVariable("fcf:defaultLanguage");
          fcf.each(allErrors, function (a_lang, a_items) {
            newAllErrors[a_lang] = {};
            fcf.each(a_items, function (a_alias) {
              newAllErrors[a_lang][a_alias] = [];
              var value = values[a_lang] ? values[a_lang][a_alias] : undefined;
              var errors = [];
              var resErrors = [];
              var view = views[fcf.find(views, function (k, v) {
                return v.alias == a_alias;
              })];

              if (defaultLanguage != a_lang) {
                view = fcf.clone(view);
                delete view.notNull;
                delete view.notEmpty;
              }

              fcf.getFilter(view).validate({
                field: view,
                data: value
              }, errors);
              fcf.each(errors, function (a_key, a_error) {
                resErrors.push({
                  alias: a_alias,
                  error: a_error
                });
              });
              fcf.append(result, resErrors);
              newAllErrors[a_lang][a_alias] = resErrors;
            });
          });

          if (a_showError) {
            this.setArg("allErrors", newAllErrors);
            this.update();
          }

          return result;
        }
      }, {
        key: "write",
        value: function write(a_showErrors) {
          var _this = this;

          var self = this;
          var value = this.getArg("value");
          var key = value && !fcf.empty(value["@key"]) ? value["@key"] : undefined;
          var modify = this.getArg("_modify");
          var mode = self.getArg("mode").split(".")[0];
          var projection = self.getArg("projection");

          if (this.getArg("mode").split(".")[0] == "edit") {
            return fcf.actions().exec(function (a_act) {
              var errors = _this.validate(a_showErrors);

              if (!fcf.empty(errors)) a_act.error(new fcf.Exception("ERROR_FORM_INPUT", {
                errors: errors
              }));else a_act.complete();
            }).then(function () {
              return self.send({
                type: mode,
                data: modify,
                key: key,
                projection: projection
              });
            });
          } else {
            return fcf.actions().exec(function (a_act) {
              var errors = _this.validate(a_showErrors);

              if (!fcf.empty(errors)) a_act.error(new fcf.Exception("ERROR_FORM_INPUT", {
                errors: errors
              }));else a_act.complete();
            }).then(function () {
              return self.send({
                type: mode,
                data: modify,
                key: key,
                projection: projection
              });
            });
          }
        }
      }, {
        key: "onArg_values",
        value: function onArg_values(a_value, a_suffix) {
          var pathArr = fcf.parseObjectAddress(a_suffix);
          if (pathArr.length < 2) return;
          var alias = pathArr[1];
          var newPath = "[\"" + pathArr[0] + "\"][\"" + alias + "\"]";
          var modifyItem = fcf.resolve(a_value, newPath);
          var modify = this.getArg("_modify");
          var values = this.getArg("_values");
          var views = this.getArg("views");
          if (!modify[pathArr[0]]) modify[pathArr[0]] = {};
          fcf.each(values, function (a_lang, a_values) {
            if (!a_values) values[a_lang] = {};
          });
          var index = fcf.find(views, function (k, v) {
            return v.alias == alias;
          });

          if (views[index].translate) {
            modify[pathArr[0]][alias] = modifyItem;
            this.setArg("_modify", modify);
          } else {
            fcf.first(modify)[alias] = modifyItem;
            this.setArg("_modify", modify);
            fcf.each(values, function (a_lang, a_values) {
              a_values[alias] = modifyItem;
            });
            this.setArg("_values", values, false);
          }
        }
      }, {
        key: "onArgLanguage",
        value: function onArgLanguage(a_value, a_suffix) {
          this.update();
        }
      }]);

      return DBForm;
    }(Form);
  }
});