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
  name: "fcfManagement:templates/pages/translate+translations.wrapper.js",
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
        value: function onArg(a_argName, a_value) {
          this.getChild("save").setArg("enable", true);
        }
      }, {
        key: "onArgCurrentTranslate",
        value: function onArgCurrentTranslate(a_value, a_suffix) {}
      }, {
        key: "onArgShortTranslations",
        value: function onArgShortTranslations(a_value, a_suffix) {
          var addr = fcf.parseObjectAddress(a_suffix);
          addr.pop();
          if (addr.length == 0) return;
          var lang = addr[0];
          var item = fcf.resolve(a_value, addr);
          var modify = this.getArg("modify");
          if (!modify[lang]) modify[lang] = {};
          modify[lang][item.phrase] = item.translate;
          this.setArg("modify", modify);
          var remove = this.getArg("remove");

          for (var lang in remove) {
            if (item.phrase in remove[lang]) delete remove[lang][item.phrase];
          }

          this.setArg("remove", remove);
        }
      }, {
        key: "onArgLang",
        value: function onArgLang(a_value) {
          this.update();
        }
      }, {
        key: "onArgDisplaySystem",
        value: function onArgDisplaySystem(a_value) {
          this.update();
        }
      }, {
        key: "onArgDisplayApplication",
        value: function onArgDisplayApplication(a_value) {
          this.update();
        }
      }, {
        key: "onArgDisplayOnlyBlank",
        value: function onArgDisplayOnlyBlank(a_value) {
          this.update();
        }
      }, {
        key: "onNewRecord",
        value: function onNewRecord() {
          fcf.application.render({
            template: "fcfManagement:templates/blocks/dialog.tmpl",
            args: {
              title: fcf.t("Adding a new record"),
              content: fcf.arg("template", {
                template: "@controls:form",
                args: {
                  fcfAlias: "form",
                  views: [{
                    alias: "phrase",
                    title: "!{Phrase}!",
                    type: "string",
                    notEmpty: true
                  }]
                }
              }),
              buttons: ["create", "cancel"],
              fcfEventClose: "fcf.getWrapper('" + this.getId() + "').onNewRecordComplete(event, wrapper)"
            }
          });
        }
      }, {
        key: "onNewRecordComplete",
        value: function onNewRecordComplete(a_event, a_wrapper) {
          if (a_event.button != 'create') return;
          var errors = a_wrapper.getChild('form').validate(true);

          if (!fcf.empty(errors)) {
            a_event.preventDefault();
            return;
          }

          var value = a_wrapper.getChild('form').getArg('value');
          var shortTranslations = this.getArg("shortTranslations");
          var modify = this.getArg("modify");

          for (var lang in shortTranslations) {
            if (!modify[lang]) modify[lang] = {};
            modify[lang][value.phrase] = value.phrase;
          }

          this.setArg("modify", modify);
          var remove = this.getArg("remove");

          for (var lang in remove) {
            if (value.phrase in remove[lang]) delete remove[lang][value.phrase];
          }

          this.setArg("remove", remove);
          var record = {
            phrase: value.phrase,
            locations: "",
            system: false,
            application: true,
            translate: value.phrase,
            editable: true
          };
          var isFill = false;

          for (var lang in shortTranslations) {
            var phrases = shortTranslations[lang];

            if (fcf.find(phrases, function (k, v) {
              return v.phrase == value.phrase;
            }) === undefined) {
              isFill = true;
              phrases.unshift(record);
            }
          }

          if (!isFill) {
            alert(fcf.t("Entered phrase already exists!"));
            a_event.preventDefault();
            return;
          }

          this.setArg("shortTranslations", shortTranslations);
          this.update();
        }
      }, {
        key: "onDeletePhrase",
        value: function onDeletePhrase(a_phrase) {
          var remove = this.getArg("remove");
          var lang = this.getArg("lang");
          if (!remove[lang]) remove[lang] = {};
          remove[lang][a_phrase] = true;
          this.setArg("remove", remove);
          var modify = this.getArg("modify");

          if (modify[lang] && modify[lang][a_phrase]) {
            delete modify[lang][a_phrase];
            this.setArg("modify", modify);
          }

          this.update();
        }
      }, {
        key: "onCancel",
        value: function onCancel(a_event) {
          this.refresh();
        }
      }, {
        key: "onSave",
        value: function onSave(a_event) {
          var self = this;
          var modify = this.getArg("modify");
          var langs = this.getArg("langs");

          for (var lang in langs) {
            if (!modify[lang]) modify[lang] = true;
          }

          this.send({
            command: "update",
            translate: modify,
            remove: this.getArg("remove")
          }).then(function (a_data) {
            self.getChild("save").setArg("enable", false);
            self.update();
          })["catch"](function (a_error) {
            fcf.application.render({
              template: "@controls:error-dialog",
              args: {
                error: a_error
              }
            });
          });
        }
      }, {
        key: "onSearchWords",
        value: function onSearchWords(a_event) {
          var self = this;
          this.send({
            command: "search"
          }).then(function (a_data) {
            self.update();
          })["catch"](function (a_error) {
            fcf.application.render({
              template: "@controls:error-dialog",
              args: {
                error: a_error
              }
            });
          });
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});