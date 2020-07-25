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
  name: "fcfManagement:templates/pages/translate+files.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js", "fcf:NTools/languages.js"],
  module: function module(Wrapper, languages) {
    return /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(WrapperEx, _Wrapper);

      var _super = _createSuper(WrapperEx);

      function WrapperEx(a_initializeOptions) {
        var _this;

        _classCallCheck(this, WrapperEx);

        _this = _super.call(this, a_initializeOptions);
        _this._newFiles = [];
        _this._lastFileButtonTitle = undefined;
        return _this;
      }

      _createClass(WrapperEx, [{
        key: "onRemoveFile",
        value: function onRemoveFile(a_file) {
          var files = this.getArg("files");
          var fileKey = fcf.find(files, function (k, v) {
            return v.path == a_file;
          });
          if (fileKey === undefined) return;
          var remove = this.getArg("remove");
          remove.push(files[fileKey].path);
          this.setArg("remove", remove);
          files.splice(fileKey, 1);
          this.setArg("files", files);
          this.update();
        }
      }, {
        key: "onArg",
        value: function onArg(a_argName, a_value, a_suffix) {
          this.getChild("save").setArg("enable", true);
        }
      }, {
        key: "onArgFiles",
        value: function onArgFiles(a_value, a_suffix) {
          var suffArr = fcf.parseObjectAddress(a_suffix);
          var value = fcf.resolve(a_value, a_suffix);

          if (suffArr.length == 2 && suffArr[1] == "editable") {
            var recordIndex = suffArr[0];
            var files = this.getArg("files");
            var record = files[recordIndex];

            for (var i = 0; i < files.length; ++i) {
              if (recordIndex == i) continue;
              if (files[i].lang == record.lang && files[i].editable) this.setArg("files[" + i + "].editable", false);
            }

            this.setArg("files[" + recordIndex + "].editable", true);
          }
        }
      }, {
        key: "onArgLangs",
        value: function onArgLangs(a_value) {
          this.update();
        }
      }, {
        key: "onArgNewFiles",
        value: function onArgNewFiles(a_value) {
          this.update();
        }
      }, {
        key: "onAddTranslationFile",
        value: function onAddTranslationFile() {
          var self = this;
          var fileInput = this.select("[name=file]")[0];

          function clChange() {
            self._setStateAddTranslationButton();
          }

          fileInput.addEventListener("change", clChange, {
            once: true
          });
          fileInput.click();
        }
      }, {
        key: "onAddFileButton",
        value: function onAddFileButton() {
          var fileInput = this.select("[name=file]")[0];

          this._newFiles.push(fileInput);

          var argNewFiles = this.getArg("newFiles");
          argNewFiles.push({
            name: fileInput.files[0].name,
            index: argNewFiles.length,
            attributes: {}
          });
          fcf.each(fileInput.attributes, function (k, attr) {
            argNewFiles[argNewFiles.length - 1].attributes[attr.name] = attr.value;
          });
          var newInput = document.createElement("input");
          newInput.setAttribute("type", "file");
          newInput.setAttribute("name", "file");
          newInput.setAttribute("display", "none");
          fileInput.parentNode.appendChild(newInput);
          fileInput.parentNode.removeChild(fileInput);

          this._setStateAddTranslationButton();

          this.setArg("newFiles", argNewFiles);
        }
      }, {
        key: "onSave",
        value: function onSave() {
          var self = this;
          this.send({
            files: this.getArg("files"),
            langs: this.getArg("langs"),
            remove: this.getArg("remove")
          }, this._newFiles).then(function () {
            document.location.reload(true);
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
        key: "onCancel",
        value: function onCancel() {
          this.refresh();
        }
      }, {
        key: "_setStateAddTranslationButton",
        value: function _setStateAddTranslationButton() {
          var fileInput = this.select("[name=file]")[0];
          var fileButton = this.getChild("addFile");
          var addButton = this.getChild("addFileButton");
          addButton.setArg("enable", fileInput.files.length != 0);

          if (fileInput.files.length) {
            if (!this._lastFileButtonTitle) this._lastFileButtonTitle = fileButton.getArg("title");
            fileButton.setArg("title", fileInput.files[0].name);
          } else {
            fileButton.setArg("title", this._lastFileButtonTitle);
          }
        }
      }]);

      return WrapperEx;
    }(Wrapper);
  }
});