function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var _this = this,
      _arguments = arguments;

  var fcf = {};
  fcf.NDetails = {};
  fcf.tools = {};

  fcf.isServer = function () {
    return typeof module === "object" && typeof module.filename !== "undefined";
  };

  function _fcfGlobals() {
    return this;
  }

  if (fcf.isServer()) {
    var libFS = require('fs');

    var libNet = require('net');

    var libChildProcess = require('child_process');

    fcf.settings = {
      innerRoot: process.cwd(),
      outerRoot: "/",
      libraries: {
        fcf: ""
      }
    };
  } else {
    fcf.settings = {
      innerRoot: '',
      outerRoot: "/",
      routeAliases: {},
      libraries: {
        fcf: ""
      }
    };
  }

  fcf.id = function () {
    var result = "";

    for (var i = 0; i < 32; ++i) {
      result += Math.floor(Math.random() * 16).toString(16);
    }

    return result;
  };

  fcf.NDetails.translations = undefined;

  fcf.t = function (a_txt, a_lang) {
    if (fcf.isServer()) {
      var translations = fcf.NTools.cache.get("fcf", "translations");
      var context = fcf.getContext();
      var variables = fcf.NTools.cache.get("fcf", "variables");
      var lang = a_lang !== undefined ? a_lang : context ? context.get("language") : variables && variables["defaultLanguage"] ? variables["defaultLanguage"] : "en";
      return translations && translations[lang] && translations[lang][a_txt] ? translations[lang][a_txt] : a_txt;
    } else {
      if (fcf.NDetails.translations === undefined) {
        fcf.loadObject({
          path: "/fcfpackages/fcf/Translations.js",
          async: false
        }).then(function (a_data) {
          fcf.NDetails.translations = a_data;
        });
      }

      var lang = a_lang ? a_lang : fcf.getContext().get("language");
      return fcf.NDetails.translations[lang] && fcf.NDetails.translations[lang][a_txt] ? fcf.NDetails.translations[lang][a_txt] : a_txt;
    }

    return a_txt;
  };

  fcf.wrap = function (a_arrOrObject, a_left, a_right) {
    var result = Array.isArray(a_arrOrObject) ? [] : {};
    fcf.each(a_arrOrObject, function (a_key, a_value) {
      var value = fcf.str(a_left) + a_value + fcf.str(a_right);
      if (Array.isArray(a_arrOrObject)) result.push(value);else result[a_key] = value;
    });
    return result;
  };

  fcf.escapeQuotes = function (a_ctxt) {
    var rc;
    var result = "";
    a_ctxt = fcf.str(a_ctxt);

    for (var i = 0; i < a_ctxt.length; ++i) {
      switch (a_ctxt[i]) {
        case "\"":
          rc = "\\\"";
          break;

        case "'":
          rc = "\\'";
          break;

        default:
          rc = a_ctxt[i];
          break;
      }

      result += rc;
    }

    return result;
  };

  fcf.escapeChar = function (a_ctxt, a_char) {
    var rc;
    var result = "";
    a_ctxt = fcf.str(a_ctxt);

    for (var i = 0; i < a_ctxt.length; ++i) {
      switch (a_ctxt[i]) {
        case a_char:
          rc = "\\" + a_char;
          break;

        case "\\" + a_char:
          rc = "\\\\" + a_char;
          break;

        default:
          rc = a_ctxt[i];
          break;
      }

      result += rc;
    }

    return result;
  };

  fcf.unescape = function (a_ctxt) {
    if (typeof a_ctxt != "string") return a_ctxt;
    var result = "";
    var counter = 0;

    for (var i = 0; i < a_ctxt.length; ++i) {
      var c = a_ctxt[i];

      if (c == "\\") {
        ++counter;
        if (counter % 2 == 0) result += c;
      } else {
        counter = 0;
        result += c;
      }
    }

    return result;
  };

  fcf.unescapeObject = function (a_item) {
    var uco = function uco(a_item) {
      if (Array.isArray(a_item)) {
        for (var key = 0; key < a_item.length; ++key) {
          if (typeof a_item[key] == "object") {
            uco(a_item[key]);
          } else {
            a_item[key] = fcf.unescape(a_item[key]);
          }
        }
      } else {
        for (var key in a_item) {
          if (typeof a_item[key] == "object") {
            uco(a_item[key]);
          } else {
            a_item[key] = fcf.unescape(a_item[key]);
          }
        }
      }

      return a_item;
    };

    return typeof a_item == "object" ? uco(a_item) : fcf.unescape(a_item);
  };

  fcf.encodeHtml = function (a_ctxt) {
    var ch;
    var rc;
    var result = "";
    a_ctxt = a_ctxt === undefined || a_ctxt === null ? "" : a_ctxt;

    if (typeof a_ctxt === 'object') {
      a_ctxt = JSON.stringify(a_ctxt);
    } else if (typeof a_ctxt !== 'string') {
      a_ctxt = fcf.str(a_ctxt);
    }

    for (var i = 0; i < a_ctxt.length; ++i) {
      switch (a_ctxt[i]) {
        case "<":
          rc = "&lt;";
          break;

        case ">":
          rc = "&gt;";
          break;

        case "\"":
          rc = "&quot;";
          break;

        case "\'":
          rc = "&#39;";
          break;

        default:
          rc = a_ctxt[i];
          break;
      }

      result += rc;
    }

    return result;
  };

  fcf.decodeHtml = function (a_ctxt, a_parseObject) {
    if (typeof a_ctxt !== "string") return a_ctxt;
    var map = {
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "\'": "&#39;"
    };

    for (var k in map) {
      a_ctxt = fcf.replaceAll(a_ctxt, map[k], k);
    }

    if (a_parseObject) {
      if (a_ctxt.length >= 2 && (a_ctxt.charAt(0) === "{" && a_ctxt.charAt(a_ctxt.length - 1) === "}" || a_ctxt.charAt(0) === "[" && a_ctxt.charAt(a_ctxt.length - 1) === "]")) {
        try {
          a_ctxt = JSON.parse(a_ctxt);
        } catch (e) {}
      }
    }

    return a_ctxt;
  };

  fcf.tagRemoval = function (a_txt) {
    if (typeof a_txt != "string") return a_txt;
    var reg = new RegExp("(<[^>]*>)", "g");
    return a_txt.replace(reg, "");
  };

  fcf.styleElement = function (a_property, a_value) {
    if (a_value === undefined || a_value === null || a_value === "") {
      return "";
    }

    var sizeElement = ["left", "top", "bottom", "right", "width", "min-width", "max-width", "height", "min-height", "max-height"];

    if (sizeElement.indexOf(a_property) != -1) {
      if (fcf.str(a_value).search(/([^\.0-9])/) == -1) a_value = a_value + "px";
    }

    return a_property + ": " + a_value + ";";
  };

  fcf.replaceAll = function (a_str, a_search, a_replacement) {
    if (a_str === undefined || a_str === null) return "";
    if (a_str.indexOf(a_search) == -1) return a_str;
    var result = a_str.split(a_search).join(a_replacement);
    return result;
  };

  fcf.count = function (a_object) {
    if (Array.isArray(a_object)) {
      return a_object.length;
    } else if (typeof a_object == "object") {
      var count = 0;

      for (var k in a_object) {
        ++count;
      }

      return count;
    } else if (typeof a_object == "string") {
      return a_object.length;
    } else {
      return 0;
    }
  };

  fcf.append = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var startArg = typeof args[0] === "boolean" ? 1 : 0;
    var req = typeof args[0] === "boolean" && args[0];

    if (Array.isArray(args[startArg])) {
      for (var j = startArg + 1; j < args.length; ++j) {
        if (!args[j]) continue;

        if (req) {
          for (var i = 0; i < args[j].length; ++i) {
            var itm = args[j][i] === null ? null : Array.isArray(args[j][i]) ? fcf.append(true, [], args[j][i]) : typeof args[j][i] === "object" ? fcf.append(true, Object.create(Object.getPrototypeOf(args[j][i])), args[j][i]) : args[j][i];
            args[startArg].push(itm);
          }
        } else {
          for (var i = 0; i < args[j].length; ++i) {
            args[startArg].push(args[j][i]);
          }
        }
      }
    } else if (typeof args[startArg] === "object") {
      for (var j = startArg + 1; j < args.length; ++j) {
        if (!args[j]) continue;
        var prop = Object.getOwnPropertyNames(args[j]);

        for (var pkey in prop) {
          var key = prop[pkey];

          if (req && typeof args[j][key] === "object" && args[j][key] !== null) {
            if (!args[startArg][key]) args[startArg][key] = Array.isArray(args[j][key]) ? [] : Object.create(Object.getPrototypeOf(args[j][key]));
            fcf.append(true, args[startArg][key], args[j][key]);
          } else {
            args[startArg][key] = args[j][key];
          }
        }
      }
    }

    return args[startArg];
  };

  fcf.clone = function (a_object) {
    return a_object === null ? null : Array.isArray(a_object) ? fcf.append(true, [], a_object) : typeof a_object == "object" ? fcf.append(true, Object.create(Object.getPrototypeOf(a_object)), a_object) : a_object;
  };

  fcf.insertBeforeByValue = function (a_object, a_insertItems, a_search) {
    if (typeof a_object != "object" && typeof a_object != "string") return a_object;
    var result = Array.isArray(a_object) ? [] : typeof a_object == "object" ? {} : "";
    var isSrcFn = typeof a_search == "function";
    var isInsertComplete = false;

    if (Array.isArray(a_object) || typeof a_object != "string") {
      for (var i = 0; i < a_object.length; ++i) {
        if (isSrcFn) {
          if (!isInsertComplete && a_search(i, a_object[i])) {
            fcf.append(result, a_insertItems);
            isInsertComplete = true;
          }
        } else {
          if (!isInsertComplete && a_object[i] == a_search) {
            fcf.append(result, a_insertItems);
            isInsertComplete = true;
          }
        }

        result.push(a_object[i]);
      }
    } else {
      for (var i in a_object) {
        if (isSrcFn) {
          if (!isInsertComplete && a_search(i, a_object[i])) {
            fcf.append(result, a_insertItems);
            isInsertComplete = true;
          }
        } else {
          if (!isInsertComplete && a_object[i] == a_search) {
            fcf.append(result, a_insertItems);
            isInsertComplete = true;
          }
        }

        result[i] = a_object[i];
      }
    }

    return result;
  };

  fcf.removeByValue = function (a_object, a_value) {
    if (Array.isArray(a_object)) {
      var rmKeys = [];

      for (var i = 0; i < a_object.length; ++i) {
        if (fcf.equal(a_object[i], a_value)) rmKeys.push(i);
      }

      for (var i = 0; i < rmKeys.length; ++i) {
        a_object.splice(rmKeys[i] - i, 1);
      }
    } else if (typeof a_object === "object") {
      var rmKeys = [];

      for (var i in a_object) {
        if (fcf.equal(a_object[i], a_value)) rmKeys.push(i);
      }

      for (var i = 0; i < rmKeys.length; ++i) {
        delete a_object[rmKeys[i]];
      }
    }
  };

  fcf.prepareObject = function (a_root, a_objectPath) {
    a_objectPath = a_objectPath.split("/").join(".");
    var items = a_objectPath.split(".");
    var obj = a_root;

    for (var i = 0; i < items.length; ++i) {
      if (!(items[i] in obj)) obj[items[i]] = {};
      obj = obj[items[i]];
    }

    return obj;
  };

  fcf.isEnumerable = function (a_object) {
    if (fcf.isServer()) {
      return Array.isArray(a_object);
    } else {
      return Array.isArray(a_object) || a_object instanceof DOMTokenList || a_object instanceof NodeList;
    }
  };

  fcf.find = function (a_obj, a_cb) {
    if (typeof a_cb === "function") {
      if (fcf.isEnumerable(a_obj)) {
        for (var i = 0; i < a_obj.length; ++i) {
          if (a_cb(i, a_obj[i])) return i;
        }
      } else if (typeof a_obj === "object") {
        for (var k in a_obj) {
          if (a_cb(k, a_obj[k])) return k;
        }
      }
    } else {
      if (fcf.isEnumerable(a_obj)) {
        for (var i = 0; i < a_obj.length; ++i) {
          if (a_cb == a_obj[i]) return i;
        }
      } else if (typeof a_obj === "object") {
        for (var k in a_obj) {
          if (a_cb == a_obj[k]) return k;
        }
      }
    }
  };

  fcf.each = fcf.foreach = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var a_obj = args[0];
    var a_cb = args[1];
    var result = undefined;

    if (typeof args[1] == "function") {
      if (fcf.isEnumerable(a_obj)) {
        for (var i = 0; i < a_obj.length; ++i) {
          result = a_cb(i, a_obj[i]);
          if (result !== undefined) break;
        }
      } else if (typeof a_obj === "object") {
        for (var k in a_obj) {
          result = a_cb(k, a_obj[k]);
          if (result !== undefined) break;
        }
      } else if (typeof a_obj === "string") {
        for (var i = 0; i < a_obj.length; ++i) {
          result = a_cb(i, a_obj[i]);
          if (result !== undefined) break;
        }
      }
    } else {
      var args = [undefined, undefined];

      for (var i = 1; i < args.length; ++i) {
        if (i == args.length - 1) a_cb = args[i];else args.push(args[i]);
      }

      if (fcf.isEnumerable(a_obj)) {
        for (var i = 0; i < a_obj.length; ++i) {
          args[0] = i;
          args[1] = a_obj[i];
          result = a_cb.apply(_this, args);
          if (result !== undefined) break;
        }
      } else if (typeof a_obj === "object") {
        for (var k in a_obj) {
          args[0] = i;
          args[1] = a_obj[i];
          result = a_cb.apply(_this, args);
          if (result !== undefined) break;
        }
      } else if (typeof a_obj === "string") {
        for (var i = 0; i < a_obj.length; ++i) {
          args[0] = i;
          args[1] = a_obj[i];
          result = a_cb.apply(_this, args);
          if (result !== undefined) break;
        }
      }
    }

    return result;
  };

  fcf.map = function (a_object, a_cb) {
    var result = {};
    fcf.each(a_object, function (a_key, a_value) {
      var itm = a_cb(a_key, a_value);

      if (Array.isArray(itm)) {
        result[itm[0]] = itm[1];
      } else {
        fcf.append(result, itm);
      }
    });
    return result;
  };

  fcf.filter = function (a_object, a_cb) {
    var result = {};
    fcf.each(a_object, function (k, v) {
      if (a_cb(k, v)) result[k] = v;
    });
    return result;
  };

  fcf.array = function (a_object, a_cb) {
    var result = [];
    fcf.each(a_object, function (a_key, a_value) {
      var itm = a_cb(a_key, a_value);
      if (itm !== undefined) result.push(itm);
    });
    return result;
  };

  fcf.max = function (a_left, a_right) {
    return a_left > a_right ? a_left : a_right;
  };

  fcf.min = function (a_left, a_right) {
    return a_left < a_right ? a_left : a_right;
  };

  fcf.range = function (a_value, a_left, a_right, a_default) {
    a_left = parseFloat(a_left);
    a_left = isNaN(a_left) ? Number.MIN_VALUE : a_left;
    a_right = parseFloat(a_right);
    a_right = isNaN(a_right) ? Number.MAX_VALUE : a_right;
    a_value = parseFloat(a_value);
    if (isNaN(a_value) && a_default !== undefined) return a_default;
    a_value = isNaN(a_value) ? a_left : a_value;
    return a_value <= a_left && a_default === undefined ? a_left : a_value <= a_left && a_default !== undefined ? a_default : a_value >= a_right && a_default === undefined ? a_right : a_value >= a_right && a_default !== undefined ? a_default : a_value;
  };

  fcf.inc = function (a_value, a_incArg) {
    a_incArg = parseFloat(a_incArg);
    if (isNaN(a_incArg)) a_incArg = 1;
    var val = parseFloat(a_value);
    return isNaN(val) ? a_value : val + a_incArg;
  };

  fcf.first = function (a_object) {
    if (Array.isArray(a_object)) {
      return a_object[0];
    } else if (typeof a_object == "object") {
      for (var k in a_object) {
        return a_object[k];
      }

      return;
    } else if (typeof a_object == "string") {
      return a_object.charAt(0);
    }
  };

  fcf.firstKey = function (a_object) {
    if (Array.isArray(a_object)) {
      return a_object.length ? 0 : undefined;
    } else if (typeof a_object == "object") {
      for (var k in a_object) {
        return k;
      }

      return;
    } else if (typeof a_object == "string") {
      return a_object.length ? 0 : undefined;
    }
  };

  fcf.first2 = function (a_object, a_default) {
    var res = fcf.first(fcf.first(a_object));
    return res === undefined ? a_default : res;
  };

  fcf.last = function (a_object) {
    if (Array.isArray(a_object) || typeof DOMRectList !== "undefined" && a_object instanceof DOMRectList) {
      return a_object.length ? a_object[a_object.length - 1] : undefined;
    } else if (typeof a_object == "object") {
      var last;

      for (var k in a_object) {
        last = a_object[k];
      }

      return last;
    } else if (typeof a_object == "string") {
      return a_object.length ? a_object.charAt(a_object.length - 1) : "";
    }
  };

  fcf.last2 = function (a_object, a_default) {
    var res = fcf.last(fcf.last(a_object));
    return res === undefined ? a_default : res;
  };

  fcf.byteCount = function (a_string) {
    var result = 0;

    for (var i = 0; i < a_string.length; ++i) {
      result += Math.floor(Math.log(a_string.charCodeAt(i)) / Math.log(2) / 8) + 1;
    }

    return result;
  };

  fcf.empty = function (a_object) {
    if (a_object instanceof Error) {
      return false;
    } else if (a_object === undefined || a_object === null) {
      return true;
    } else if (typeof a_object === "string") {
      return a_object == "";
    } else if (Array.isArray(a_object)) {
      return a_object.length === 0;
    } else if (!fcf.isServer() && a_object instanceof NodeList) {
      return a_object.length === 0;
    } else if (typeof a_object === "object") {
      for (var k in a_object) {
        return false;
      }

      return true;
    } else if (typeof a_object === "number") {
      return isNaN(a_object);
    }

    return false;
  };

  fcf["in"] = function (a_obj, a_value) {
    if (Array.isArray(a_obj)) {
      if (Array.isArray(a_value)) {
        for (var i = 0; i < a_obj.length; ++i) {
          for (var j = 0; j < a_value.length; ++j) {
            if (a_obj[i] == a_value[j]) return true;
          }
        }
      } else if (typeof a_value === "object") {
        for (var i = 0; i < a_obj.length; ++i) {
          for (var j in a_value) {
            if (a_obj[i] == a_value[j]) return true;
          }
        }
      } else {
        for (var i = 0; i < a_obj.length; ++i) {
          if (a_obj[i] == a_value) return true;
        }
      }
    } else if (typeof a_obj == "object") {
      if (Array.isArray(a_value)) {
        for (var k in a_obj) {
          for (var j = 0; j < a_value.length; ++j) {
            if (a_obj[k] == a_value[j]) return true;
          }
        }
      } else if (typeof a_value == "object") {
        for (var k in a_obj) {
          for (var j in a_value) {
            if (a_obj[k] == a_value[j]) return true;
          }
        }
      } else {
        for (var k in a_obj) {
          if (a_obj[k] == a_value) return true;
        }
      }
    } else if (typeof a_obj == "string") {
      return a_obj.indexOf(a_value) !== -1;
    }

    return false;
  };

  fcf.indexOfAll = function (a_arr, a_val) {
    var result = [];
    var i = -1;

    while ((i = a_arr.indexOf(a_val, i + 1)) != -1) {
      result.push(i);
    }

    return result;
  };

  fcf.splitSpace = function (a_ctxt) {
    var result = [];
    var empty = true;
    var beg = 0;

    for (var i = 0; i < a_ctxt.length; ++i) {
      var code = a_ctxt.charCodeAt(i);

      if (!empty && code <= 32 && code >= 0) {
        result.push(a_ctxt.substr(beg, i - beg));
        empty = true;
      } else {
        if (empty) beg = i;
        empty = false;
      }
    }

    if (!empty) result.push(a_ctxt.substr(beg, a_ctxt.length - beg));
    return result;
  };

  fcf.ltrimPos = function (a_str, a_arr) {
    var pos = 0;

    for (; pos < a_str.length; ++pos) {
      if (Array.isArray(a_arr)) {
        var found = false;

        for (var i = 0; i < a_arr.length; ++i) {
          if (a_str.charAt(pos) == a_arr[i]) {
            found = true;
            break;
          }
        }

        if (!found) break;
      } else if (a_arr !== undefined) {
        if (a_str.charAt(pos) != a_arr) break;
      } else {
        var code = a_str.charCodeAt(pos);
        if (code > 32 || code < 0) break;
      }
    }

    return pos;
  };

  fcf.rtrimPos = function (a_str, a_arr) {
    if (!a_str.length) return 0;
    var pos = a_str.length - 1;

    for (; pos >= 0; --pos) {
      if (Array.isArray(a_arr)) {
        var found = false;

        for (var i = 0; i < a_arr.length; ++i) {
          if (a_str.charAt(pos) == a_arr[i]) {
            found = true;
            break;
          }
        }

        if (!found) break;
      } else if (a_arr !== undefined) {
        if (a_str.charAt(pos) != a_arr) break;
      } else {
        var code = a_str.charCodeAt(pos);
        if (code > 32 || code < 0) break;
      }
    }

    return pos + 1;
  };

  fcf.ltrim = function (a_str, a_arr) {
    var pos = fcf.ltrimPos(a_str, a_arr);
    return pos != 0 ? a_str.substr(pos) : a_str;
  };

  fcf.rtrim = function (a_str, a_arr) {
    var pos = fcf.ltrimPos(a_str, a_arr);
    return pos != a_str.length ? a_str.substr(0, pos) : a_str;
  };

  fcf.trim = function (a_str, a_arr) {
    var a_str = fcf.str(a_str);
    var posBeg = fcf.ltrimPos(a_str, a_arr);
    var posEnd = fcf.rtrimPos(a_str, a_arr);
    return posBeg != 0 || posEnd != a_str.length ? a_str.substr(posBeg, posEnd - posBeg) : a_str;
  };

  fcf.str = function (a_data) {
    return a_data === undefined ? "" : a_data === null ? "" : a_data === NaN ? "" : a_data instanceof fcf.RenderResults ? a_data.toString() : a_data instanceof fcf.Exception ? a_data.toString() : typeof a_data == "object" && a_data.sqlMessage && a_data.sqlState && a_data.code ? a_data.sqlMessage : typeof a_data == "object" && a_data.message ? a_data.message : typeof a_data == "object" ? JSON.stringify(a_data, undefined, 2) : typeof a_data !== "string" ? a_data.toString() : a_data;
  };

  fcf.strToObject = function (a_data) {
    var result = a_data;

    if (typeof result === "string") {
      try {
        if (result.charAt(0) == "[" || result.charAt(0) == "{") result = JSON.parse(result);
      } catch (e) {}
    }

    return result;
  };

  fcf.merge = function (a_dst, a_value, a_options) {
    var type = a_options && a_options.type ? a_options.type : "append";
    a_dst = fcf.append(true, {}, a_dst);

    if (type == "append") {
      if (Array.isArray(a_value)) {
        var count = 0;
        var buf = {};
        var max = {};
        var order = a_options && !fcf.empty(a_options.position) ? a_options.position : -1;
        if (order < 0) order = a_dst.length;

        for (var i = 0; i < a_value.length; ++i) {
          var o = typeof a_value[i] === "object" && "mergePosition" in a_value[i] ? a_value[i].mergePosition : order;
          if (!buf[o]) buf[o] = [];
          buf[o].push(a_value[i]);
        }

        for (var i = 0; i < a_dst.length; ++i) {
          if (!buf[i]) buf[i] = [];
          buf[i].push(a_dst[i]);
        }

        var result = [];

        for (var k in buf) {
          for (var i = 0; i < buf[k].length; ++i) {
            result.push(buf[k][i]);
          }
        }

        return result;
      } else if (typeof a_value === "object") {
        return fcf.append(a_dst, a_value);
      }
    }
  };

  fcf.buildModeObject = function (a_mode, a_object, a_fieldModeNames) {
    if (!a_fieldModeNames) a_fieldModeNames = "usage";
    var result = fcf.append({}, a_object);
    var obj = typeof a_object[a_fieldModeNames] == "object" ? a_object[a_fieldModeNames][fcf.getMode(a_mode, a_object[a_fieldModeNames])] : undefined;
    if (obj) fcf.append(result, obj);
    return result;
  };

  fcf.getModeObject = function (a_mode, a_modesObject, a_default) {
    if (!a_modesObject) return a_default;
    var result = a_modesObject[fcf.getMode(a_mode, a_modesObject)];
    return result !== undefined ? result : a_default;
  };

  fcf.cutMode = function (a_mode, a_cut) {
    var res = "";
    var modeArr = a_mode.split(".");

    for (var i = 0; i < a_cut; ++i) {
      res += (i !== 0 ? "." : "") + modeArr[i];
    }

    return res;
  };

  fcf.getMode = function (a_mode, a_modesObject) {
    if (!a_modesObject) return undefined;
    a_mode = typeof a_mode == "string" ? a_mode : "";
    var arrMode = a_mode.split(".");
    var lstMode = undefined;
    var lstWeight = -1;

    for (var mode in a_modesObject) {
      var coincidence = true;
      var overload = false;
      var arrTmpl = mode.split(".");
      var weight = Number.MAX_VALUE;
      if (arrTmpl.length > arrMode.length) continue;

      for (var i = 0; i < arrMode.length; ++i) {
        if (i >= arrTmpl.length) {
          if (i == 0 || arrTmpl[i - 1] != "*") coincidence = false;
          break;
        } else if (arrTmpl[i] != "*" && arrTmpl[i] != arrMode[i]) {
          coincidence = false;
          break;
        } else if (arrTmpl[i] == "*") {
          weight = i;
        }
      }

      if (coincidence && lstWeight < weight) {
        lstMode = mode;
        lstWeight = weight;
      }
    }

    return lstMode;
  };

  fcf.getVariablesFromCode = function (a_str) {
    if (typeof a_str != "string") return [];
    var re = new RegExp('([_a-z][_a-z0-9]*\\[[\'"][^\'"]*[\'"]\\]\\[[\'"][^\'"]*[\'"]\\])' + '|([_a-z][_a-z0-9]*\\.[_a-z][_a-z0-9]*\\[[\'"][^\'"]*[\'"]\\])' + '|([_a-z][_a-z0-9]*\\[[\'"][^\'"]*[\'"]\\]\\.[_a-z][_a-z0-9]*)' + '|([_a-z][_a-z0-9]*\\.[_a-z][_a-z0-9]*\\.[_a-z][_a-z0-9]*)' + '|([_a-z][_a-z0-9]*\\.[_a-z][_a-z0-9]*)' + '|([_a-z][_a-z0-9]*\\[[\'"][^\'"]*[\'"]\\])' + '|([_a-z][_a-z0-9]*)', "gi");
    var res = a_str.match(re);
    if (!Array.isArray(res)) res = [];
    return res;
  };

  fcf.getVariablesString = function (a_str) {
    var findBlockBegin = function findBlockBegin(a_str, a_pos) {
      var result = {
        type: "",
        pos: -1
      };

      while (true) {
        a_pos = a_str.indexOf("{{", a_pos);

        if (a_pos == -1) {
          return result;
        }

        if (a_pos == 0) {
          a_pos += 2;
          continue;
        }

        var type = a_str[a_pos - 1];
        var skip = a_pos >= 2 && a_str[a_pos - 2] == "\\";

        if (skip) {
          a_pos += 2;
          continue;
        }

        if (type == "$" || type == "#" || type == "@") {
          result.pos = a_pos - 1;
          result.type = type;
          return result;
        }

        a_pos += 2;
      }
    };

    var result = [];
    if (typeof a_str !== "string") return result;
    var pos = 0;

    while (true) {
      var blockBegin = findBlockBegin(a_str, pos);
      if (blockBegin.pos == -1) return result;
      var blockEndPos = a_str.indexOf("}}" + blockBegin.type, blockBegin.pos + 3);
      if (blockEndPos == -1) return result;
      pos = blockEndPos + 3;

      if (blockBegin.type == "$" || blockBegin.type == "#") {
        result.push(fcf.trim(a_str.substr(blockBegin.pos + 3, blockEndPos - blockBegin.pos - 3)));
      } else if (blockBegin.type == "@") {
        var code = a_str.substr(blockBegin.pos + 3, blockEndPos - blockBegin.pos - 3);
        fcf.append(result, fcf.getVariablesFromCode(code));
      }
    }

    return result;
  };

  fcf.getRouteVariablesByString = function (a_str) {
    var result = [];
    var vars = fcf.getVariablesString(a_str);

    for (var i = 0; i < vars.length; ++i) {
      var item = fcf.parseObjectAddress(vars[i]);
      if (item[0] == "route" && item[1] == "args" && !fcf.empty(item[2])) result.push(item[2]);
    }

    return result;
  };

  fcf.getRouteVariablesBySource = function (a_object) {
    if (!fcf.isArg(a_object)) return [];
    return fcf.getRouteVariablesByString(a_object.value);
  };

  fcf.unslash = function (a_txt) {
    var res = "";
    var slashCounter = 0;

    for (var i = 0; i < a_txt.length; ++i) {
      var c = a_txt.charAt(i);

      if (c === "\\") {
        if (slashCounter % 2 != 0) res += c;
        ++slashCounter;
      } else {
        slashCounter = 0;
        res += c;
      }
    }

    return res;
  };

  fcf.pattern = function (a_str, a_object, a_refInfo) {
    if (!a_object) a_object = {};

    try {
      if (typeof a_str == "string") {
        return fcf._pattern(a_str, a_object, a_refInfo);
      } else if (typeof a_str == "object") {
        var a_str = fcf.clone(a_str);
        fcf.each(a_str, function (k, v) {
          a_str[k] = fcf.pattern(a_str[k], a_object, a_refInfo);
        });
        return a_str;
      } else {
        return a_str;
      }
    } catch (e) {
      return "";
    }
  };

  fcf._pattern = function (a_str, a_object, a_refInfo) {
    a_refInfo = a_refInfo ? a_refInfo : {};
    if (!a_refInfo.references) a_refInfo.references = {};
    var result = "";
    var buff = "";
    var state = 0;
    var rmode = 0;
    var start = undefined;
    a_str = fcf.str(a_str);

    for (var i = 0; i < a_str.length; ++i) {
      var c = a_str.charAt(i);

      if (state == 0) {
        if (c == "$") {
          start = i;
          state = 1;
          rmode = 1;
        } else if (c == "@") {
          start = i;
          state = 1;
          rmode = 2;
        } else if (c == "&") {
          start = i;
          state = 1;
          rmode = 3;
        } else if (c == "!") {
          start = i;
          state = 1;
          rmode = 4;
        } else {
          result += c;
        }
      } else if (state == 1) {
        if (c == "{") {
          state = 2;
          buff = "";
        } else {
          result += (rmode == 1 ? "$" : rmode == 2 ? "@" : rmode == 3 ? "&" : "!") + c;
          state = 0;
        }
      } else if (state == 2) {
        if (c == "}") {
          if (rmode == 1 && a_str.charAt(i + 1) == "$") {
            state = 0;

            if (start == 0 && i == a_str.length - 2) {
              return fcf.resolve(a_object, buff);
            } else {
              result += fcf.str(fcf.resolve(a_object, buff));
            }

            ++i;
          } else if (rmode == 2 && a_str.charAt(i + 1) == "@") {
            state = 0;

            if (start == 0 && i == a_str.length - 2) {
              return fcf.safeEvalResult(buff, a_object);
            } else {
              result += fcf.str(fcf.safeEvalResult(buff, a_object));
            }

            ++i;
          } else if (rmode == 3 && a_str.charAt(i + 1) == "&") {
            state = 0;
            var refPathArr = fcf.parseObjectAddress(buff);
            var refPathArrFirst = refPathArr[0];
            refPathArr.shift();
            var fullRef = a_refInfo.references[refPathArrFirst];

            for (var j = 0; j < refPathArr.length; ++j) {
              fullRef += '["' + refPathArr[j] + '"]';
            }

            var ref = fcf.arg("reference", {
              id: a_refInfo.id,
              arg: fullRef
            });

            if (start == 0 && i == a_str.length - 2) {
              return ref;
            } else {
              result += fcf.str(ref);
            }

            ++i;
          } else if (rmode == 4 && a_str.charAt(i + 1) == "!") {
            state = 0;
            if (buff[0] == "{" && buff[buff.length - 1] == "}") buff = buff.substr(1, buff.length - 2);
            result += fcf.t(buff);
            ++i;
          } else {
            buff += c;
          }
        } else {
          buff += c;
        }
      }
    }

    return result;
  };

  fcf.tokenize = function (a_ctxtptr, a_obj, a_escape) {
    if (a_ctxtptr instanceof fcf.StringPointer) {
      return fcf._tokenizePtrEx(ctxtptr, a_obj, a_escape).data;
    } else if (typeof a_ctxtptr == "object") {
      a_ctxtptr = fcf.clone(a_ctxtptr);
      fcf.each(a_ctxtptr, function (k, v) {
        a_ctxtptr[k] = fcf.tokenize(v, a_obj, a_escape);
      });
      return a_ctxtptr;
    } else if (typeof a_ctxtptr == "string") {
      var ctxtptr = new fcf.StringPointer(a_ctxtptr);
      return fcf._tokenizePtrEx(ctxtptr, a_obj, a_escape).data;
    } else {
      return a_ctxtptr;
    }
  };

  fcf.tokenizeObject = function (a_object, a_args, a_escape) {
    var result = Array.isArray(a_object) ? [] : Object.create(Object.getPrototypeOf(a_object));

    if (Array.isArray(a_object)) {
      for (var i = 0; i < a_object.length; ++i) {
        var v = a_object[i];

        if (typeof v === "object" && v !== null) {
          result[i] = fcf.tokenizeObject(v, a_args, a_escape);
        } else if (typeof v === "string") {
          result[i] = fcf.tokenize(v, a_args, a_escape);
        } else {
          result[i] = v;
        }
      }
    } else {
      for (var k in a_object) {
        var v = a_object[k];

        if (typeof v === "object" && v !== null) {
          if (typeof k == "string") k = fcf.tokenize(k, a_args, a_escape);
          result[k] = fcf.tokenizeObject(v, a_args, a_escape);
        } else if (typeof v === "string") {
          if (typeof k == "string") k = fcf.tokenize(k, a_args, a_escape);
          result[k] = fcf.tokenize(v, a_args, a_escape);
        } else {
          if (typeof k == "string") k = fcf.tokenize(k, a_args, a_escape);
          result[k] = v;
        }
      }
    }

    return result;
  };

  fcf.tokenizeEx = function (a_ctxtptr, a_obj, a_escape) {
    var ctxtptr = typeof a_ctxtptr === "object" ? a_ctxtptr : new fcf.StringPointer(a_ctxtptr);
    return fcf._tokenizePtrEx(ctxtptr, a_obj, a_escape);
  };

  fcf._tokenizePtrEx = function (a_ctxtptr, a_obj, a_escape) {
    var result = {
      data: "",
      noComplete: false,
      replace: false
    };

    var clFindSubstitution = function clFindSubstitution(a_str, a_startPos) {
      var result = {
        beg: undefined,
        end: undefined,
        type: undefined
      };
      var emptyResult = {
        beg: undefined,
        end: undefined,
        type: undefined
      };
      var escCnt = 0;
      var state = 0;
      /*
       0 find block
       1 find first {
       2 find second {
       3 find first }
       4 find second }
       5 find close
      */

      for (var i = a_startPos; i < a_str.length; ++i) {
        var c = a_str[i];

        if ((!a_escape || escCnt % 2 == 0) && state == 0) {
          if (c == "@" || c == "#" || c == "$" || c == "!") {
            result.type = c;
            result.beg = i;
            state = 1;
          }
        } else if (state == 1) {
          if (c == "{") state = 2;else state = 0;
        } else if (state == 2) {
          if (c == "{") state = 3;else state = 0;
        } else if (state == 3) {
          if (c == "}") {
            state = 4;
          }
        } else if (state == 4) {
          if (c == "}") {
            state = 5;
          } else {
            state = 3;
          }
        } else if (state == 5) {
          if (c == result.type) {
            result.end = i + 1;
            return result;
          } else {
            state = 3;
          }
        }

        if (c == "\\") ++escCnt;else escCnt = 0;
      }

      return emptyResult;
    };

    var clResolveSimple = function clResolveSimple(a_str, a_blockPosition) {
      var key = a_str.substr(a_blockPosition.beg + 3, a_blockPosition.end - a_blockPosition.beg - 6);
      return fcf.resolveEx(a_obj, key);
    };

    var clResolveData = function clResolveData(a_str, a_blockPosition) {
      var key = a_str.substr(a_blockPosition.beg + 3, a_blockPosition.end - a_blockPosition.beg - 6);
      return fcf.resolveEx(a_obj, key);
    };

    var clResolveCode = function clResolveCode(a_str, a_blockPosition) {
      var code = a_str.substr(a_blockPosition.beg + 3, a_blockPosition.end - a_blockPosition.beg - 6);
      var result;

      try {
        result = fcf.safeEvalResult('(' + code + ')', a_obj);
      } catch (e) {
        return {
          object: undefined,
          key: undefined
        };
      }

      if (result === undefined) return {
        object: undefined,
        key: undefined
      };
      if (typeof result === "number" && isNaN(result)) return {
        object: undefined,
        key: undefined
      };
      return {
        object: {
          result: result
        },
        key: "result"
      };
    };

    var pos = a_ctxtptr.pos;
    var str = a_ctxtptr.fullStr();

    while (pos !== undefined) {
      var blockPosition = clFindSubstitution(str, pos);
      var item = str.substr(pos, blockPosition.beg !== undefined ? blockPosition.beg - pos : str.length - pos);
      if (item !== "") result.data += item;

      if (blockPosition.beg !== undefined) {
        if (blockPosition.type == "$") {
          var retSubstitution = clResolveSimple(str, blockPosition);

          if (retSubstitution.object) {
            result.data = fcf.str(result.data) + fcf.str(retSubstitution.object[retSubstitution.key]);
            result.replace = true;
          } else {
            result.data += str.substr(blockPosition.beg, blockPosition.end - blockPosition.beg);
            result.noComplete = true;
          }
        } else if (blockPosition.type == "#") {
          var retSubstitution = clResolveData(str, blockPosition);

          if (retSubstitution.object) {
            result.data = blockPosition.beg == 0 && blockPosition.end == str.length ? retSubstitution.object[retSubstitution.key] : fcf.str(result.data) + retSubstitution.object[retSubstitution.key];
            result.replace = true;
          } else {
            result.data += str.substr(blockPosition.beg, blockPosition.end - blockPosition.beg);
            result.noComplete = true;
          }
        } else if (blockPosition.type == "@") {
          var retSubstitution = clResolveCode(str, blockPosition);

          if (retSubstitution.object) {
            result.data = blockPosition.beg == 0 && blockPosition.end == str.length ? retSubstitution.object[retSubstitution.key] : fcf.str(result.data) + retSubstitution.object[retSubstitution.key];
            result.replace = true;
          } else {
            result.data += str.substr(blockPosition.beg, blockPosition.end - blockPosition.beg);
            result.noComplete = true;
          }
        } else if (blockPosition.type == "!") {
          result.data += fcf.t(str.substr(blockPosition.beg + 3, blockPosition.end - blockPosition.beg - 6));
          result.replace = true;
        }
      }

      pos = blockPosition.end;
    }

    return result;
  };

  fcf.normalizeObjectAddress = function (a_path) {
    var arr = fcf.parseObjectAddress(a_path);
    var result = "";
    var key;

    for (var i = 0; i < arr.length; ++i) {
      key = fcf.replaceAll(arr[i], "\\", "\\\\");
      key = fcf.replaceAll(key, "\"", "\\\""); // if (result != "")
      //   result += ".";

      result += "[\"" + key + "\"]";
    }

    return result;
  };

  fcf.getObjectAddressItem = function (a_path, a_numIndex) {
    var arr = fcf.parseObjectAddress(a_path);
    var result = "";
    var key;

    for (var i = 0; i < arr.length && i <= a_numIndex; ++i) {
      key = fcf.replaceAll(arr[i], "\\", "\\\\");
      key = fcf.replaceAll(key, "\"", "\\\"");
      if (result != "") result += ".";
      result += "[\"" + key + "\"]";
    }

    return result;
  };

  var fcfStringPointer = /*#__PURE__*/function () {
    "use strict";

    function fcfStringPointer(a_string) {
      _classCallCheck(this, fcfStringPointer);

      this._str = a_string;
      this.pos = 0;
      this.posend = this._str.length;
    }

    _createClass(fcfStringPointer, [{
      key: "clone",
      value: function clone() {
        return fcf.append({}, this);
      }
    }, {
      key: "fullStr",
      value: function fullStr() {
        return this._str;
      }
    }, {
      key: "str",
      value: function str() {
        return this._str.substr(this.pos, this.posend - this.pos);
      }
    }, {
      key: "indexOf",
      value: function indexOf(a_ctx, a_startPos) {
        if (a_startPos === -1) return -1;
        var startPos = a_startPos !== undefined ? a_startPos : this.pos;
        var result = -1;

        if (typeof a_ctx === "string") {
          result = this._str.indexOf(a_ctx, startPos);
        } else {
          for (var i = startPos; i < this.posend; ++i) {
            var char = this._str.charAt(i);

            for (var j = 0; j < a_ctx.length; ++j) {
              if (a_ctx[j] == char) {
                if (result === -1 || i < result) {
                  result = i;
                  break;
                }
              }
            }
          }
        }

        return result >= this.posend ? -1 : result;
      }
    }, {
      key: "indexOfSpace",
      value: function indexOfSpace(a_startPos) {
        if (a_startPos === -1) return -1;
        var startPos = a_startPos !== undefined ? a_startPos : this.pos;

        for (var i = startPos; i < this.posend; ++i) {
          var code = this._str.charCodeAt(i);

          if (code <= 32 && code > 0) return i;
        }

        return -1;
      }
    }, {
      key: "end",
      value: function end() {
        return this.pos >= this.posend;
      }
    }, {
      key: "ltrim",
      value: function ltrim(a_arr) {
        var startPos = this.pos;

        if (a_arr === undefined) {
          while (!this.end()) {
            var code = this._str.charCodeAt(this.pos);

            if (code <= 32 && code > 0) break;
            ++this.pos;
          }
        } else {
          var br = false;
          a_arr = Array.isArray(a_arr) ? a_arr : [a_arr];

          while (!this.end()) {
            var char = this._str.charAt(this.pos);

            for (var i = 0; i < a_arr.length; ++i) {
              if (char == a_arr[i]) {
                br = true;
              }
            }

            if (br) break;
            ++this.pos;
          }
        }

        return this._str.substr(startPos, this.pos - startPos);
      }
    }]);

    return fcfStringPointer;
  }();

  fcf.StringPointer = fcfStringPointer;

  fcf.parseObjectAddressEx = function (a_path) {
    var path = new fcf.StringPointer(a_path);
    return fcf._parseObjectAddressEx(path);
  };

  fcf._parseObjectAddressEx = function (a_path) {
    var result = [];

    var skipSpaces = function skipSpaces() {
      while (a_path.pos < a_path.posend && a_path._str[a_path.pos].charCodeAt(0) <= 32) {
        ++a_path.pos;
      }
    };

    var readSimple = function readSimple() {
      var buf = "";

      while (a_path.pos < a_path.posend) {
        var c = a_path._str[a_path.pos];
        if (c == "." || c == "[" || c == "]") break;
        buf += c;
        ++a_path.pos;
      }

      result.push(buf);
    };

    var readArr = function readArr() {
      var buf = "";
      skipSpaces();
      var c = a_path._str[a_path.pos];
      var quote = c == "\"" || c == "'" ? c : false;

      if (quote) {
        ++a_path.pos;
        var slash = 0;

        while (a_path.pos < a_path.posend) {
          var c = a_path._str[a_path.pos];

          if (c == quote && slash % 2 == 0) {
            ++a_path.pos;
            break;
          }

          if (c === "\\") ++slash;else slash = 0;
          buf += c;
          ++a_path.pos;
        }

        buf = fcf.replaceAll(buf, "\\\\", "\\");
        buf = fcf.replaceAll(buf, "\\" + quote, quote);

        while (a_path.pos < a_path.posend) {
          var c = a_path._str[a_path.pos];

          if (c == "]") {
            ++a_path.pos;
            break;
          }

          ++a_path.pos;
        }

        result.push(buf);
      } else {
        result.push(fcf._parseObjectAddressEx(a_path));
      }
    };

    while (a_path.pos < a_path.posend) {
      var p = a_path.pos;
      var c = a_path._str[a_path.pos];
      if (c == "]") break;

      if (c == ".") {
        ++a_path.pos;
        continue;
      }

      if (c == "[") {
        ++a_path.pos;
        readArr();
      } else {
        readSimple();
      }

      if (p == a_path.pos) ++a_path.pos;
    }

    for (var i = 0; i < result.length; ++i) {
      result[i] = result[i].replace("\\[", "[").replace("\\]", "]");
    }

    return result;
  };

  fcf.parseObjectAddress = function (a_path) {
    var state = 0;
    var key = "";
    var result = []; //var slashCounter = 0;

    var slashCounterMode = false; //0 read
    //1 read arr
    //2 read arr quote
    //3 read arr double quote
    //4 close simple
    //5 close arr
    //6 close arr quote
    //7 close arr double quote

    for (var i = 0; i < a_path.length; ++i) {
      var newState = state;
      var inserted = false;
      var c = a_path[i];

      if (state === 0) {
        if (c === "[") {
          newState = 1;
        } else if (c === ".") {
          newState = 4;
        }
      } else if (state === 1) {
        if (c === "'") {
          newState = 2;
        } else if (c === "\"") {
          newState = 3;
        } else if (c === "]") {
          newState = 5;
        }
      } else if (state === 2) {
        if (c === "'") {
          if (!slashCounterMode) newState = 6;
        }
      } else if (state === 3) {
        if (c === "\"") {
          if (!slashCounterMode) newState = 7;
        }
      } else if (state === 5) {
        if (c === "[") {
          newState = 1;
        } else if (c === ".") {
          newState = 0;
          state = 0;
          continue;
        }
      } else if (state === 6) {
        if (c === "]") {
          newState = 5;
        }
      } else if (state === 7) {
        if (c === "]") {
          newState = 5;
        }
      }

      if (c == "\\") {
        slashCounterMode = !slashCounterMode;
      } else {
        slashCounterMode = false;
      }

      if (newState == state && newState < 4) {
        if (!slashCounterMode) key += c;
      } else if (newState == 1 && key.length) {
        result.push(key);
        key = "";
      } else if (newState == 4) {
        newState = 0;
        result.push(key);
        key = "";
      } else if (newState == 5) {
        result.push(key);
        key = "";
      }

      state = newState;
    }

    if (key !== "") result.push(key);
    return result;
  };

  fcf.resolveEx = function (a_obj, a_path, a_createObj) {
    var pathArr = fcf.parseObjectAddress(a_path);
    var result = {
      key: undefined,
      object: undefined
    };
    var cur = a_obj;

    for (var i = 0; i < pathArr.length - 1; ++i) {
      var key;

      if (Array.isArray(pathArr[i])) {
        var itm = fcf.resolveEx(a_obj, pathArr[i], a_createObj);
        key = itm.object[itm.key];
      } else {
        key = pathArr[i];
      }

      if (typeof cur[key] !== "object") if (a_createObj) cur[key] = {};else return result;
      cur = cur[key];
    }

    var key;

    if (Array.isArray(pathArr[pathArr.length - 1])) {
      var itm = fcf.resolveEx(a_obj, pathArr[pathArr.length - 1], a_createObj);
      key = itm.object[itm.key];
    } else {
      key = pathArr[pathArr.length - 1];
    }

    result.key = key;
    result.object = cur;
    return result;
  };

  fcf.resolve = function (a_obj, a_path) {
    if (typeof a_obj !== "object") return;

    if (Array.isArray(a_path)) {
      var cur = a_obj;

      for (var i = 0; i < a_path.length; ++i) {
        if (typeof cur != "object") return;
        if (!(a_path[i] in cur)) return;
        cur = cur[a_path[i]];
      }

      return cur;
    }

    var state = 0;
    var key = "";
    var cur = a_obj;
    var slashCounterMode = false; //0 read
    //1 read arr
    //2 read arr quote
    //3 read arr double quote
    //4 close simple
    //5 close arr
    //6 close arr quote
    //7 close arr double quote

    for (var i = 0; i < a_path.length; ++i) {
      var newState = state;
      var c = a_path[i];

      if (state === 0) {
        if (c === "[") {
          newState = 1;
        } else if (c === ".") {
          newState = 4;
        }
      } else if (state === 1) {
        if (c === "'") {
          newState = 2;
        } else if (c === "\"") {
          newState = 3;
        } else if (c === "]") {
          newState = 5;
        }
      } else if (state === 2) {
        if (c === "'") {
          if (!slashCounterMode) newState = 6;
        }
      } else if (state === 3) {
        if (c === "\"") {
          if (!slashCounterMode) newState = 7;
        }
      } else if (state === 5) {
        if (c === "[") {
          newState = 1;
        } else if (c === ".") {
          newState = 0;
          state = 0;
          continue;
        }
      } else if (state === 6) {
        if (c === "]") {
          newState = 5;
        }
      } else if (state === 7) {
        if (c === "]") {
          newState = 5;
        }
      }

      if (c == "\\") {
        slashCounterMode = !slashCounterMode;
      } else {
        slashCounterMode = false;
      }

      if (key.length && state == 0 && newState == 1) {
        cur = cur[key];
        key = "";
      }

      if (newState == state && newState < 4) {
        if (!slashCounterMode) key += c;
      } else if (newState == 4) {
        newState = 0;
        cur = cur[key];
        key = "";
      } else if (newState == 5) {
        cur = cur[key];
        key = "";
      }

      state = newState;
      if (cur === undefined) return;
    }

    if (key !== "") cur = cur[key];
    return cur;
  };

  fcf.padEnd = function (a_str, a_len, a_fill) {
    if (typeof a_fill !== "string" || a_fill.length == 0) a_fill = " ";
    var result = a_str;
    if (result.length >= a_len) return result;
    var с = Math.floor((result.length - a_len) / a_fill.length);

    for (var i = 0; i < с; ++i) {
      result += a_fill;
    }

    var d = (result.length - a_len) % a_fill.length;
    if (d) result += a_fill.substr(0, d);
    return result;
  };

  fcf.serial = function (a_part) {
    var sm = fcf.NDetails.serial__map;
    if (!(a_part in sm)) sm[a_part] = 0;
    return ++sm[a_part];
  };

  fcf.getLastSerial = function (a_part) {
    var sm = fcf.NDetails.serial__map;
    if (!(a_part in sm)) sm[a_part] = 0;
    return sm[a_part];
  };

  fcf.NDetails.serial__map = {};

  fcf.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  };

  fcf.genId = function (a_part) {
    var def = a_part === '' || a_part === false || a_part === undefined;
    if (def) a_part = fcf.isServer() ? "__fcfserver_" : "__fcf_";
    var id = a_part;
    if (fcf.application) id += "_" + (fcf.application && fcf.application.getSettings() ? fcf.application.getSettings().port : 0);
    id += "_" + Date.now();
    id += "_" + fcf.serial(a_part);
    return id;
  };

  fcf.getLastId = function (a_part) {
    var def = a_part === '' || a_part === false || a_part === undefined;
    if (def) a_part = fcf.isServer() ? "__fcfserver_" : "__fcf_";
    return a_part + "_" + fcf.getLastSerial(a_part);
  };

  fcf.NPath = {};

  fcf.NPath.concat = function (a_left, a_right) {
    if (!a_left || a_left.length == 0) return a_right;else if (!a_right || a_right.length == 0) return a_left;else if (a_left.slice(-1) == '/') return a_left + a_right;else return a_left + "/" + a_right;
  };

  fcf.hash = function (a_str) {
    var hash = 0,
        i,
        chr;
    if (a_str.length === 0) return hash;

    for (i = 0; i < a_str.length; i++) {
      chr = a_str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }

    return hash;
  };

  fcf.equal = function (a_left, a_right) {
    if (!fcf._equalObject(a_left, a_right)) return false;
    return fcf._equalObject(a_right, a_left);
  };

  fcf._equalObject = function (a_left, a_right) {
    if (Array.isArray(a_left)) {
      if (!Array.isArray(a_right)) return false;
      if (a_left.length != a_right.length) return false;

      for (var i = 0; i < a_left.length; ++i) {
        fcf.equal(a_left[i], a_right[i]);
      }
    } else if (typeof a_left === "object") {
      if (typeof a_right !== "object") return false;

      for (var key in a_left) {
        if (a_left[key] !== undefined && !(key in a_right)) return false;

        fcf._equalObject(a_left[key], a_right[key]);
      }
    } else {
      if (a_left != a_right) {
        return false;
      }
    }

    return true;
  };

  fcf.objects = {};
  fcf.NDetails.objEventCounter = 0;

  fcf.EventChannel = function (a_settings) {
    var self = this;
    this._owner = a_settings ? a_settings.owner : undefined;
    this._events = {};
    this._processesEvent = [];

    this.on = function (a_options) {
      if (typeof a_options == "string") {
        if (typeof arguments[1] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[1],
            once: false,
            globalEvent: false
          };
        } else if (typeof arguments[2] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[2],
            once: false,
            globalEvent: arguments[1]
          };
        } else {
          return;
        }
      }

      return this.attach.call(this, a_options);
    };

    this.once = function (a_options) {
      if (typeof a_options == "string") {
        if (typeof arguments[1] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[1],
            once: true,
            globalEvent: false
          };
        } else if (typeof arguments[2] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[2],
            once: true,
            globalEvent: arguments[1]
          };
        } else {
          return;
        }
      }

      return this.attach.call(this, a_options);
    };

    this.attach = function (a_options) {
      if (typeof a_options == "string") {
        if (typeof arguments[1] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[1],
            once: false,
            globalEvent: false
          };
        } else if (typeof arguments[2] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[2],
            once: arguments[1],
            globalEvent: false
          };
        } else if (typeof arguments[3] == "function") {
          a_options = {
            name: arguments[0],
            function: arguments[3],
            once: arguments[1],
            globalEvent: arguments[2]
          };
        } else {
          return;
        }
      }

      if (!(a_options.name in this._events)) this._events[a_options.name] = [];
      var level = fcf.range(a_options.level, 0, 10, 5);
      if (!this._events[a_options.name][level]) this._events[a_options.name][level] = {};
      var senderId = a_options.sender ? this._applyEventObjectId(a_options.sender) : this._applyEventObjectId(a_options.object);
      if (!this._events[a_options.name][level][senderId]) this._events[a_options.name][level][senderId] = {};
      var lintenerId = undefined;
      var lintenerItemId = undefined;
      var callinfo = {};

      if (a_options["function"]) {
        lintenerId = this._applyEventObjectId(a_options["function"]);
        lintenerItemId = lintenerId;
        callinfo["function"] = a_options["function"];
        callinfo.once = a_options.once;
        callinfo.globalEvent = a_options.globalEvent;
      } else {
        lintenerId = this._applyEventObjectId(a_options.object);
        var prefix = fcf.str(a_options.prefix);
        var suffix = a_options.suffix ? a_options.suffix : "on" + a_options.name.charAt(0).toUpperCase() + a_options.name.slice(1);
        var method = prefix + suffix;
        lintenerItemId = lintenerId + "#" + method;
        callinfo.object = a_options.object;
        callinfo.method = method;
        callinfo.once = a_options.once;
        callinfo.globalEvent = a_options.globalEvent;
      }

      if (!(lintenerId in this._events[a_options.name][level][senderId])) this._events[a_options.name][level][senderId][lintenerId] = {};
      this._events[a_options.name][level][senderId][lintenerId][lintenerItemId] = callinfo;
    }; //this.detach = function(a_eventName, a_object, a_methodName)
    //this.detach = function(a_eventName, a_object)
    //this.detach = function(a_eventName, a_func)
    //this.detach = function(a_func)


    this.detach = function (a_eventName, a_funcOrObject, a_method) {
      if (typeof a_eventName !== "string") {
        a_method = a_funcOrObject;
        a_funcOrObject = a_eventName;
        a_eventName = undefined;
      }

      if (a_eventName) {
        if (!(a_eventName in this._events)) return;

        for (var level = 0; level < this._events[a_eventName].length; ++level) {
          if (!this._events[eventName][level]) continue;

          for (var senderId in this._events[a_eventName][level]) {
            var listenerId = this._applyEventObjectId(a_funcOrObject);

            if (!(listenerId in this._events[a_eventName][level][senderId])) continue;
            if (a_methodName) delete this._events[a_eventName][level][senderId][listenerId][a_methodName];else delete this._events[a_eventName][level][senderId];
          }
        }
      } else {
        for (var eventName in this._events) {
          for (var level = 0; level < this._events[eventName].length; ++level) {
            if (!this._events[eventName][level]) continue;

            for (var senderId in this._events[eventName][level]) {
              var listenerId = this._applyEventObjectId(a_funcOrObject);

              if (!(listenerId in this._events[eventName][level][senderId])) continue;
              if (a_method) delete this._events[eventName][level][senderId][listenerId][a_method];else delete this._events[eventName][level][senderId];
            }
          }
        }
      }
    };

    this.emit = function (a_event, a_data) {
      return this.send(a_event, a_data);
    };

    this.send = function (a_event, a_data) {
      if (typeof a_event == "string") {
        a_event = new fcf.Event(a_event, a_data);
      } else {
        if (typeof a_data == "object") a_event = fcf.append(new fcf.Event(), a_event, a_data);
      }

      var name = a_event.name;
      if (!this._events[name]) return fcf.actions();
      var calls = [];

      for (var level = 0; level < this._events[name].length; ++level) {
        if (!this._events[name][level]) continue;

        for (var senderId in this._events[name][level]) {
          for (var listenerId in this._events[name][level][senderId]) {
            var rm = [];

            for (var listenerItemId in this._events[name][level][senderId][listenerId]) {
              var callinfo = this._events[name][level][senderId][listenerId][listenerItemId];

              if (callinfo["function"]) {
                calls.push({
                  cb: callinfo["function"],
                  object: undefined,
                  info: callinfo
                });
              } else if (callinfo.object) {
                if (callinfo.object[callinfo.method]) {
                  calls.push({
                    cb: callinfo.object[callinfo.method],
                    object: callinfo.object,
                    info: callinfo
                  });
                }
              }

              if (callinfo.once) rm.push(listenerItemId);
            }

            for (var i = 0; i < rm.length; ++i) {
              delete this._events[name][level][senderId][listenerId][rm[i]];
            }
          }
        }
      }

      var actions = fcf.actions();

      for (var i = 0; i < calls.length; ++i) {
        (function (i) {
          var globalEvent = false;
          actions.then(function () {
            if (calls[i].info.globalEvent) globalEvent = true;
            return calls[i].cb.call(calls[i].object, a_event);
          }).exec(function (a_act) {
            if (!globalEvent || !fcf.isServer()) {
              a_act.complete();
              return;
            }

            if (a_event.prohibitionGlobal) {
              a_act.complete();
              return;
            }

            var message = JSON.stringify(a_event);
            fcf.actions().each(self._processesEvent, function (a_subact, a_key, a_info) {
              if (fcf.application.getControlPort() == a_info.port && (a_info.host == "localhost" || a_info.host == "121.0.0.1")) {
                a_subact.complete();
                return;
              }

              try {
                var client = new libNet.Socket();
                client.connect(a_info.port, a_info.host, function () {
                  try {
                    client.write(message.length + "\n" + message);
                  } catch (e) {
                    a_subact.complete();
                  }
                });
                client.on("data", function (a_data) {
                  a_subact.complete();
                });
                client.on("error", function (a_data) {
                  a_subact.complete();
                });
              } catch (e) {}
            }).then(function () {
              a_act.complete();
            });
          });
        })(i);
      }

      return actions;
    };

    this._applyEventObjectId = function (a_obj) {
      if (typeof a_obj != "object" && typeof a_obj != "function") return;
      if (!(this._getParamIdName() in a_obj)) a_obj[this._getParamIdName()] = this._getId();
      return a_obj[this._getParamIdName()];
    };

    this.setProcessEnvironment = function (a_processesEvent) {
      this._processesEvent = a_processesEvent;
    };

    this._getParamIdName = function () {
      return "_fcfeventchannelid";
    };

    this._getId = function () {
      return fcf.genId("_ec");
    };
  };

  fcf._eventMessages = {};
  fcf.NDetails.amdEventChannel = new fcf.EventChannel();
  fcf.NDetails.amdModules = {};
  fcf.NDetails.amdWatchFiles = {}; //fcf.NDetails.amdLoader = function(a_sourceName, a_modules, a_callback, a_exMode) {

  fcf.NDetails.amdLoader = function (a_sourceName, a_modules, a_options, a_callback, a_exMode) {
    if (typeof a_options === "function") {
      a_exMode = a_callback;
      a_callback = a_options;
      a_options = undefined;
    }

    if (!a_options) a_options = {};
    this._options = fcf.append({
      showError: true
    }, a_options);
    this._sourceName = a_sourceName;
    this._callback = a_callback;
    this._modules = a_modules;
    this._exMode = !!a_exMode;
    this._complete = false;
    this._frid = fcf.genId();
    fcf.NDetails.amdEventChannel.attach({
      name: "load",
      object: this
    });
    fcf.NDetails.amdEventChannel.attach({
      name: "fullload",
      object: this
    });
    fcf.NDetails.amdEventChannel.attach({
      name: "errorLoad",
      object: this
    });

    this.load = function () {
      var state = this._load(this._modules);

      if (state.state === "ok") {
        if (this._complete) return;
        var result = [];
        if (this._exMode) result.push(undefined);

        for (var key in a_modules) {
          var moduleName = typeof a_modules[key] === "object" ? a_modules[key].module : a_modules[key];
          result.push(fcf.NDetails.amdModules[moduleName].result);
        }

        fcf.NDetails.amdEventChannel.detach(this);
        this._complete = true;

        this._callback(result);
      }

      if (state.state === "error") {
        var result = [];
        if (this._exMode) result.push(state.state.error);
        fcf.NDetails.amdEventChannel.detach(this);
        this._complete = true;

        this._callback(result);
      }
    };

    this._load = function (a_modules) {
      var result = {
        state: "ok"
      };

      for (var key in a_modules) {
        var moduleName = typeof a_modules[key] === "object" ? a_modules[key].module : a_modules[key];

        if (!(moduleName in fcf.NDetails.amdModules)) {
          this._loadData(a_modules[key]);
        }

        if (moduleName in fcf.NDetails.amdModules && fcf.NDetails.amdModules[moduleName].state == "ok") {
          continue;
        }

        if (moduleName in fcf.NDetails.amdModules && fcf.NDetails.amdModules[moduleName].state == "error") {
          result = {
            state: "error",
            error: fcf.NDetails.amdModules[moduleName].error
          };
          break;
        }

        result = {
          state: "wait"
        };
      }

      return result;
    };

    this._loadData = function (a_module) {
      var error = false;
      var self = this;
      var moduleName = typeof a_module == "object" ? a_module.module : a_module;
      var moduleUrl = typeof a_module == "object" ? a_module.url : a_module;
      fcf.NDetails.amdModules[moduleName] = {
        state: "wait",
        module: undefined
      };

      if (!fcf.isServer()) {
        var script = document.createElement('script');

        script.onload = function () {
          if (moduleName != fcf.NDetails.amdLastModulesName) fcf.NDetails.amdModules[moduleName] = fcf.NDetails.amdModules[fcf.NDetails.amdLastModulesName];
          fcf.NDetails.amdEventChannel.send({
            name: "load",
            uri: moduleName
          });
        };

        script.onerror = function () {
          fcf.NDetails.amdEventChannel.send({
            name: "errorLoad",
            uri: moduleName,
            error: new fcf.Exception("ERROR_FILE_NOT_FOUND", {
              file: moduleName
            })
          });
        };

        script.src = fcf.getPath(moduleUrl);
        script.sync = false;
        script.async = true;
        script.defer = false;
        document.head.appendChild(script);
      } else {
        var module = undefined;
        var path = fcf.getPath(moduleUrl);

        if (!libFS.existsSync(path)) {
          error = new fcf.Exception("ERROR_FILE_NOT_FOUND", {
            file: path
          });
        } else {
          try {
            module = require(path);
          } catch (except) {
            error = except;
          }
        }

        if (error) {
          if (error.code == "MODULE_NOT_FOUND" || error.name == "ERROR_FILE_NOT_FOUND") {
            if (this._sourceName) {
              if (this._options.showError) console.error("Can't load module '" + moduleName + "' by path '" + path + "' from source '" + this._sourceName + "'");
            } else {
              if (this._options.showError) console.error("Can't load module '" + moduleName + "' by path '" + path + "'");
            }
          }

          fcf.NDetails.amdEventChannel.send({
            name: "errorLoad",
            uri: moduleName,
            error: error
          });
          if (!this._exMode) throw error;
        }

        if (!error) {
          fcf.NDetails.amdEventChannel.send({
            name: "load",
            uri: moduleName
          });

          var _path = fcf.getPath(moduleName);

          if (!fcf.NDetails.amdWatchFiles[_path]) {
            fcf.NDetails.amdWatchFiles[_path] = true;
            libFS.watchFile(_path, {
              interval: 1000
            }, function (a_fileName, a_eventName) {
              delete fcf.NDetails.amdModules[moduleName];
              delete require.cache[_path];
            });
          }
        }
      }
    };

    this.onLoad = function (a_event) {
      this.load();
    };

    this.onFullload = function (a_event) {
      this.load();
    };

    this.onErrorLoad = function (a_event) {
      fcf.NDetails.amdModules[a_event.uri].state = "error";
      fcf.NDetails.amdModules[a_event.uri].error = a_event.error;
      var syntaxError = a_event.error.toString().indexOf("SyntaxError:") != -1;
      if (syntaxError) fcf.log.err("fcf", "Can't load module", a_event.uri, a_event.error);

      if (!this._exMode) {
        if (syntaxError) delete fcf.NDetails.amdModules[a_event.uri];
        return;
      }

      var selfModule = a_event.uri == this._sourceName;
      if (!selfModule) selfModule = fcf.find(this._modules, function (k, v) {
        return v == a_event.uri;
      }) !== undefined;
      if (!selfModule) return;
      var result = [];
      result.push(a_event.error);

      for (var key in this._modules) {
        var moduleName = typeof this._modules[key] === "object" ? this._modules[key].module : this._modules[key];
        result.push(fcf.NDetails.amdModules[moduleName].result);
      }

      fcf.NDetails.amdEventChannel.detach(this);
      if (syntaxError) delete fcf.NDetails.amdModules[a_event.uri];
      this._complete = true;

      this._callback(result);
    };
  };

  fcf.NDetails._filters = {};

  fcf.loadFilters = function (a_typesOrViews) {
    if (fcf.isServer()) return fcf.actions();
    var types = {};
    var conf = fcf.application.getConfiguration().get("filters");
    var error = undefined;
    fcf.each(a_typesOrViews, function (k, v) {
      var type = typeof v == "object" ? v.type : v;
      if (type in fcf.NDetails._filters) return;

      if (!(type in conf)) {
        error = new fcf.Exception("ERROR_INCORRECT_DATA_TYPE", {
          type: type
        });
        return;
      }

      types[type] = conf[type];
    });
    if (fcf.empty(types)) return fcf.actions();

    if (error) {
      return fcf.actions().append(function (a_act) {
        a_act.error(error);
      }).startup();
    }

    return fcf.actions().asyncEach(types, function (a_act, a_type, a_file) {
      fcf.requireEx([a_file], function (a_error, a_module) {
        if (a_error) {
          a_act.error(a_error);
        } else {
          fcf.NDetails._filters[a_type] = new a_module();
          a_act.complete();
        }
      });
    }).startup();
  };

  fcf.getFilter = function (a_typesOrViews) {
    var type = typeof a_typesOrViews == "object" ? a_typesOrViews.type : a_typesOrViews;
    if (!(type in fcf.NDetails._filters)) throw new fcf.Exception("ERROR_NOT_LOADED_FILTER", {
      type: type
    });
    return fcf.NDetails._filters[type];
  };

  fcf.getExtension = function (a_path) {
    a_path = a_path.split("?")[0];
    var arr = a_path.split(".");
    return arr[arr.length - 1];
  };

  fcf.getShortFileName = function (a_path) {
    var offset = 0;

    for (var p = 0; p < a_path.length; ++p) {
      var c = a_path.charAt(p);
      if (c == ":" || c == "/") offset = p;
    }

    return a_path.substr(offset + 1).split(".")[0];
  };

  fcf.getFileName = function (a_path) {
    var offset = 0;

    for (var p = 0; p < a_path.length; ++p) {
      var c = a_path.charAt(p);
      if (c == ":" || c == "/") offset = p;
    }

    if (offset) offset += 1;
    return a_path.substr(offset);
  }; //fcf.getPath = function(a_modURI, a_innerServerPath);


  fcf.getPath = function (a_modURI, a_aliases, a_innerServerPath) {
    return fcf.replaceAll(fcf._getPath(a_modURI, a_aliases, a_innerServerPath, false), "/./", "/");
  };

  fcf.getFullPath = function (a_modURI, a_aliases, a_innerServerPath) {
    return fcf.replaceAll(fcf._getPath(a_modURI, a_aliases, a_innerServerPath, true), "/./", "/");
  };

  fcf._getPath = function (a_modURI, a_aliases, a_innerServerPath, a_fullMode) {
    if (typeof a_aliases !== "object") {
      a_innerServerPath = a_aliases;
      a_aliases = undefined;
    }

    if (!a_aliases && fcf.application) {
      var theme = fcf.application.getThemes().getTheme(undefined, true);
      if (theme) a_aliases = theme.getAliases();
    }

    if (fcf.empty(a_aliases) && fcf.application) {
      a_aliases = fcf.application.getConfiguration().getConfiguration().aliases;
    }

    if (a_innerServerPath === undefined) a_innerServerPath = fcf.isServer();

    if (!a_innerServerPath) {
      if (a_modURI.charAt(0) != "@" && a_modURI.indexOf(":") == -1) return a_modURI;
      if (a_modURI.indexOf("://") != -1) return a_modURI;
      if (a_modURI.charAt(0) == ":") return "/" + a_modURI.substr(1);
    } else {
      if (a_modURI.charAt(0) == ":") {
        var result = a_modURI.substr(1);
        return !result ? "." : result;
      }
    }

    if (a_modURI.charAt(0) == "@") {
      var slashPos = a_modURI.indexOf("/");
      var prefix = slashPos != -1 ? a_modURI.substr(0, slashPos) : undefined;
      var suffix = slashPos != -1 ? a_modURI.substr(slashPos) : undefined;

      if (prefix) {
        a_modURI = prefix;
      }

      var urlData = fcf.parseUrl(a_modURI);
      var key = urlData.referer.substr(1);

      if (a_aliases && a_aliases[key]) {
        a_modURI = fcf.buildUrl(a_aliases[key], urlData.getArgs);
        if (a_fullMode) a_modURI = a_modURI.split("+")[0];
      }

      if (suffix) {
        a_modURI += suffix;
      }
    } // if the local path


    if (a_innerServerPath) {
      if (a_modURI.indexOf("/") == 0 || a_modURI.indexOf("://") != -1 || a_modURI.indexOf(":\\") != -1) {
        return a_modURI;
      }
    } else {
      if (a_modURI.indexOf("/") == 0 || a_modURI.indexOf("://") != -1) {
        return a_modURI;
      }
    }

    var libraries = fcf.settings.libraries ? fcf.settings.libraries : {};
    var modItems = a_modURI.split(":");
    var libName = modItems.length > 1 ? modItems[0] : "";
    var modName = modItems.length > 1 ? modItems[1] : modItems[0];
    var root = a_innerServerPath ? fcf.settings.innerRoot : fcf.settings.outerRoot;
    var libRPath = libName;
    if (a_innerServerPath && fcf.settings.libraries && libName && libName in fcf.settings.libraries) libRPath = a_innerServerPath ? fcf.settings.libraries[libName].path : "fcfpackages/" + libName;else if (!a_innerServerPath && a_modURI.indexOf(":") !== -1) libRPath = "fcfpackages/" + libName;
    if (a_innerServerPath && libRPath == "") libRPath = ".";
    var absoluteLibPath = libRPath.indexOf("/") == 0 || libRPath.indexOf(":\\") != -1;
    var libPath = !absoluteLibPath ? fcf.NPath.concat(root, libRPath) : libRPath;
    var modPath = fcf.NPath.concat(libPath, modName);
    return modPath;
  };

  fcf.addModule = function (a_name, a_dirPath, a_rootUrl) {
    fcf.settings.libraries[a_name] = {
      url: a_rootUrl,
      path: a_dirPath
    };
  };

  fcf.getModules = function () {
    return fcf.settings.libraries;
  };

  fcf.getModule = function (a_moduleName) {
    return fcf.NDetails.amdModules[a_moduleName].module;
  };

  fcf.require = function (a_modules, a_func) {
    var loader = new fcf.NDetails.amdLoader(false, a_modules, function (a_result) {
      if (a_func) a_func.apply(undefined, a_result);
    });
    loader.load();
  }; // fcf.requireEx = function(a_modules, a_func)


  fcf.requireEx = function (a_modules, a_options, a_func) {
    if (typeof a_options == "function") {
      a_func = a_options;
      a_options = undefined;
    }

    if (!a_options) a_options = {};
    var loader = new fcf.NDetails.amdLoader(false, a_modules, a_options, function (a_result) {
      if (a_func) a_func.apply(undefined, a_result);
    }, true);
    loader.load();
  };

  fcf.module = function (a_module) {
    if (!(a_module.name in fcf.NDetails.amdModules)) {
      fcf.NDetails.amdModules[a_module.name] = {};
    }

    fcf.NDetails.amdLastModulesName = a_module.name;
    fcf.NDetails.amdModules[a_module.name].state = "loaded";
    fcf.NDetails.amdModules[a_module.name].module = a_module;

    if (fcf.isServer()) {
      var fullPath = fcf.getPath(a_module.name);
      fcf.NDetails.amdModules[fullPath] = fcf.NDetails.amdModules[a_module.name];
    }

    var dependencies = a_module.dependencies ? a_module.dependencies : [];
    var loader = new fcf.NDetails.amdLoader(a_module.name, dependencies, function (a_result) {
      fcf.NDetails.amdModules[a_module.name].state = "ok";
      a_module.result = a_module.module.apply(a_module, a_result);
      fcf.NDetails.amdModules[a_module.name].result = a_module.result;
      fcf.NDetails.amdEventChannel.send({
        name: "fullload",
        uri: a_module.name
      });
    });
    loader.load();
  }; // fcf.require(["fcf:NTest/Test"], function(Test){
  // });


  fcf.prepareObject(fcf, "NFSQL");
  fcf.prepareObject(fcf, "NDetails");

  fcf.getProjection = function (a_propjection) {
    return fcf.application.getProjections().get(a_propjection);
  };

  fcf.NDetails.clientVariables = undefined;

  fcf.getSystemVariable = function (a_package, a_variable) {
    if (a_variable == undefined) {
      a_variable = a_package.split(":")[1];
      a_package = a_package.split(":")[0];
    }

    var vars = undefined;

    if (fcf.isServer()) {
      vars = fcf.NTools.cache.get("fcf", "variables");
    } else {
      if (!fcf.NDetails.clientVariables) {
        fcf.loadObject({
          path: "/fcfpackages/fcf/variables",
          async: false
        }).then(function (a_data) {
          fcf.NDetails.clientVariables = a_data;
        });
      }

      vars = fcf.NDetails.clientVariables;
    }

    if (!vars[a_package]) return;
    return vars[a_package][a_variable];
  };

  fcf.setSystemVariable = function (a_package, a_name, a_value) {
    if (typeof a_value == "object" && a_value !== null) {
      a_value = JSON.stringify(a_value);
    }

    var query = {
      type: "update",
      from: "fcf_variables",
      values: [{
        field: "value",
        value: a_value
      }],
      where: [{
        logic: "and",
        type: "=",
        args: [{
          field: "package"
        }, {
          value: a_package
        }]
      }, {
        logic: "and",
        type: "=",
        args: [{
          field: "name"
        }, {
          value: a_name
        }]
      }]
    };
    return fcf.application.getStorage().query({
      query: query
    }).then(function (a_result) {
      var value = undefined;

      if (a_result[0] && a_result[0][0]) {
        value = a_result[0][0].value;

        try {
          if (typeof value == "string" && (value.charAt(0) == "[" || value.charAt(0) == "{")) value = JSON.parse(value);
        } catch (e) {}
      }

      return value;
    });
  };

  fcf.Message = function (a_name, a_message, a_args, a_subMessage) {
    if (typeof a_message !== "string") {
      a_subMessage = a_args;
      a_args = a_message;
      a_message = "";
    }

    if (typeof arguments[0] === 'string') {
      this.directionalСall = false;
      this.name = a_name;
      this.subEvent = a_subMessage;
      this._templateMessage = a_message;

      if (Array.isArray(a_args)) {
        for (var i = 0; i < a_args.length; ++i) {
          this[i + 1] = a_args[i];
        }

        this.length = a_args.length;
      } else {
        fcf.append(this, a_args);
      }
    } else {
      fcf.append(this, arguments[0]);
      delete this.message;
    }

    this.toString = function (a_enableDefaultLanguage) {
      var lang = a_enableDefaultLanguage && fcf.isServer() && fcf.getSystemVariable("fcf", "defaultLanguage") ? fcf.getSystemVariable("fcf", "defaultLanguage") : undefined;
      var message = fcf.t(this._templateMessage, lang);

      for (var k in this) {
        var arg = typeof this[k] === 'object' && this[k] !== null && 'toString' in this[k] ? this[k].toString() : this[k];
        message = fcf.replaceAll(message, "${{" + k + "}}$", arg);
      }

      if (this.subEvent) {
        var subText = "\n" + this.subEvent.toString();
        fcf.replaceAll(subText, "\n", "\n    ");
        message += subText;
      }

      this.message = message;
      return message;
    };

    this.message = this.toString();
  };

  fcf.NDetails.messages = {};

  fcf.addException = function (a_messageName, a_messageText) {
    fcf.NDetails.messages[a_messageName] = a_messageText;
  };

  fcf.error = function (a_part, a_error, a_throw) {
    fcf.log.err(a_part, a_error);
  };

  fcf.Exception = function (a_messageName, a_args, a_subEvent) {
    var messageTemplate = fcf.NDetails.messages[a_messageName];
    fcf.Message.call(this, a_messageName, messageTemplate, a_args, a_subEvent);
    var steckTxt = typeof console === "object" && console.trace === "function" ? console.trace() : new Error().stack;

    if (steckTxt === undefined) {
      try {
        throw new Error();
      } catch (e) {
        steckTxt = e.stack;
      }
    }

    this.stackArr = fcf.Exception.parseStack(steckTxt, 1);
  };

  fcf.Exception.is = function (a_exception, a_name) {
    return typeof a_exception === "object" && a_exception !== null && a_exception.name && a_exception.name == a_name;
  };

  fcf.Exception.parseStack = function (a_stackTxt, a_startLevel) {
    if (a_startLevel === undefined) a_startLevel = 0;
    var result = [];
    var stackArr = a_stackTxt.split("\n");

    for (var i = a_startLevel + 1; i < stackArr.length; ++i) {
      var level = {};
      var endPosFunc = stackArr[i].indexOf("(");
      var posInfoArr = stackArr[i].substr(endPosFunc + 1, stackArr[i].length - endPosFunc - 2).split(":");
      level["function"] = stackArr[i].substr(7, endPosFunc - 8);
      level.file = posInfoArr[0];
      level.line = posInfoArr[posInfoArr.length - 2];
      level.column = posInfoArr[posInfoArr.length - 1];
      result.push(level);
    }

    return result;
  };

  fcf.Event = function (a_name, a_data) {
    this.name = a_name;
    if (typeof a_data == "object") fcf.append(this, a_data);
  };

  fcf.addException("ERROR_404", "Page not found ${{address}}$");
  fcf.addException("ERROR_TEST_OPEN_DIRECTORY", "Unable to open the '${{directory}}$' directory for reading");
  fcf.addException("ERROR_TEST_FAILED_EQUAL", "The value '${{1}}$' is not equal to '${{2}}$'");
  fcf.addException("ERROR_TEST_FAILED_NOT_EQUAL", "The value '${{1}}$' must not be equal to ' ${{2}}$'");
  fcf.addException("ERROR_TEST_FAILED_EQUAL_OBJECT", "The value '${{1}}$' is not equal to '${{2}}$ ' in the '${{3}}$' object");
  fcf.addException("ERROR_TEST_FAILED_EQUAL_OBJECT_ITEM_NOT_FOUND", "The '${{element}}$' element is missing from the '${{object}}$' object");
  fcf.addException("ERROR_TEST_FAILED_EQUAL_OBJECT_ARG2_NOT_OBJECT", "Argument 2 is not an object in the object '${{1}}$'");
  fcf.addException("ERROR_TEST_FAILED_EQUAL_OBJECT_ARG2_NOT_ARRAY", "Argument 2 is not an array in the object  '${{1}}$'");
  fcf.addException("ERROR_TEST_FAILED_EQUAL_OBJECT_LENGTH_ARRAY", "The array size of the first array (${{1}}$) is not equal to the size of the second (${{2}}$) in the '${{3}}$' object");
  fcf.addException("ERROR", "${{error}}$"); // + stack 

  fcf.addException("ERROR_FILE_NOT_FOUND", "File ${{file}}$ not found");
  fcf.addException("ERROR_FORM_INPUT", "Incorrectly filled out form"); // Исключение должно содержать массив errors
  // new fcf.Exception("ERROR_FORM_INPUT", {errors: errors})

  fcf.addException("ERROR_READ_FILE", "Failed to read the file ${{1}}$ (${{2}}$)");
  fcf.addException("ERROR_READ_NOT_FILE", "Failed to read the file ${{1}}$ (The specified path is not a file)");
  fcf.addException("ERROR_READ_FORMAT_FILE", "Invalid file format ${{file}}$");
  fcf.addException("ERROR_INCORRECT_FORMAT_HANDLER", "Invalid format of the request handler ${{file}}$");
  fcf.addException("ERROR_REQUEST_PARAMETER_NOT_SET", "The request parameter ${{1}}$ is not set");
  fcf.addException("ERROR_REQUEST_PARAMETER_NOT_VALID", "Invalid request parameter format ${{1}}$");
  fcf.addException("ERROR_ASYNC_ACTIONS_CLOSED", "Adding a method to a completed execution queue");
  fcf.addException("ERROR_EVAL_TEMPL", "Execution error in the template ${{1}}$[${{2}}$:${{3}}$]");
  fcf.addException("ERROR_EVAL_SCRIPT", "Execution error in the file ${{1}}$[${{2}}$]");
  fcf.addException("ERROR_INCORRECT_TEMPL_REQUEST_WRAPPER", "Wrapper request to an unavailable template ${{template}}$");
  fcf.addException("ERROR_NOSET_GET_ARG", "The required GET request parameter '${{arg}}$' was omitted");
  fcf.addException("ERROR_INCORRECT_DATA_TYPE", "Invalid data type '${{type}}$'");
  fcf.addException("ERROR_NOT_LOADED_FILTER", "Data filter not loaded for \"${{type}}$\" type use fcf.loadFilter() method");
  fcf.addException("ERROR_HTTP_REQUEST_ERROR", "HTTP request failed ${{1}}$");
  fcf.addException("ERROR_HTTP_REQUEST_OBJECT_FORMAT", "The server returned a response not in JSON format (${{data}}$)");
  fcf.addException("ERROR_HTTP_ARG_NOT_SET", "The '${{arg}}$' argument in the request to the server is not set");
  fcf.addException("ERROR_TEMPLATE_VIEWS_NOT_SET_DATA_FILED", "The views data field in the ${{template}}$ template is not set");
  fcf.addException("ERROR_UNKNOWN_PROJECTION", "An unknown '${{projection}}$' projection is requested");
  fcf.addException("ERROR_UNKNOWN_FIELD_TYPE", "An unknown '${{param}}$' type in '${{projection}}$' projection");
  fcf.addException("ERROR_INCORRECT_PROJECTION_PARAM_NOT_SET", "The '${{param}}$' parameter for the '${{projection}}$' projection is not set");
  fcf.addException("ERROR_UNKNOWN_PROJECTION_IN_JOIN", "Projection '${{joinProjection}}$' was not found in the join block for projection '${{projection}}$'");
  fcf.addException("ERROR_PROJECTION_UNSET_WHERE", "The where block is not set in the '${{projection}}$' projection");
  fcf.addException("ERROR_PROJECTION_UNSET_ALIAS", "The 'alias' property of field in the '${{projection}}$' projection is not set");
  fcf.addException("ERROR_PROJECTION_UNSET_TYPE", "The 'type' property of field in the '${{projection}}$' projection is not set");
  fcf.addException("ERROR_SAFE_EVAL_ERROR_COMMAND", "safeEval() does not allow 'while', 'for', '=>', 'function', 'class' constructs");
  fcf.addException("ERROR_SAFE_EVAL_ERROR_LENGTH", "the maximum length of safeEval must not exceed ${{length}}$");
  fcf.NDetails.safeEnv = {};
  fcf.NDetails.safeEnvIsEmpty = true;

  fcf.rebuildEvalEnvironment = function () {
    fcf.NDetails.safeEnv.eval = eval;
    fcf.NDetails.safeEnv.fcf = fcf.append({}, fcf.NDetails.safeFcf);
    fcf.NDetails.safeEnv.fcf.tools = fcf.append({}, fcf.NDetails.safeFcf.tools);
  };

  fcf.NDetails.evalFunctions = {};

  fcf.NDetails.safeEvalResult_findKeyWord = function (a_code, a_word, a_nextChar) {
    var pos = a_code.indexOf(a_code, a_word);
    if (a_code.indexOf(a_code, a_word) == -1) return false;
    pos += a_word.length;

    while (pos < a_code.length) {
      if (a_code.charCodeAt(pos) <= 32) {
        if (a_nextChar == undefined) return true;
        ++pos;
        continue;
      }

      if (a_nextChar == a_code.charAt(pos)) return true;else return false;
    }

    return false;
  };

  fcf.safeEvalResult = function (a_evalCode, a_evalEnvironment) {
    var context = fcf.getContext();
    var safeEnv = context && context.get("safeEnv") ? context.get("safeEnv") : {};
    var result = undefined;
    var func = fcf.NDetails.evalFunctions[a_evalCode];

    if (!func) {
      var foundErrorCommand = false;
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "while", "(");
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "for", "(");
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "function");
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "=>", "{");
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "class");
      foundErrorCommand |= fcf.NDetails.safeEvalResult_findKeyWord(a_evalCode, "goto");
      if (foundErrorCommand) throw new fcf.Exception("ERROR_SAFE_EVAL_ERROR_COMMAND");
      if (a_evalCode.length > 512) throw new fcf.Exception("ERROR_SAFE_EVAL_ERROR_LENGTH", {
        length: 512
      });
      func = eval("(function fcfsafeEvalResult79323(a_env, a_args){ var result = undefined; with(a_env) { with(a_args) { result = " + a_evalCode + "} }; return result})");
      fcf.NDetails.evalFunctions[a_evalCode] = func;
    }

    result = func(safeEnv, a_evalEnvironment);
    fcf.NDetails.safeEnv.getContext = fcf.getContext;
    return result;
  };

  var FCFScriptExecutor = /*#__PURE__*/function () {
    "use strict";

    function FCFScriptExecutor() {
      _classCallCheck(this, FCFScriptExecutor);

      this._funcStorage = {};
      this._dataFuncStorage = {};
    }

    _createClass(FCFScriptExecutor, [{
      key: "execute",
      value: function execute(a_code, a_args, a_file, a_startLine) {
        var self = this;
        var error = undefined;

        this._execute(a_code, a_args, a_file, a_startLine, function (a_code, a_args) {
          var func = undefined;
          var code = undefined;

          try {
            if (self._funcStorage[a_file] && self._funcStorage[a_file][a_startLine]) {
              func = self._funcStorage[a_file][a_startLine].func;
              code = self._funcStorage[a_file][a_startLine].code;
            } else {
              code = "(function fcfinnerevalfunction(a_args){";

              for (var key in a_args) {
                code += "var " + key + " = a_args." + key + ";";
              }

              code += a_code + " })";
              func = eval(code);
              if (!self._funcStorage[a_file]) self._funcStorage[a_file] = {};
              self._funcStorage[a_file][a_startLine] = {
                func: func,
                code: code
              };
            }

            func(a_args);
          } catch (e) {
            error = e;
          }

          self = undefined;
          return {
            code: code,
            error: error,
            result: undefined
          };
        });
      }
    }, {
      key: "parse",
      value: function parse(a_code, a_args, a_file, a_startLine) {
        var self = this;
        var error = undefined;
        return this._execute(a_code, a_args, a_file, a_startLine, function (a_code, a_args) {
          var func = undefined;
          var code = undefined;
          var result = undefined;

          try {
            if (self._funcStorage[a_file] && self._funcStorage[a_file][a_startLine]) {
              func = self._funcStorage[a_file][a_startLine].func;
              code = self._funcStorage[a_file][a_startLine].code;
            } else {
              code = "(function fcfinnerevalfunction(a_args){";

              for (var key in a_args) {
                code += "var " + key + " = a_args." + key + ";";
              }

              code += "var result = (" + a_code + "); return result; })";
              func = eval(code);
              if (!self._funcStorage[a_file]) self._funcStorage[a_file] = {};
              self._funcStorage[a_file][a_startLine] = {
                func: func,
                code: code
              };
            }

            result = func(a_args);
          } catch (e) {
            error = e;
          }

          self = undefined;
          return {
            code: code,
            error: error,
            result: result
          };
        });
      }
    }, {
      key: "_execute",
      value: function _execute(a_code, a_args, a_file, a_startLine, a_handler) {
        var handlerResult = a_handler(a_code, a_args);

        if (handlerResult.error) {
          a_startLine = a_startLine ? a_startLine : 0;
          var stack = handlerResult.error.stackArr ? handlerResult.error.stackArr : fcf.Exception.parseStack(handlerResult.error.stack);
          var line = undefined;

          for (var i = 0; i < stack.length; ++i) {
            if (stack[i].file.indexOf("eval at") == 0 || stack[i].file.indexOf("fcfEvalTmpl7652492") == 0) {
              line = parseInt(stack[i].line) + a_startLine;
              break;
            }
          }

          if (fcf.isServer() && line === undefined) {
            var path = fcf.getPath(":cache/errors/" + fcf.uuid() + ".js");

            try {
              libFS.writeFileSync(path, handlerResult.code);

              try {
                libChildProcess.execSync("fcfnode " + process.cwd() + "/" + path);
              } catch (e) {
                var beg = e.message.indexOf("js:");

                if (beg != -1) {
                  var end = e.message.indexOf("\n", beg);
                  var strinfo = e.message.substr(beg + 3, end - beg - 3);
                  strinfo = fcf.trim(strinfo, ")");
                  if (strinfo) line = parseInt(strinfo) + a_startLine;
                }
              }

              try {
                libFS.unlinkSync(path);
              } catch (e) {}
            } catch (e) {}
          }

          line = !line && !a_startLine ? 0 : !line ? a_startLine : line;
          throw new fcf.Exception("ERROR_EVAL_SCRIPT", [a_file, line], handlerResult.error);
        }

        return handlerResult.result;
      }
    }]);

    return FCFScriptExecutor;
  }();

  ;
  fcf.scriptExecutor = new FCFScriptExecutor();
  fcf.NDetails.downloadStorage = {};

  fcf.load = function (a_options) {
    var clError = function clError(a_error, a_data) {
      if (a_data) {
        var subErrorContent = undefined;

        try {
          var obj = JSON.parse(a_data);

          if (obj.error) {
            a_error.subEvent = fcf.append(new fcf.Exception("ERROR"), obj.error);
            a_error.toString();
          }
        } catch (e) {
          a_error.subEvent = new fcf.Exception("ERROR", {
            error: fcf.tagRemoval(a_data)
          });
          a_error.toString();
        }
      }

      if (a_options.onResult) a_options.onResult(a_error, a_data);
    };

    return fcf.actions().exec(function (a_act) {
      var path = fcf.getPath(a_options.path, a_options.aliases);
      var resData = undefined;

      if (fcf.isServer()) {
        path = path.split("+")[0];
        libFS.readFile(path, 'utf8', function (a_error, a_data) {
          resData = a_data;

          if (a_error) {
            var error = new fcf.Exception("ERROR_READ_FILE", [a_options.path, a_error]);
            clError(error);
            a_act.error(error);
          } else {
            if (a_options.onResult) a_options.onResult(undefined, resData);
            a_act.complete(resData);
          }
        });
      } else {
        if (fcf.application.getSettings().fileСaching) {
          var extension = fcf.getExtension(a_options.path);

          if (extension == "js" || extension == "tmpl") {
            if (fcf.NDetails.downloadStorage[a_options.path]) {
              if (a_options.onResult) a_options.onResult(undefined, fcf.NDetails.downloadStorage[a_options.path]);
              a_act.complete(fcf.NDetails.downloadStorage[a_options.path]);
              return;
            }
          }
        }

        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
              resData = xmlHttp.responseText;

              if (fcf.application.getSettings().fileСaching) {
                var extension = fcf.getExtension(a_options.path);

                if (extension == "js" || extension == "tmpl") {
                  fcf.NDetails.downloadStorage[a_options.path] = resData;
                }
              }

              if (a_options.onResult) a_options.onResult(undefined, resData);
              a_act.complete(resData);
            } else {
              resData = xmlHttp.responseText;
              var data = fcf.strToObject(resData);
              var error = undefined;

              if (typeof data === "object") {
                if (data._templateMessage) {
                  error = new fcf.Exception();
                  error.message = undefined;
                  error.toString();
                  fcf.append(error, data);
                } else if (data.message) {
                  error = new fcf.Exception("ERROR", {
                    error: data.message,
                    stack: data.stack
                  });
                  fcf.append(error, data);
                }
              }

              if (error === undefined) {
                error = new fcf.Exception("ERROR_HTTP_REQUEST_ERROR", [xmlHttp.status]);
              }

              clError(error, resData);
              a_act.error(error);
            }
          }
        };

        if (!fcf.empty(a_options.get)) path = fcf.buildUrl(path, a_options.get);
        var async = a_options.async !== undefined ? a_options.async : true;
        xmlHttp.open("POST", path, async);
        var isSendCookie = a_options.path[0] == "@" || a_options.path[0] == "/" || a_options.path.indexOf(window.location.hostname + ":") == 0;

        if (!fcf.empty(a_options.post)) {
          if (a_options.post instanceof FormData) {
            xmlHttp.send(a_options.post);
          } else {
            xmlHttp.setRequestHeader("Content-Type", "application/json");
            if (isSendCookie) xmlHttp.send(JSON.stringify(fcf.append(a_options.post, {
              _fcfContext: fcf.getContext()
            })));else xmlHttp.send(JSON.stringify(a_options.post));
          }
        } else {
          if (isSendCookie) xmlHttp.send(JSON.stringify({
            _fcfContext: fcf.getContext()
          }));else xmlHttp.send(null);
        }
      }
    });
  };

  fcf.loadObject = function (a_options) {
    return fcf.actions().exec(function (a_act) {
      fcf.load({
        path: a_options.path,
        aliases: a_options.aliases,
        post: a_options.post,
        get: a_options.get,
        async: a_options.async,
        onResult: function onResult(a_error, a_data) {
          a_data = fcf.strToObject(a_data);

          if (typeof a_data !== "object") {
            a_error = new fcf.Exception("ERROR_HTTP_REQUEST_OBJECT_FORMAT", {
              data: a_data
            });
          }

          if (a_options.onResult) a_options.onResult(a_error, a_data);
          if (fcf.empty(a_error)) a_act.complete(a_data);else a_act.error(a_error);
        }
      });
    });
  };

  fcf.parseUrl = function (a_url) {
    var result = {};
    var sep = a_url.indexOf('?');

    if (sep === -1) {
      result.url = a_url;
      result.referer = a_url;
      result.getArgs = {};
    } else {
      var rawQuery = a_url.substr(sep + 1);
      result.referer = a_url.substr(0, sep);
      result.url = a_url;
      result.getArgs = {};
      var arr = fcf.str(rawQuery).split('&');

      for (var i = 0; i < arr.length; ++i) {
        var val = arr[i].split('=');
        result.getArgs[decodeURIComponent(fcf.str(val[0]))] = decodeURIComponent(fcf.str(val[1]));
      }
    }

    if (result.referer[0] == '/') {
      result.path = result.referer.substr(1);
      result.server = '';
      result.protocol = '';
    } else {
      var pos = result.referer.indexOf('://');

      if (pos !== -1) {
        var pos2 = result.referer.indexOf('/', pos + 3);

        if (pos2 === -1) {
          result.path = '/';
          result.server = result.referer.substr(pos + 3);
          result.protocol = result.referer.substr(0, pos);
        } else {
          result.path = result.referer.substr(pos2);
          result.server = result.referer.substr(pos + 3, pos2 - (pos + 3));
          result.protocol = result.referer.substr(0, pos);
        }
      } else {
        result.server = '';
        result.protocol = '';
        result.path = result.referer;
      }
    }

    result.args = fcf.append({}, result.getArgs);
    return result;
  };

  fcf.getHistoryItemFromUrl = function (a_url) {
    var url = fcf.parseUrl(a_url);
    var history = url.getArgs['fcfHistory'];
    if (!history) return;
    var arr = history.split(';');
    return arr[arr.length - 1];
  };

  fcf.buildUrl = function (a_url, a_args) {
    if (fcf.empty(a_args)) return a_url;
    var urlInfo = fcf.parseUrl(a_url);
    a_url = urlInfo.referer;
    a_args = fcf.append({}, urlInfo.args, a_args);
    var first = true;

    for (var k in a_args) {
      if (first) a_url += a_url.indexOf('?') != -1 ? '&' : '?';else a_url += '&';
      a_url += k;
      a_url += '=';

      if (typeof a_args[k] != 'object') {
        a_url += encodeURIComponent(fcf.str(a_args[k]));
      } else {
        a_url += encodeURIComponent(JSON.stringify(a_args[k]));
      }

      first = false;
    }

    return a_url;
  };

  fcf.link = function (a_options, a_aliases
  /* = undefined*/
  ) {
    a_options = typeof a_options === "string" ? {
      url: a_options
    } : typeof a_options === "object" ? a_options : {};
    if (!a_aliases) a_aliases = {};
    var url = fcf.getPath(fcf.str(a_options.url), a_aliases, false);
    var urlInfo = fcf.parseUrl(url);
    var args = fcf.append({}, urlInfo.getArgs);

    if ('fcfHistory' in urlInfo.getArgs) {
      args['fcfHistory'] = urlInfo.getArgs['fcfHistory'];
      if (typeof urlInfo.query == "object") delete urlInfo.query['fcfHistory'];
      url = fcf.buildUrl(urlInfo.referer, urlInfo.getArgs);
    }

    if (a_options.args) fcf.append(args, a_options.args);
    if (a_options.getArgs) fcf.append(args, a_options.getArgs);

    if (a_options.history || a_options.history === '') {
      if (args['fcfHistory']) args['fcfHistory'] += ';';else args['fcfHistory'] = '';
      args['fcfHistory'] += encodeURIComponent(fcf.getPath(a_options.history, false));
    }

    return fcf.buildUrl(urlInfo.referer, args);
  };

  fcf.actions = function (a_initializeOptions) {
    var result = undefined;

    if (a_initializeOptions instanceof fcf.Actions) {
      result = a_initializeOptions;
    } else if (typeof Promise !== "undefined" && a_initializeOptions instanceof Promise) {
      result = new fcf.Actions();
      result.exec(function (a_act) {
        a_initializeOptions.then(function () {
          a_act.complete();
        })["catch"](function (a_error) {
          a_act.error(a_error);
        });
      });
    } else {
      result = new fcf.Actions(a_initializeOptions);
    }

    return result;
  };

  var fcfActions = /*#__PURE__*/function () {
    "use strict";

    function fcfActions(a_initializeOptions) {
      _classCallCheck(this, fcfActions);

      this._stack = [];
      this._current = undefined;
      this._error = undefined;
      this._ecbs = [];
      this.result = undefined;
      this._end = false;
      this._lastAction = undefined;
      this._context = fcf.getContext();
      this._settings = fcf.append({
        onComplete: function onComplete() {},
        onError: function onError(a_error) {}
      }, a_initializeOptions);
    }

    _createClass(fcfActions, [{
      key: "append",
      value: function append(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;
        this._lastAction = {
          cb: a_cb,
          args: a_args,
          actions: [],
          id: fcf.genId(),
          autoComplete: false
        };

        this._stack.push(this._lastAction);

        return this;
      }
    }, {
      key: "appendAC",
      value: function appendAC(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;
        this._lastAction = {
          cb: a_cb,
          args: a_args,
          actions: [],
          id: fcf.genId(),
          autoComplete: true
        };

        this._stack.push(this._lastAction);

        return this;
      }
    }, {
      key: "preAppend",
      value: function preAppend(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;
        var info = {
          cb: a_cb,
          args: a_args,
          actions: [],
          id: fcf.genId(),
          autoComplete: false
        };
        if (!this._lastAction) this._lastAction = info;

        this._stack.unshift(info);

        return this;
      }
    }, {
      key: "preAppendAC",
      value: function preAppendAC(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;
        var info = {
          cb: a_cb,
          args: a_args,
          actions: [],
          id: fcf.genId(),
          autoComplete: true
        };
        if (!this._lastAction) this._lastAction = info;

        this._stack.unshift(info);

        return this;
      }
    }, {
      key: "postAppend",
      value: function postAppend(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;

        if (!this._lastAction) {
          this.append(a_cb, a_args);
        } else {
          var action = {
            cb: a_cb,
            args: a_args,
            actions: [],
            id: fcf.genId(),
            autoComplete: false
          };

          this._lastAction.actions.push(action);

          this._lastAction = action;
        }

        return this;
      }
    }, {
      key: "postAppendAC",
      value: function postAppendAC(a_cb, a_args) {
        if (this._error) return;
        if (this._end) return;

        if (!this._lastAction) {
          this.append(a_cb, a_args);
        } else {
          var action = {
            cb: a_cb,
            args: a_args,
            actions: [],
            id: fcf.genId(),
            autoComplete: true
          };

          this._lastAction.actions.push(action);

          this._lastAction = action;
        }

        return this;
      }
    }, {
      key: "exec",
      value: function exec(a_cb, a_args) {
        this.append(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "execAC",
      value: function execAC(a_cb, a_args) {
        this.appendAC(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "preExec",
      value: function preExec(a_cb, a_args) {
        this.preAppend(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "preExecAC",
      value: function preExecAC(a_cb, a_args) {
        this.preAppendAC(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "postExec",
      value: function postExec(a_cb, a_args) {
        this.postAppend(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "postExecAC",
      value: function postExecAC(a_cb, a_args) {
        this.postAppendAC(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "then",
      value: function then(a_cb, a_args) {
        this.appendAC(a_cb, a_args);
        this.startup();
        return this;
      }
    }, {
      key: "catch",
      value: function _catch(a_cb) {
        if (this._error) {
          if (a_cb) a_cb(this._error);
        } else {
          this._ecbs.push(a_cb);
        }

        return this;
      }
    }, {
      key: "preEach",
      value: function preEach(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.preAppend(a_cb, [k, v]);
          });
        } else {
          this.preAppendAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: false
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
          });
        }

        return this;
      }
    }, {
      key: "each",
      value: function each(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.append(a_cb, [k, v]);
          });
        } else {
          this.appendAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: false
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
          });
        }

        return this;
      }
    }, {
      key: "asyncEach",
      value: function asyncEach(a_object, a_cb) {
        var self = this;
        var result = undefined;
        var counter = fcf.count(a_object);
        var _error = undefined;
        if (counter == 0) return this;
        this.append(function (a_act) {
          var subaction = {
            complete: function complete(a_result) {
              if (!counter) retrun;
              --counter;
              if (a_result !== undefined) result = a_result;

              if (!counter) {
                if (_error) a_act.error(_error);else a_act.complete(result);
              }
            },
            error: function error(a_error) {
              if (!counter) retrun;
              --counter;
              _error = a_error;

              if (!counter) {
                if (_error) a_act.error(_error);else a_act.complete(result);
              }
            }
          };
          fcf.each(a_object, function (k, v) {
            fcf.setContext(self._context);
            var subRes = a_cb(subaction, k, v);
            if (subRes !== undefined) result = subRes;
          });
        });
        return this;
      }
    }, {
      key: "eachExec",
      value: function eachExec(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.exec(a_cb, [k, v]);
          });
        } else {
          this.execAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: false
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
            self.startup();
          });
        }

        return this;
      }
    }, {
      key: "preEachExec",
      value: function preEachExec(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.preExec(a_cb, [k, v]);
          });
        } else {
          this.preExecAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: false
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
            self.startup();
          });
        }

        return this;
      }
    }, {
      key: "eachAC",
      value: function eachAC(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.appendAC(a_cb, [k, v]);
          });
        } else {
          this.appendAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: true
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
          });
        }

        return this;
      }
    }, {
      key: "preEachAC",
      value: function preEachAC(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.preAppendAC(a_cb, [k, v]);
          });
        } else {
          this.preAppendAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              var action = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: true
              };
              if (!self._lastAction) action = self._lastAction;

              self._stack.unshift(action);
            });
          });
        }

        return this;
      }
    }, {
      key: "eachExecAC",
      value: function eachExecAC(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.execAC(a_cb, [k, v]);
          });
        } else {
          this.execAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              self._lastAction = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: true
              };

              self._stack.unshift(self._lastAction);
            });
            self.startup();
          });
        }

        return this;
      }
    }, {
      key: "preEachExecAC",
      value: function preEachExecAC(a_obj, a_cb) {
        var self = this;

        if (typeof a_obj !== "function") {
          fcf.foreach(a_obj, function (k, v) {
            self.preExecAC(a_cb, [k, v]);
          });
        } else {
          this.preExecAC(function () {
            a_obj = a_obj();
            fcf.foreach(a_obj, function (k, v) {
              if (self._error) return;
              if (self._end) return;
              self._lastAction = {
                cb: a_cb,
                args: [k, v],
                actions: [],
                id: fcf.genId(),
                autoComplete: true
              };

              self._stack.unshift(self._lastAction);
            });
            self.startup();
          });
        }

        return this;
      }
    }, {
      key: "startup",
      value: function startup() {
        if (this._error) return;
        if (this._current) return;

        this._exec();

        return this;
      }
    }, {
      key: "error",
      value: function error(a_error) {
        this._error = a_error;
        if (typeof this._settings.onError === "object" && typeof this._settings.onError.error === "function") this._settings.onError.error(a_error);else this._settings.onError(a_error);

        for (var i = 0; i < this._ecbs.length; ++i) {
          this._ecbs[i](this._error);
        }
      }
    }, {
      key: "_exec",
      value: function _exec() {
        var self = this;

        if (this._stack.length == 0) {
          if (typeof self._settings.onComplete === "object" && typeof self._settings.onError.complete === "function") self._settings.onError.complete();else self._settings.onComplete();
          return;
        }

        var action = {
          _end: false,
          complete: function complete(a_value) {
            if (this._end) return;
            this._end = true;
            self.result = a_value;
            fcf.each(self._current.actions, function (a_key, a_action) {
              self._lastAction = a_action;

              self._stack.push(a_action);
            });
            self._current = undefined;
            if (self._error) return;

            self._exec();
          },
          error: function error(a_error) {
            if (this._end) return;
            this._end = true;
            self._end = true;
            self._error = a_error;
            if (typeof self._settings.onError === "object" && typeof self._settings.onError.error === "function") self._settings.onError.error(a_error);else self._settings.onError(a_error);

            for (var i = 0; i < self._ecbs.length; ++i) {
              self._ecbs[i](self._error);
            }
          }
        };

        var current = this._current = this._stack.shift();

        var startArgs = current.autoComplete ? [] : [action];
        var args = fcf.append(startArgs, this._current.args);
        args.push(self.result);
        var result = undefined;
        fcf.setContext(self._context);

        if (typeof Promise !== "undefined" && self._current.cb instanceof Promise || self._current.cb instanceof fcf.Actions) {
          result = self._current.cb;
        } else {
          try {
            result = self._current.cb.apply(undefined, args);
          } catch (error) {
            action.error(error);
            return;
          }
        }

        if (typeof Promise !== "undefined" && result instanceof Promise || result instanceof fcf.Actions) {
          result.then(function (a_res) {
            action.complete(a_res);
          });
          result["catch"](function (a_error) {
            action.error(a_error);
          });
        } else {
          if (result !== undefined) self.result = result;
          if (current.autoComplete) action.complete(result);
        }
      }
    }]);

    return fcfActions;
  }();

  fcf.Actions = fcfActions;

  fcf.stackDepth = function () {
    var c = fcf.stackDepth.caller,
        depth = 0;

    while (c && depth < 100000) {
      c = c.caller;
      depth++;
    }

    return depth;
  };

  fcf.getCallStackSize = function () {
    var count = 0,
        fn = _arguments.callee;

    while (fn = fn.caller) {
      count++;
    }

    return count;
  };

  if (!fcf.isServer()) {
    fcf.select = function (a_node, a_selector) {
      if (typeof a_node === 'string') {
        a_selector = a_node;
        return document.querySelectorAll(a_selector);
      } else if (!a_node) {
        return document.querySelectorAll(a_selector);
      } else if (a_node.querySelectorAll) {
        try {
          return a_node.querySelectorAll(a_selector);
        } catch (e) {
          if (a_node.innerHTML == "") return [];else throw e;
        }
      } else {
        return [];
      }
    };
  }

  fcf.RouteInfo = function (a_settings) {
    this.update = function (a_settings) {
      this.url = '';
      this.referer = '';
      this.getArgs = {};
      this.postArgs = {};
      this.path = '';
      this.subUri = '';
      this.route = '';
      if (typeof a_settings == "string") a_settings = {
        url: a_settings
      };

      if (a_settings.url) {
        this.url = a_settings.url;
        var qi = fcf.parseUrl(a_settings.url);
        this.getArgs = fcf.append(qi.getArgs, a_settings.getArgs);
        this.referer = qi.referer;
        this.path = qi.path;
        this.uri = fcf.ltrim(this.path, "/");
        this.route = this.uri;
        this.args = a_settings.args ? a_settings.args : {};
        this.url = fcf.link(this.url, this.getArgs);
      } else if (a_settings.request) {
        var request = a_settings.request.req ? a_settings.request.req : a_settings.request;
        this.url += request.protocol + '://';
        this.url += request.get('host');
        this.url += request.originalUrl;
        var qi = fcf.parseUrl(this.url);
        this.args = a_settings.args ? a_settings.args : {};
        this.getArgs = fcf.append(qi.getArgs, a_settings.getArgs);
        this.referer = qi.referer;
        this.path = qi.path;
        this.uri = fcf.ltrim(this.path, "/");
        if (!fcf.empty(request.body)) this.postArgs = request.body;
        this.route = this.uri;
        this.url = fcf.link(this.url, this.getArgs);
      }

      if (a_settings.route) {
        this.setRoute(a_settings.route);
      }

      var processGetArgs = function processGetArgs(a_args) {
        for (var k in a_args) {
          var itm = a_args[k];
          var isJSON = typeof itm === "string" && itm.length >= 2 && (itm[0] === '{' && itm[itm.length - 1] === '}' || itm[0] === '[' && itm[itm.length - 1] === ']');
          if (isJSON) try {
            a_args[k] = JSON.parse(a_args[k]);
          } catch (e) {} else if (a_args[k] == "false") a_args[k] = false;else if (a_args[k] == "true") a_args[k] = true;else if (!isNaN(a_args[k])) a_args[k] = parseFloat(a_args[k]);
        }
      };

      processGetArgs(this.getArgs);
      this.args = this.getArgs;
      fcf.append(this.args, this.postArgs);

      if (this.args.fcfHistory) {
        this.backUrl = fcf.getHistoryItemFromUrl(this.url);
      }
    };

    this.setRoute = function (a_route) {
      this.route = a_route;
    };

    this.buildUrl = function () {
      return fcf.buildUrl(this.path, this.args);
    };

    this.update(a_settings);
  };

  var Logger = function Logger() {
    this.TST = 0;
    this.CRH = 10;
    this.ERR = 20;
    this.WRN = 30;
    this.LOG = 40;
    this.INF = 50;
    this.DBG = 60;
    this.TRC = 70;
    this._level = this.LOG;

    this.getLevel = function () {
      return this._level;
    };

    this.setLevel = function (a_level) {
      this._level = a_level;
    };

    this.tst = function (a_module, a_str) {
      var args = fcf.append([this.TST], arguments);

      this._logStr.apply(this, args);
    };

    this.crh = function (a_module, a_str) {
      var args = fcf.append([this.CRH], arguments);

      this._logStr.apply(this, args);
    };

    this.err = function (a_module, a_str) {
      var args = fcf.append([this.ERR], arguments);

      this._logStr.apply(this, args);
    };

    this.wrn = function (a_module, a_str) {
      var args = fcf.append([this.WRN], arguments);

      this._logStr.apply(this, args);
    };

    this.log = function (a_module, a_str) {
      var args = fcf.append([this.LOG], arguments);

      this._logStr.apply(this, args);
    };

    this.inf = function (a_module, a_str) {
      var args = fcf.append([this.INF], arguments);

      this._logStr.apply(this, args);
    };

    this.dbg = function (a_module, a_str) {
      var args = fcf.append([this.DBG], arguments);

      this._logStr.apply(this, args);
    };

    this.trc = function () {
      var args = fcf.append([this.TRC], arguments);

      this._logStr.apply(this, args);
    };

    this.write = function () {
      this._logStr.apply(this, arguments);
    };

    this._levelToStr = function (a_level) {
      return a_level <= this.TST ? "TST" : a_level <= this.CRH ? "CRH" : a_level <= this.ERR ? "ERR" : a_level <= this.WRN ? "WRN" : a_level <= this.LOG ? "LOG" : a_level <= this.INF ? "INF" : a_level <= this.DBG ? "DBG" : "TRC";
    };

    this._logStr = function (a_level, a_module) {
      if (a_level > this._level) return;
      var datetime = new Date();
      var output = "";
      output += datetime.toISOString().replace(/T/, ' ').replace(/[A-Za-z]+/, '');
      output += " [" + this._levelToStr(a_level) + "]";
      output += " [MOD:" + a_module + "]: ";
      var outputArr = [];
      outputArr.push(output);

      for (var i = 2; i < arguments.length; ++i) {
        if (fcf.isServer() && typeof arguments[i] == "object") {
          if (arguments[i] instanceof Error) outputArr.push(arguments[i]);else if (arguments[i] instanceof fcf.Exception) {
            arguments[i].toString(true);
            outputArr.push(JSON.stringify(arguments[i], 0, 2));
          } else {
            outputArr.push(JSON.stringify(arguments[i], 0, 2));
          }
        } else {
          outputArr.push(arguments[i]);
        }
      }

      console.log.apply(console, outputArr);

      if (fcf.isServer()) {
        libFS.appendFile("log/log.txt", outputArr.join(" ") + "\r\n", "utf-8", function () {});
      }
    };
  };

  fcf.log = new Logger();
  fcf.NDetails._wrappers = {};

  fcf.getWrapper = function (a_domElementOrId) {
    if (typeof a_domElementOrId != "object") {
      return fcf.NDetails._wrappers[a_domElementOrId];
    } else {
      var element = a_domElementOrId;

      while (element) {
        if (element.getAttribute("fcftemplate")) return fcf.NDetails._wrappers[element.getAttribute("id")];
        element = element.parentElement;
      }
    }
  };

  fcf.wasteCollectionForWrappers = function () {};

  fcf.getWrappersByalias = function (a_domElement, a_alias) {
    if (a_alias === undefined) {
      a_alias = a_domElement;
      a_domElement = document;
    }

    var items = fcf.select(a_domElement, "[fcfalias=" + a_alias + "]");
    var result = [];
    fcf.each(items, function (k, v) {
      var wrp = fcf.getWrapper(v);
      if (wrp) result.push(wrp);
    });
    return result;
  };

  fcf.arg = function (a_type, a_data) {
    return new fcf.Arg(a_type, a_data);
  };

  fcf.argVal = function (a_data) {
    if (typeof a_data === "object") return new fcf.Arg("value", a_data);else return new fcf.Arg("value", {
      value: a_data
    });
  };

  fcf.argRef = function (a_id, a_arg) {
    if (typeof a_id == "object") return new fcf.Arg("reference", a_data);else return new fcf.Arg("reference", {
      id: a_id,
      arg: a_arg
    });
  };

  fcf.argTmpl = function (a_template, a_data) {
    if (typeof a_template == "object") return new fcf.Arg("reference", a_data);else return new fcf.Arg("reference", fcf.append({}, a_data, {
      template: a_template
    }));
  };

  fcf.argProg = function (a_data) {
    return new fcf.Arg("programmable", a_data);
  };

  fcf.isArg = function (a_object) {
    return typeof a_object == "object" && a_object !== null && a_object["fcf.Arg"];
  };

  fcf.Arg = function (a_type, a_data) {
    this["fcf.Arg"] = true;
    this.type = a_type;
    fcf.append(this, a_data);

    if (this.type == "template" && fcf.NDetails.currentTemplate && this.template.charAt(0) == "+") {
      this.template = fcf.NDetails.currentTemplate.split("+")[0] + this.template;
    }
  };

  fcf.RenderResults = function () {
    this.items = [];
    this.map = [];

    this.toString = function () {
      var result = "";
      fcf.each(this.items, function (a_key, a_content) {
        result += a_content;
      });
      return result;
    };
  };

  fcf.NDetails.currentContext = undefined;
  fcf.NDetails.contextStorage = {};

  var FCFSafeContext = /*#__PURE__*/function () {
    "use strict";

    function FCFSafeContext() {
      _classCallCheck(this, FCFSafeContext);
    }

    _createClass(FCFSafeContext, [{
      key: "get",
      value: function get(a_variableName) {
        var result = fcf.getContext().get(a_variableName);
        if (a_variableName == "safeEnv") return result;
        return typeof result == "object" ? fcf.clone(result) : result;
      }
    }]);

    return FCFSafeContext;
  }();

  if (fcf.isServer()) {
    fcf.NDetails.globalObjects = Object.getOwnPropertyNames(_fcfGlobals());
  }

  fcf.Context = /*#__PURE__*/function () {
    "use strict";

    function FCFContext(a_obj) {
      _classCallCheck(this, FCFContext);

      var id = typeof a_obj == "object" && a_obj._id ? a_obj._id : fcf.uuid();
      this._id = id;
      fcf.NDetails.contextStorage[id] = this;
      fcf.append(fcf.NDetails.contextStorage[id], a_obj);
    }

    _createClass(FCFContext, [{
      key: "destroy",
      value: function destroy() {
        delete fcf.NDetails.contextStorage[this._id];
      }
    }, {
      key: "get",
      value: function get(a_variableName) {
        if (!(this._id in fcf.NDetails.contextStorage)) return;

        if (fcf.isServer() && a_variableName == "safeEnv" && !fcf.NDetails.contextStorage[this._id][a_variableName]) {
          var safeEnv = {};
          var gv = fcf.NDetails.globalObjects;

          for (var i = 0; i < gv.length; ++i) {
            safeEnv[gv[i]] = null;
          }

          safeEnv.eval = eval;
          safeEnv.fcf = fcf.append({}, fcf.NDetails.safeFcf);
          this.set("safeEnv", safeEnv);
        }

        var value = fcf.NDetails.contextStorage[this._id][a_variableName];
        if (typeof value == "object") return fcf.clone(value);else return value;
      }
    }, {
      key: "set",
      value: function set(a_variableName, a_value) {
        if (!(this._id in fcf.NDetails.contextStorage)) return;
        fcf.NDetails.contextStorage[this._id][a_variableName] = a_value;
        fcf.saveContext();
      }
    }]);

    return FCFContext;
  }();

  fcf.getContext = function () {
    return fcf.NDetails.currentContext;
  };

  fcf.getSafeContext = function () {
    return new FCFSafeContext();
  };

  fcf.setContext = function (a_context) {
    fcf.NDetails.currentContext = a_context;
  };

  fcf.saveContext = function () {
    if (fcf.isServer()) return;
    var sortCtxt = fcf.append({}, fcf.NDetails.currentContext);
    delete sortCtxt.route;
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = "_fcfContext=" + fcf.base64Encode(JSON.stringify(sortCtxt)) + "; path=/ ;" + expires;
  };

  fcf.NDetails._keyBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  fcf.base64Encode = function (input) {
    function utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode(c >> 6 | 192);
          utftext += String.fromCharCode(c & 63 | 128);
        } else {
          utftext += String.fromCharCode(c >> 12 | 224);
          utftext += String.fromCharCode(c >> 6 & 63 | 128);
          utftext += String.fromCharCode(c & 63 | 128);
        }
      }

      return utftext;
    }

    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = utf8Encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = (chr1 & 3) << 4 | chr2 >> 4;
      enc3 = (chr2 & 15) << 2 | chr3 >> 6;
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + fcf.NDetails._keyBase64.charAt(enc1) + fcf.NDetails._keyBase64.charAt(enc2) + fcf.NDetails._keyBase64.charAt(enc3) + fcf.NDetails._keyBase64.charAt(enc4);
    }

    return output;
  };

  fcf.base64Decode = function (input) {
    function utf8Decode(utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1);
          string += String.fromCharCode((c & 31) << 6 | c2 & 63);
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i + 1);
          c3 = utftext.charCodeAt(i + 2);
          string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          i += 3;
        }
      }

      return string;
    }

    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = fcf.NDetails._keyBase64.indexOf(input.charAt(i++));
      enc2 = fcf.NDetails._keyBase64.indexOf(input.charAt(i++));
      enc3 = fcf.NDetails._keyBase64.indexOf(input.charAt(i++));
      enc4 = fcf.NDetails._keyBase64.indexOf(input.charAt(i++));
      chr1 = enc1 << 2 | enc2 >> 4;
      chr2 = (enc2 & 15) << 4 | enc3 >> 2;
      chr3 = (enc3 & 3) << 6 | enc4;
      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = utf8Decode(output);
    return output;
  };

  fcf.getRoute = function () {
    return fcf.getContext().get("route");
  };

  fcf.query = function (a_options, a_cb) {
    var storage = fcf.application.getStorage();
    return storage.query.apply(storage, arguments);
  };

  fcf.NDetails._firstCallLiven = true;

  fcf.liven = function (a_domElement, a_parentIdOrDom, a_cb) {
    if (fcf.NDetails._firstCallLiven) {
      fcf.NDetails._firstCallLiven = false;

      var _elements = fcf.select("div[fcftemplate]");

      var templateMap = {};

      for (var i = 0; i < _elements.length; ++i) {
        var path = _elements[i].getAttribute("fcftemplate");

        if (!path) continue;
        templateMap[path] = true;
      }

      var wrappers = [];

      for (var template in templateMap) {
        var subpart = template.split("+")[1];
        var wrapperPath = template.split("+")[0];
        var url = wrapperPath.substr(0, wrapperPath.length - 5) + (subpart ? "+" + subpart : "") + ".wrapper.js";
        wrappers.push(url);
      }

      fcf.require(wrappers);
    }

    if (typeof a_domElement === "function") {
      a_cb = a_domElement;
      a_domElement = document.body;
    } else if (typeof a_parentIdOrDom === "function") {
      a_cb = a_parentIdOrDom;
      a_parentIdOrDom = undefined;
    }

    if (!a_domElement) a_domElement = document.body;
    var elements = a_parentIdOrDom ? fcf.select(a_domElement, "[fcfparent='" + (typeof a_parentId === "object" ? a_parentIdOrDom.getAttribute("id") : a_parentIdOrDom) + "'][fcftemplate]") : fcf.select(a_domElement, ":not([fcfparent])[fcftemplate]");
    var elements = a_parentIdOrDom ? fcf.select(a_domElement, "[fcfparent='" + (typeof a_parentIdOrDom === "object" ? a_parentIdOrDom.getAttribute("id") : a_parentIdOrDom) + "'][fcftemplate]") : a_domElement.getAttribute("fcftemplate") ? [a_domElement] : fcf.select(a_domElement, ":not([fcfparent])[fcftemplate]");
    new fcf.Actions({
      onComplete: function onComplete() {
        if (a_cb) a_cb();
      },
      onError: function onError(a_error) {
        if (a_cb) {
          a_cb(a_error);
        }
      }
    }).each(elements, function (a_done, a_key, a_element) {
      var object = fcf.NDetails._wrappers[a_element.getAttribute("id")];

      if (object) {
        fcf.readOnlyActivate(object.getId());
        object.reattach(function (a_error, a_object) {
          if (a_error) {
            a_done.error(a_error);
            return;
          }

          a_done.complete();
        });
        return;
      }

      var template = a_element.getAttribute("fcftemplate");
      var subpart = template.split("+")[1];
      var wrapperPath = template.split("+")[0];
      var url = wrapperPath.substr(0, wrapperPath.length - 5) + (subpart ? "+" + subpart : "") + ".wrapper.js";

      fcf.require([url], function (Wrapper) {
        var wrapper = new Wrapper({
          eventChannel: fcf.application.getEventChannel(),
          domElement: a_element,
          onReady: function onReady(a_error, a_self) {
            if (a_error) {
              a_done.error(a_error);
              return;
            }

            a_done.complete();
          }
        });
        wrapper.initialize();
      });
    }).startup();
  };

  if (!fcf.isServer()) {
    var oldEPD = Event.prototype.preventDefault;

    Event.prototype.preventDefault = function () {
      this.stopDefault = true;
      oldEPD.call(this);
    };
  }

  fcf.NDetails.domListenerCallbacks = {};

  fcf.NDetails.domListener = function (a_element, a_eventName, a_event) {
    if (typeof a_eventName == "object") {
      a_event = a_eventName;
      a_eventName = a_event.type;
    }

    var fcfevntid = a_element.getAttribute("fcfevntid");
    if (!fcfevntid || !fcf.NDetails.domListenerCallbacks[fcfevntid] || !fcf.NDetails.domListenerCallbacks[fcfevntid][a_eventName]) return;
    var callbacks = fcf.NDetails.domListenerCallbacks[fcfevntid][a_eventName];
    var result = undefined;

    for (var i = 0; i < callbacks.length; ++i) {
      var r = callbacks[i].cb.call(a_element, a_event);
      if (r !== undefined) result = r;
    }

    return result;
  };

  fcf.emitDomEvent = function (a_element, a_name, a_data) {
    if (fcf.empty(a_element)) return;

    if (typeof a_name == "object") {
      var event = a_name;
      a_name = event.type;
      fcf.append(event, a_data);
    } else {
      var event = document.createEvent('Event');
      event.initEvent(a_name, true, true);
      event.name = a_name;
      if (!event.type) event.type = a_name;
      fcf.append(event, a_data);
    }

    fcf.NDetails.domListener(a_element, a_name, event);
  };

  fcf.garbageCollector = function () {
    fcf.NDetails._removeDomListenerCallbacks();

    fcf.NDetails._removeWrappers();
  };

  fcf.NDetails._removeWrappers = function (a_runCyclically) {
    for (var id in fcf.NDetails._wrappers) {
      if (document.getElementById(id)) continue;
      delete fcf.NDetails._wrappers[id];
    }

    if (a_runCyclically) setTimeout(function () {
      fcf.NDetails._removeWrappers(true);
    }, 10000);
  };

  fcf.addDomListener = function (a_element, a_eventName, a_cb) {
    var fcfevntid = a_element.getAttribute("fcfevntid");

    if (!fcfevntid) {
      fcfevntid = fcf.genId("fcfevntid");
      a_element.setAttribute("fcfevntid", fcfevntid);
    }

    if (!fcf.NDetails.domListenerCallbacks[fcfevntid]) fcf.NDetails.domListenerCallbacks[fcfevntid] = {};
    if (!fcf.NDetails.domListenerCallbacks[fcfevntid][a_eventName]) fcf.NDetails.domListenerCallbacks[fcfevntid][a_eventName] = [];
    fcf.NDetails.domListenerCallbacks[fcfevntid][a_eventName].push({
      fcfevntid: fcfevntid,
      cb: a_cb
    });
    var code = "return fcf.NDetails.domListener(this, \"" + a_eventName + "\", event);";
    if (a_element.getAttribute("on" + a_eventName) != code) a_element.setAttribute("on" + a_eventName, code);
  };

  fcf.NDetails._removeDomListenerCallbacks = function (a_runCyclically) {
    for (var fcfevntid in fcf.NDetails.domListenerCallbacks) {
      var exists = !fcf.empty(fcf.select("[fcfevntid=" + fcfevntid + "]"));
      if (exists) continue;
      if (fcf.NDetails.domListenerCallbacks[fcfevntid]._fcfinner_remove) delete fcf.NDetails.domListenerCallbacks[fcfevntid];else fcf.NDetails.domListenerCallbacks[fcfevntid]._fcfinner_remove = true;
    }

    if (a_runCyclically) setTimeout(function () {
      fcf.NDetails._removeDomListenerCallbacks(true);
    }, 11000);
  };

  if (!fcf.isServer()) {
    fcf.NDetails._removeDomListenerCallbacks(true);

    fcf.NDetails._removeWrappers(true);
  }

  fcf.getClientRect = function (a_element) {
    var rects = a_element.getBoundingClientRect();
    return rects;
  };

  fcf.getHiddenContainer = function () {
    var element = document.getElementById("__fcf_hidden_container__");

    if (!element) {
      element = document.createElement("div");
      element.classList.add("fcf-hidden");
      document.body.appendChild(element);
    }

    return element;
  };

  fcf.readOnlyActivate = function (a_id) {
    var element = document.getElementById(a_id);
    var roelement = fcf.select(element, "[name=fcf-readonly]")[0];

    if (element && roelement) {
      var rect = element.getBoundingClientRect();
      roelement.style.display = "block";
      roelement.style.position = "absolute";
      roelement.style.height = rect.height + 12;
      roelement.style.width = rect.width + 5;
    }
  };

  fcf.NDetails._includes = {};

  fcf.include = function (a_fileOrFiles, a_cb) {
    var files = Array.isArray(a_fileOrFiles) ? a_fileOrFiles : [a_fileOrFiles];
    var actions = new fcf.Actions({
      onComplete: function onComplete() {
        a_cb();
      },
      onError: function onError(a_error) {
        a_cb(a_error);
      }
    });

    for (var i = 0; i < files.length; ++i) {
      var file = files[i];
      var url = fcf.getPath(file);
      if (url in fcf.NDetails._includes) continue;

      if (extension == "css") {
        var elements = fcf.select(document.head, "link");

        for (var i = 0; i < elements.length; ++i) {
          if (elements[i].href == url) {
            fcf.NDetails._includes[url] = true;
            break;
          }
        }
      } else if (extension == "js") {
        var elements = fcf.select(document.head, "script");

        for (var i = 0; i < elements.length; ++i) {
          if (elements[i].src == url) {
            fcf.NDetails._includes[url] = true;
            break;
          }
        }
      }

      if (url in fcf.NDetails._includes) continue;
      fcf.NDetails._includes[url] = true;
      var extension = fcf.getExtension(file).toLowerCase();

      if (extension == "css") {
        (function (url) {
          actions.append(function (a_act) {
            var element = document.createElement('link');
            element.rel = 'stylesheet';
            element.type = 'text/css';
            element.media = "all";
            element.href = url;

            element.onload = function () {
              a_act.complete();
            };

            element.onerror = function () {
              a_act.complete();
            };

            document.head.appendChild(element);
          });
        })(url);
      }

      if (extension == "js") {
        (function (url) {
          actions.append(function (a_act) {
            var element = document.createElement('script');
            element.src = url;

            element.onload = function () {
              a_act.complete();
            };

            element.onerror = function () {
              a_act.complete();
            };

            document.head.appendChild(imported);
          });
        })(url);
      }
    }

    actions.startup();
  };

  fcf.locker = function (a_options) {
    var args = {};
    if (a_options.context !== undefined) args.context = a_options.context;
    if (!fcf.empty(a_options.selector)) args.lockSelector = a_options.selector;
    fcf.application.render({
      template: "fcfControls:templates/locker.tmpl",
      owner: document.body,
      timeout: 500,
      args: args,
      onResult: function onResult(a_error, a_template) {
        if (a_options.onResult) a_options.onResult(a_error, a_template);
      }
    });
  };

  fcf.lz = function () {
    // private property
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};

    function getBaseValue(alphabet, character) {
      if (!baseReverseDic[alphabet]) {
        baseReverseDic[alphabet] = {};

        for (var i = 0; i < alphabet.length; i++) {
          baseReverseDic[alphabet][alphabet.charAt(i)] = i;
        }
      }

      return baseReverseDic[alphabet][character];
    }

    var LZString = {
      compressToBase64: function compressToBase64(input) {
        if (input == null) return "";

        var res = LZString._compress(input, 6, function (a) {
          return keyStrBase64.charAt(a);
        });

        switch (res.length % 4) {
          // To produce valid Base64
          default: // When could this happen ?

          case 0:
            return res;

          case 1:
            return res + "===";

          case 2:
            return res + "==";

          case 3:
            return res + "=";
        }
      },
      decompressFromBase64: function decompressFromBase64(input) {
        if (input == null) return "";
        if (input == "") return null;
        return LZString._decompress(input.length, 32, function (index) {
          return getBaseValue(keyStrBase64, input.charAt(index));
        });
      },
      compressToUTF16: function compressToUTF16(input) {
        if (input == null) return "";
        return LZString._compress(input, 15, function (a) {
          return f(a + 32);
        }) + " ";
      },
      decompressFromUTF16: function decompressFromUTF16(compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 16384, function (index) {
          return compressed.charCodeAt(index) - 32;
        });
      },
      //compress into uint8array (UCS-2 big endian format)
      compressToUint8Array: function compressToUint8Array(uncompressed) {
        var compressed = LZString.compress(uncompressed);
        var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character

        for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
          var current_value = compressed.charCodeAt(i);
          buf[i * 2] = current_value >>> 8;
          buf[i * 2 + 1] = current_value % 256;
        }

        return buf;
      },
      //decompress from uint8array (UCS-2 big endian format)
      decompressFromUint8Array: function decompressFromUint8Array(compressed) {
        if (compressed === null || compressed === undefined) {
          return LZString.decompress(compressed);
        } else {
          var buf = new Array(compressed.length / 2); // 2 bytes per character

          for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
            buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
          }

          var result = [];
          buf.forEach(function (c) {
            result.push(f(c));
          });
          return LZString.decompress(result.join(''));
        }
      },
      //compress into a string that is already URI encoded
      compressToEncodedURIComponent: function compressToEncodedURIComponent(input) {
        if (input == null) return "";
        return LZString._compress(input, 6, function (a) {
          return keyStrUriSafe.charAt(a);
        });
      },
      //decompress from an output of compressToEncodedURIComponent
      decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(input) {
        if (input == null) return "";
        if (input == "") return null;
        input = input.replace(/ /g, "+");
        return LZString._decompress(input.length, 32, function (index) {
          return getBaseValue(keyStrUriSafe, input.charAt(index));
        });
      },
      compress: function compress(uncompressed) {
        return LZString._compress(uncompressed, 16, function (a) {
          return f(a);
        });
      },
      _compress: function _compress(uncompressed, bitsPerChar, getCharFromInt) {
        if (uncompressed == null) return "";
        var i,
            value,
            context_dictionary = {},
            context_dictionaryToCreate = {},
            context_c = "",
            context_wc = "",
            context_w = "",
            context_enlargeIn = 2,
            // Compensate for the first entry which should not count
        context_dictSize = 3,
            context_numBits = 2,
            context_data = [],
            context_data_val = 0,
            context_data_position = 0,
            ii;

        for (ii = 0; ii < uncompressed.length; ii += 1) {
          context_c = uncompressed.charAt(ii);

          if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
            context_dictionary[context_c] = context_dictSize++;
            context_dictionaryToCreate[context_c] = true;
          }

          context_wc = context_w + context_c;

          if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
            context_w = context_wc;
          } else {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }

                value = context_w.charCodeAt(0);

                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | value & 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = value >> 1;
                }
              } else {
                value = 1;

                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = 0;
                }

                value = context_w.charCodeAt(0);

                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | value & 1;

                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }

                  value = value >> 1;
                }
              }

              context_enlargeIn--;

              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }

              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];

              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }

                value = value >> 1;
              }
            }

            context_enlargeIn--;

            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            } // Add wc to the dictionary.


            context_dictionary[context_wc] = context_dictSize++;
            context_w = String(context_c);
          }
        } // Output the code for w.


        if (context_w !== "") {
          if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
              }

              value = context_w.charCodeAt(0);

              for (i = 0; i < 8; i++) {
                context_data_val = context_data_val << 1 | value & 1;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }

                value = value >> 1;
              }
            } else {
              value = 1;

              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }

                value = 0;
              }

              value = context_w.charCodeAt(0);

              for (i = 0; i < 16; i++) {
                context_data_val = context_data_val << 1 | value & 1;

                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }

                value = value >> 1;
              }
            }

            context_enlargeIn--;

            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }

            delete context_dictionaryToCreate[context_w];
          } else {
            value = context_dictionary[context_w];

            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;

              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }

              value = value >> 1;
            }
          }

          context_enlargeIn--;

          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
        } // Mark the end of the stream


        value = 2;

        for (i = 0; i < context_numBits; i++) {
          context_data_val = context_data_val << 1 | value & 1;

          if (context_data_position == bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }

          value = value >> 1;
        } // Flush the last char


        while (true) {
          context_data_val = context_data_val << 1;

          if (context_data_position == bitsPerChar - 1) {
            context_data.push(getCharFromInt(context_data_val));
            break;
          } else context_data_position++;
        }

        return context_data.join('');
      },
      decompress: function decompress(compressed) {
        if (compressed == null) return "";
        if (compressed == "") return null;
        return LZString._decompress(compressed.length, 32768, function (index) {
          return compressed.charCodeAt(index);
        });
      },
      _decompress: function _decompress(length, resetValue, getNextValue) {
        var dictionary = [],
            next,
            enlargeIn = 4,
            dictSize = 4,
            numBits = 3,
            entry = "",
            result = [],
            i,
            w,
            bits,
            resb,
            maxpower,
            power,
            c,
            data = {
          val: getNextValue(0),
          position: resetValue,
          index: 1
        };

        for (i = 0; i < 3; i += 1) {
          dictionary[i] = i;
        }

        bits = 0;
        maxpower = Math.pow(2, 2);
        power = 1;

        while (power != maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;

          if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }

          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        switch (next = bits) {
          case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;

            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;

              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }

              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            c = f(bits);
            break;

          case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;

            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;

              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }

              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }

            c = f(bits);
            break;

          case 2:
            return "";
        }

        dictionary[3] = c;
        w = c;
        result.push(c);

        while (true) {
          if (data.index > length) {
            return "";
          }

          bits = 0;
          maxpower = Math.pow(2, numBits);
          power = 1;

          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          switch (c = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;

              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;

                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }

                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }

              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;

            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;

              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;

                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }

                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }

              dictionary[dictSize++] = f(bits);
              c = dictSize - 1;
              enlargeIn--;
              break;

            case 2:
              return result.join('');
          }

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }

          if (dictionary[c]) {
            entry = dictionary[c];
          } else {
            if (c === dictSize) {
              entry = w + w.charAt(0);
            } else {
              return null;
            }
          }

          result.push(entry); // Add w+entry[0] to the dictionary.

          dictionary[dictSize++] = w + entry.charAt(0);
          enlargeIn--;
          w = entry;

          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
        }
      }
    };
    return LZString;
  }();

  fcf.NDetails.safeFcf = {
    arg: fcf.arg,
    argVal: fcf.argVal,
    argRef: fcf.argRef,
    argTmpl: fcf.argTmpl,
    tools: fcf.tools,
    isServer: fcf.isServer,
    id: fcf.id,
    t: fcf.t,
    escapeQuotes: fcf.escapeQuotes,
    escapeChar: fcf.escapeChar,
    unescape: fcf.unescape,
    unescapeObject: fcf.unescapeObject,
    encodeHtml: fcf.encodeHtml,
    decodeHtml: fcf.decodeHtml,
    tagRemoval: fcf.tagRemoval,
    replaceAll: fcf.replaceAll,
    count: fcf.count,
    append: fcf.append,
    clone: fcf.clone,
    insertBeforeByValue: fcf.insertBeforeByValue,
    removeByValue: fcf.removeByValue,
    isEnumerable: fcf.isEnumerable,
    find: fcf.find,
    each: fcf.each,
    map: fcf.map,
    filter: fcf.filter,
    array: fcf.array,
    max: fcf.max,
    min: fcf.min,
    range: fcf.range,
    inc: fcf.inc,
    first: fcf.first,
    inc: fcf.inc,
    first: fcf.first,
    firstKey: fcf.firstKey,
    first2: fcf.first2,
    last: fcf.last,
    last2: fcf.last2,
    byteCount: fcf.byteCount,
    empty: fcf.empty,
    in: fcf["in"],
    indexOfAll: fcf.indexOfAll,
    splitSpace: fcf.splitSpace,
    ltrim: fcf.ltrim,
    rtrim: fcf.rtrim,
    trim: fcf.trim,
    str: fcf.str,
    merge: fcf.merge,
    getModeObject: fcf.getModeObject,
    buildModeObject: fcf.buildModeObject,
    cutMode: fcf.cutMode,
    getMode: fcf.getMode,
    unslash: fcf.unslash,
    normalizeObjectAddress: fcf.normalizeObjectAddress,
    resolve: fcf.resolve,
    resolveEx: fcf.resolveEx,
    uuid: fcf.uuid,
    genId: fcf.genId,
    hash: fcf.hash,
    equal: fcf.equal,
    parseUrl: fcf.parseUrl,
    buildUrl: fcf.buildUrl,
    getPath: fcf.getPath,
    getSystemVariable: function getSystemVariable(a_package, a_variable) {
      return fcf.clone(fcf.getSystemVariable(a_package, a_variable));
    },
    getProjection: function getProjection(a_projetion) {
      return fcf.clone(fcf.getProjection(a_projetion));
    },
    getContext: fcf.getSafeContext
  };
  if (typeof module !== 'undefined') module.exports = fcf;
  if (typeof global !== 'undefined') global.fcf = fcf;
  if (typeof window !== 'undefined') window.fcf = fcf;

  if (fcf.isServer()) {
    fcf.addModule("fcf", __dirname, "fcfpackages/fcf");
  } else {
    fcf.addModule("fcf", "", "fcfpackages/fcf");
  }
})();