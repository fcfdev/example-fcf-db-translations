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
  name: "fcfControls:templates/table.wrapper.js",
  dependencies: ["fcf:NRender/Wrapper.js"],
  module: function module(Wrapper) {
    var TableWrapper = /*#__PURE__*/function (_Wrapper) {
      "use strict";

      _inherits(TableWrapper, _Wrapper);

      var _super = _createSuper(TableWrapper);

      function TableWrapper(a_initializeOptions) {
        var _this;

        _classCallCheck(this, TableWrapper);

        _this = _super.call(this, a_initializeOptions);
        _this._currentDragRow = undefined;
        return _this;
      }

      _createClass(TableWrapper, [{
        key: "_attach",
        value: function _attach(a_cb) {
          Wrapper.prototype._attach.call(this, a_cb);
        }
      }, {
        key: "getCurrentData",
        value: function getCurrentData() {
          return fcf.application.getLocalData().getItem(this._id, "data");
        }
      }, {
        key: "onDragOver",
        value: function onDragOver(a_event) {
          var bottom = false;
          var firstRow = parseInt(this.select("tr[row]")[0].getAttribute("row"));
          var links = this.getArg("_links");

          var row = this._getTr(a_event.toElement).getAttribute("row");

          if (row == "bottom") {
            bottom = true;
            row = this.select(">table>tbody")[0].rows.length;
          } else if (isNaN(parseInt(row))) {
            row = firstRow - 1;
          } else {
            row = parseInt(row);
          }

          if (row < 0) return;
          if (row >= links.length) return;
          a_event.preventDefault();
        }
      }, {
        key: "onDragStart",
        value: function onDragStart(a_event) {
          this._currentDragRow = parseInt(a_event.target.getAttribute("row"));
        }
      }, {
        key: "onDrop",
        value: function onDrop(a_event) {
          a_event.target.parentNode.classList.remove("drag-enter");
          var links = this.getArg("_links");
          var firstRow = parseInt(this.select("tr[row]")[0].getAttribute("row"));

          var row = this._getTr(a_event.toElement).getAttribute("row");

          if (row == "bottom") {
            bottom = true;
            row = firstRow + this.select(">table>tbody")[0].rows.length;
          } else if (isNaN(parseInt(row))) {
            row = firstRow - 1;
          } else {
            row = parseInt(row);
          }

          if (row < 0) return;
          if (row >= links.length) return;
          var rows = this.getArg("value");
          rows.splice(row + (row > this._currentDragRow ? 1 : 0), 0, rows[this._currentDragRow]);
          rows.splice(this._currentDragRow + (this._currentDragRow >= row ? 1 : 0), 1);
          this.setArg("value", rows);
          this.update();
        }
      }, {
        key: "onDragEnter",
        value: function onDragEnter(a_event) {
          if (!this.getArg("dragable")) return;
          var bottom = false;
          var firstRow = parseInt(this.select("tr[row]")[0].getAttribute("row"));
          var links = this.getArg("_links");

          var row = this._getTr(a_event.toElement).getAttribute("row");

          if (row == "bottom") {
            bottom = true;
            row = firstRow + this.select(">table>tbody")[0].rows.length;
          } else if (isNaN(parseInt(row))) {
            row = firstRow - 1;
          } else {
            row = parseInt(row);
          }

          if (row < 0) return;
          if (row >= links.length) return;
          a_event.target.parentNode.classList.add("drag-enter");
        }
      }, {
        key: "onDragLeave",
        value: function onDragLeave(a_event) {
          if (!this.getArg("dragable")) return;
          var bottom = false;
          var firstRow = parseInt(this.select("tr[row]")[0].getAttribute("row"));
          var links = this.getArg("_links");

          var row = this._getTr(a_event.toElement).getAttribute("row");

          if (row == "bottom") {
            bottom = true;
            row = firstRow + this.select(">table>tbody")[0].rows.length;
          } else if (isNaN(parseInt(row))) {
            row = firstRow - 1;
          } else {
            row = parseInt(row);
          }

          if (row < 0) return;
          if (row >= links.length) return;
          a_event.target.parentNode.classList.remove("drag-enter");
        }
      }, {
        key: "_getTr",
        value: function _getTr(a_element) {
          while (true) {
            var tag = a_element.tagName.toLowerCase();
            if (tag == "tr") return a_element;
            if (tag == "body" || tag == "table") return;
            a_element = a_element.parentNode;
          }
        }
      }, {
        key: "onSort",
        value: function onSort(a_event) {
          var key = a_event.target.getAttribute("key");
          var sortOrder = this.getArg("sortOrder", {});
          if (key in sortOrder && sortOrder[key] == "asc") sortOrder[key] = "desc";else if (key in sortOrder && sortOrder[key] == "desc") sortOrder[key] = "unsort";else sortOrder[key] = "asc";
          this.setArg("sortOrder", sortOrder);
          this.update();
        }
      }, {
        key: "onSearch",
        value: function onSearch(a_event) {
          var search = this.getChild("sort").getArg("value");
          this.setArg("search", search);
          this.update();
        }
      }, {
        key: "onClear",
        value: function onClear(a_event) {
          this.setArg("search", "");
          this.update();
        }
      }, {
        key: "onPage",
        value: function onPage(a_event) {
          this.setArg("page", a_event.page);
          this.update();
        }
      }]);

      return TableWrapper;
    }(Wrapper);

    ;
    return TableWrapper;
  }
});