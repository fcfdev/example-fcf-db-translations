if (fcf.isServer()) {
  var libFS = require("fs");
}

fcf.module({
  name: "fcf:NTools/languages.js",
  dependencies: [],
  module: function module() {
    var Namespace = fcf.prepareObject(fcf, "NTools");

    Namespace.languages = function () {
      var self = this;

      this.updateLanguages = function (a_value) {
        a_value = fcf.empty(a_value) ? {
          en: "English"
        } : a_value;
        return fcf.application.updateSystemVariables({
          "fcf:translations": a_value
        });
      };

      this.getLanguages = function () {
        return fcf.application.selectSystemVariables(["fcf:languages"], {}).then(function (a_variables) {
          return a_variables["fcf:languages"] !== null ? a_variables["fcf:languages"] : {
            en: "English"
          };
        });
      };

      this.getAllLanguages = function () {
        return {
          // ISO 639-1
          ab: "Caucasian",
          aa: "Afar",
          af: "Afrikaans",
          ak: "Akan",
          sq: "Albanian",
          am: "Amharic",
          ar: "Arabic",
          an: "Aragonese",
          hy: "Armenian",
          as: "Assamese",
          av: "Avaric",
          ae: "Avestan",
          ay: "Aymara",
          az: "Azerbaijani",
          bm: "Bambara",
          ba: "Bashkir",
          eu: "Basque",
          be: "Belarusian",
          bn: "Bengali",
          bh: "Bihari languages",
          bi: "Bislama",
          bs: "Bosnian",
          br: "Breton",
          bg: "Bulgarian",
          my: "Burmese",
          ca: "Catalan",
          km: "Central Khmer",
          ch: "Chamorro",
          ce: "Caucasian",
          ny: "Chichewa",
          zh: "Chinese",
          cu: "Church Slavic",
          cv: "Chuvash",
          kw: "Cornish",
          co: "Corsican",
          cr: "Cree",
          hr: "Croatian",
          cs: "Czech",
          da: "Danish",
          dv: "Divehi",
          nl: "Dutch",
          dz: "Dzongkha",
          en: "English",
          eo: "Esperanto",
          et: "Estonian",
          ee: "Ewe",
          fo: "Faroese",
          fj: "Fijian",
          fi: "Finnish",
          fr: "French",
          ff: "Fulah",
          gd: "Gaelic",
          gl: "Galician",
          lg: "Ganda",
          ka: "Georgian",
          de: "German",
          el: "Greek",
          gn: "Guarani",
          gu: "Gujarati",
          ht: "Haitian",
          ha: "Hausa",
          he: "Hebrew",
          hz: "Herero",
          hi: "Hindi",
          ho: "Hiri Motu",
          hu: "Hungarian",
          is: "Icelandic",
          io: "Ido",
          ig: "Igbo",
          id: "Indonesian",
          ia: "Interlingua",
          ie: "Interlingue",
          iu: "Inuktitut",
          ik: "Inupiaq",
          ga: "Irish",
          it: "Italian",
          ja: "Japanese",
          jv: "Javanese",
          kl: "Kalaallisut",
          kn: "Kannada",
          kr: "Kanuri",
          ks: "Kashmiri",
          kk: "Kazakh",
          ki: "Kikuyu",
          rw: "Kinyarwanda",
          ky: "Kirghiz",
          kv: "Komi",
          kg: "Kongo",
          ko: "Korean",
          kj: "Kuanyama",
          ku: "Kurdish",
          lo: "Lao",
          la: "Latin",
          lv: "Latvian",
          li: "Limburgan",
          ln: "Lingala",
          lt: "Lithuanian",
          lu: "Luba-Katanga",
          lb: "Luxembourgish",
          mk: "Macedonian",
          mg: "Malagasy",
          ms: "Malay",
          ml: "Malayalam",
          mt: "Maltese",
          gv: "Manx",
          te: "Maori",
          mr: "Marathi",
          mh: "Marshallese",
          mn: "Mongolian",
          na: "Nauru",
          nv: "Navajo",
          ng: "Ndonga",
          ne: "Nepali",
          nd: "North Ndebele",
          se: "Northern Sami",
          no: "Norwegian",
          nb: "Norwegian Bokmål",
          nn: "Norwegian Nynorsk",
          oc: "Occitan",
          oj: "Ojibwa",
          or: "Oriya",
          om: "Oromo",
          os: "Ossetian",
          pi: "Pali",
          ps: "Pashto",
          fa: "Persian",
          pl: "Polish",
          pt: "Portuguese",
          pa: "Punjabi",
          qu: "Quechua",
          ro: "Romanian",
          rm: "Romansh",
          rn: "Rundi",
          ru: "Russian",
          sm: "Samoan",
          sg: "Sango",
          sa: "Sanskrit",
          sc: "Sardinian",
          sr: "Serbian",
          sn: "Shona",
          ii: "Sichuan Yi",
          sd: "Sindhi",
          si: "Sinhala",
          sk: "Slovak",
          sl: "Slovenian",
          af: "Somali",
          nr: "South Ndebele",
          st: "Southern Sotho",
          es: "Spanish",
          su: "Sundanese",
          sw: "Swahili",
          ss: "Swati",
          sv: "Swedish",
          tl: "Tagalog",
          ty: "Tahitian",
          tg: "Tajik",
          ta: "Tamil",
          tt: "Tatar",
          te: "Telugu",
          th: "Thai",
          bo: "Tibetan",
          ti: "Tigrinya",
          to: "Tonga",
          ts: "Tsonga",
          tn: "Tswana",
          tr: "Turkish",
          tk: "Turkmen",
          tw: "Twi",
          ug: "Uighur",
          uk: "Ukrainian",
          ur: "Urdu",
          uz: "Uzbek",
          ve: "Venda",
          vi: "Vietnamese",
          vo: "Volapük",
          wa: "Walloon",
          cy: "Welsh",
          fy: "Western Frisian",
          wo: "Wolof",
          xh: "Xhosa",
          yi: "Yiddish",
          yo: "Yoruba",
          za: "Zhuang",
          zu: "Zulu"
        };
      };

      this.checkLanguageFile = function (a_path, a_friendlyName) {
        var result = {
          lang: "unknown",
          language: "unknown"
        };
        return fcf.actions().append(function (a_act) {
          libFS.exists(fcf.getPath(a_path), function (exists) {
            if (!exists) {
              a_act.error(new fcf.Exception("ERROR_FILE_NOT_FOUND", {
                file: a_friendlyName ? a_friendlyName : a_path
              }));
              return;
            }

            a_act.complete();
          });
        }).append(function (a_act) {
          libFS.readFile(fcf.getPath(a_path), 'utf8', function (a_error, a_data) {
            if (a_error) {
              a_act.error(a_error);
              return;
            }

            try {
              a_data = JSON.parse(a_data);
              if (!a_data.lang) throw "format";
              if (typeof a_data.translations !== "object") throw "format";
              result.lang = a_data.lang;
              result.language = self.getAllLanguages()[a_data.lang] ? self.getAllLanguages()[a_data.lang] : a_data.language ? a_data.language : a_data.lang;
            } catch (e) {
              a_act.error(new fcf.Exception("ERROR_READ_FORMAT_FILE", {
                file: a_friendlyName ? a_friendlyName : a_path
              }));
              return;
            }

            a_act.complete();
          });
        }).then(function () {
          return result;
        });
      };

      this.getTranslationsEx = function (a_langs) {
        var files = [];
        var result = {};
        return this.getFiles(a_langs).then(function (a_files) {
          files = a_files;
        }).each(function () {
          return files;
        }, function (a_act, a_key, a_fileInfo) {
          fcf.load({
            path: a_fileInfo.path,
            onResult: function onResult(a_error, a_data) {
              var data = {};

              try {
                data = JSON.parse(a_data);
              } catch (e) {}

              fcf.each(data.translations, function (a_word, a_transklation) {
                if (!result[a_word]) result[a_word] = {};
                if (!result[a_word][data.lang]) result[a_word][data.lang] = [];
                result[a_word][data.lang].unshift({
                  file: a_fileInfo.path,
                  translate: a_transklation,
                  editable: a_fileInfo.editable
                });
              });
              a_act.complete();
            }
          });
        }).then(function () {
          return result;
        });
      };

      this.getTranslations = function (a_langs) {
        var files = [];
        var result = {};
        var actions = fcf.actions();
        return actions.then(function () {
          if (a_langs == undefined) return self.getLanguages();
        }).then(function (a_overLangs) {
          if (a_overLangs) a_langs = a_overLangs;
          return self.getFiles(a_langs);
        }).then(function (a_files) {
          files = fcf.array(a_files, function (k, a_fileInfo) {
            return a_fileInfo.status != 0 && a_fileInfo.status ? a_fileInfo : undefined;
          });
        }).each(function () {
          return files;
        }, function (a_act, a_key, a_fileInfo) {
          fcf.load({
            path: a_fileInfo.path,
            onResult: function onResult(a_error, a_data) {
              var data = {};

              try {
                data = JSON.parse(a_data);
              } catch (e) {}

              fcf.each(data.translations, function (a_word, a_translate) {
                if (!result[data.lang]) result[data.lang] = {};
                result[data.lang][a_word] = a_translate;
              });
              a_act.complete(result);
            }
          });
        }).then(function () {
          return result;
        });
      };

      this.getFiles = function (a_langs, a_newFiles, a_files) {
        a_langs = a_langs ? a_langs : {};
        var systemFiles = {};
        var mapFiles = {};
        var savedFiles = [];
        var result = [];
        var files = [];
        return fcf.actions().append(function (a_act) {
          fcf.application.selectSystemVariables(["fcf:translations-files"], function (a_error, a_result) {
            if (a_error) {
              a_act.error(a_error);
              return;
            }

            savedFiles = a_result["fcf:translations-files"];
            a_act.complete();
          });
        }).each(a_langs, function (a_act, lang, language) {
          self.checkLanguageFile("fcf:translations/" + lang).then(function (a_fileInfo) {
            systemFiles["fcf:translations/" + lang] = true;
            result.push({
              path: "fcf:translations/" + lang,
              name: lang,
              lang: a_fileInfo.lang,
              language: a_fileInfo.language,
              status: 1,
              editable: false,
              index: undefined,
              exists: true,
              custom: false,
              mandatory: true
            });
            a_act.complete();
          })["catch"](function (a_error) {
            a_act.complete();
          });
        }).exec(function (a_act) {
          libFS.readdir(fcf.getPath(":translations"), function (a_error, a_files) {
            files = Array.isArray(a_files) ? a_files : [];
            a_act.complete();
          });
        }).each(function () {
          return files;
        }, function (a_act, k, a_file) {
          self.checkLanguageFile(":translations/" + a_file).then(function (a_fileInfo) {
            if (a_fileInfo.lang in a_langs) {
              if (a_file == a_fileInfo.lang) systemFiles["fcf:translations/" + a_file] = true;
              result.push({
                path: ":translations/" + a_file,
                name: a_file,
                lang: a_fileInfo.lang,
                language: a_fileInfo.language,
                status: 1,
                editable: a_file == a_fileInfo.lang,
                index: undefined,
                exists: true,
                custom: !systemFiles["fcf:translations/" + a_file],
                mandatory: a_file == a_fileInfo.lang
              });
            }

            a_act.complete();
          })["catch"](function (a_error) {
            a_act.complete();
          });
        }).each(a_langs, function (a_act, lang, language) {
          mapFiles[":translations/" + lang] = true;
          self.checkLanguageFile(":translations/" + lang).then(function () {
            a_act.complete();
          })["catch"](function (a_error) {
            systemFiles["fcf:translations/" + lang] = true;
            result.push({
              path: ":translations/" + lang,
              name: lang,
              lang: lang,
              language: language,
              status: 1,
              editable: true,
              index: undefined,
              exists: false,
              custom: true,
              mandatory: true
            });
            a_act.complete();
          });
        }) // merge
        .eachAC(function () {
          return result;
        }, function (k, file) {
          var savedFile = savedFiles[fcf.find(savedFiles, function (k, v) {
            return v.path == file.path;
          })];
          if (!savedFile) return;
          file.status = savedFile.status;
          file.editable = savedFile.editable;
        }) // new files
        .each(a_newFiles, function (a_act, index, fileInfo) {
          var fileName = fileInfo.name;
          var filePath = ":translations/" + fileName;

          if (mapFiles[filePath]) {
            var fi = result[fcf.find(result, function (k, v) {
              return v.path == filePath;
            })];
            fi.exist = false;
            fi.lang = undefined;
            fi.language = undefined;
            fi.index = fileInfo.index;
          } else {
            result.push({
              path: filePath,
              name: fileName,
              lang: undefined,
              language: undefined,
              status: 1,
              editable: false,
              index: fileInfo.index,
              exists: false,
              custom: !systemFiles[filePath]
            });
          }

          a_act.complete();
        }) //remove
        .then(function () {
          if (a_files !== undefined) {
            var newResult = [];
            fcf.each(result, function (k, file) {
              var f = result[fcf.find(a_files, function (k, f) {
                return f.path == file.path;
              })];
              if (f || file.mandatory) newResult.push(file);
            });
            result = newResult;
          }
        }) // Sort
        .then(function () {
          var files = a_files ? a_files : savedFiles;
          var r = [];
          var map = {};
          fcf.each(files, function (n, file) {
            var rfile = result[fcf.find(result, function (k, f) {
              return f.path == file.path;
            })];

            if (rfile) {
              r.push(rfile);
              map[rfile.path] = true;
            }
          });
          fcf.each(result, function (n, file) {
            if (!map[file.path]) r.push(file);
          });
          result = r;
          return result;
        }).then(function () {
          if (fcf.empty(a_files)) return result;
          fcf.each(result, function (k, file) {
            var f = a_files[fcf.find(a_files, function (k, v) {
              return v.path == file.path;
            })];
            if (f) file.status = f.status;
          });
          return result;
        });
      };
    };

    return new Namespace.languages();
  }
});