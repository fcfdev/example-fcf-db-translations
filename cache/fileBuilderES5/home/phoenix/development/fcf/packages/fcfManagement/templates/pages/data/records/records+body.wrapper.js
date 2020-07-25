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
  name: "fcfManagement:templates/pages/data/records/records+body.wrapper.js",
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
        key: "onView",
        value: function onView(a_id, a_title) {
          fcf.application.render({
            template: "fcfManagement:templates/blocks/dialog.tmpl",
            args: {
              title: fcf.t("View record") + " '" + a_title + "'",
              width: "100%",
              content: fcf.arg("template", {
                template: "@dbcontrols:form",
                args: {
                  fcfAlias: "form",
                  mode: "read",
                  projection: fcf.getRoute().args.projection,
                  key: a_id
                }
              }),
              buttons: ["close"]
            }
          });
        }
      }, {
        key: "onEdit",
        value: function onEdit(a_id, a_title) {
          fcf.application.render({
            template: "fcfManagement:templates/blocks/dialog.tmpl",
            args: {
              title: fcf.t("Edit record") + " '" + a_title + "'",
              width: "100%",
              content: fcf.arg("template", {
                template: "@dbcontrols:form",
                args: {
                  fcfAlias: "form",
                  mode: "edit",
                  projection: fcf.getRoute().args.projection,
                  key: a_id
                }
              }),
              buttons: ["edit", "cancel"],
              fcfEventClose: "fcf.getWrapper('" + this.getId() + "').onEditComplete(event, wrapper.getChild('form'))"
            }
          });
        }
      }, {
        key: "onEditComplete",
        value: function onEditComplete(a_event, a_form) {
          var self = this;
          if (a_event.button != "edit") return;
          a_form.write(true).then(function () {
            self.getChild("table").update();
          })["catch"](function (a_error) {
            fcf.log.err("fcfDBControls", a_error);
            a_event.preventDefault();
          });
        }
      }, {
        key: "onNewRecord",
        value: function onNewRecord() {
          fcf.application.render({
            template: "fcfManagement:templates/blocks/dialog.tmpl",
            args: {
              title: fcf.t("Create new record"),
              width: "100%",
              content: fcf.arg("template", {
                template: "@dbcontrols:form",
                args: {
                  fcfAlias: "form",
                  mode: "add",
                  projection: fcf.getRoute().args.projection
                }
              }),
              buttons: ["create", "cancel"],
              fcfEventClose: "fcf.getWrapper('" + this.getId() + "').onNewRecordComplate(event, wrapper.getChild('form'))"
            }
          });
        }
      }, {
        key: "onNewRecordComplate",
        value: function onNewRecordComplate(a_event, a_form) {
          var self = this;
          if (a_event.button != "create") return;
          a_form.write(true).then(function () {
            self.getChild("table").update();
          })["catch"](function (a_error) {
            fcf.log.err("fcfDBControls", a_error);
            a_event.preventDefault();
          });
        }
      }, {
        key: "onDelete",
        value: function onDelete(a_key, a_title) {
          fcf.application.render({
            template: "fcfManagement:templates/blocks/dialog.tmpl",
            args: {
              title: fcf.t("Delete record"),
              content: fcf.arg("template", {
                template: "@dbcontrols:removal-form",
                args: {
                  fcfAlias: "form",
                  key: a_key,
                  projection: fcf.getRoute().args.projection
                }
              }),
              buttons: ["delete", "cancel"],
              fcfEventClose: "fcf.getWrapper('" + this.getId() + "').onDeleteComplate(event, wrapper.getChild('form'))"
            }
          });
        }
      }, {
        key: "onDeleteComplate",
        value: function onDeleteComplate(a_event, a_form) {
          var self = this;
          if (a_event.button != "delete") return;
          a_form["delete"]().then(function () {
            self.getChild("table").update();
          })["catch"](function (a_error) {
            fcf.log.err("fcfDBControls", a_error);
            a_event.preventDefault();
          });
        }
      }, {
        key: "onArg",
        value: function onArg(a_argName, a_value, a_suffix) {
          this.update();
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});