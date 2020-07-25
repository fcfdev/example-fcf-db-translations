fcf.module({
  name: "fcfDBControls:templates/form.hooks.js",
  dependencies: [],
  module: function module() {
    return {
      //
      // void hookBeforeBuild(a_taskInfo)
      // The hook is executed before assembling the template arguments
      //
      // hookBeforeBuild: function(a_taskInfo) {
      // },
      //
      // void hookAfterBuild(a_taskInfo)
      // The hook is executed after assembling the template arguments
      //
      // hookAfterBuild: function(a_taskInfo) {
      // },
      //
      // void hookAfterBuild(a_taskInfo)
      // The hook is executed after building the template's system arguments
      //
      // hookAfterSystemBuild: function(a_taskInfo) {
      // },
      //
      // Object of hooks for programmatically populated arguments
      //
      hooksProgramableArgument: {
        'errorMessage': function errorMessage(a_taskInfo) {
          var empty = true;
          var message = "<div><errorheader>" + fcf.t("Invalid form fields") + ":</errorheader></div>";
          fcf.each(a_taskInfo.args.allErrors, function (a_lang, a_errors) {
            var isFirstInLang = true;
            fcf.each(a_errors, function (a_key, a_errorsInfo) {
              if (fcf.empty(a_errorsInfo)) return;
              fcf.each(a_errorsInfo, function (a_key, a_errorInfo) {
                if (fcf.empty(a_errorInfo)) return;
                empty = false;
                var view = a_taskInfo.args.views[fcf.find(a_taskInfo.args.views, function (k, v) {
                  return a_errorInfo.alias == v.alias;
                })];
                var title = view && view.title ? fcf.pattern(view.title) : a_errorInfo.alias;

                if (isFirstInLang) {
                  message += "<div><langitem>" + fcf.t("Language") + ": " + a_lang + "</langitem></div>";
                }

                message += "<div><erroritem>&nbsp;&nbsp;&nbsp;&nbsp;" + fcf.t("Field") + " '" + fcf.t(title) + "': " + a_errorInfo.error.message + "</erroritem></div>";
              });
            });
          });
          return empty ? "" : message;
        },
        "allErrors": function allErrors(a_taskInfo) {
          var result = {};
          fcf.each(a_taskInfo.args.languages, function (a_lang) {
            result[a_lang] = {}, fcf.each(a_taskInfo.args.views, function (a_key, a_view) {
              var alias = a_view.alias ? a_view.alias : a_key;
              result[a_lang][alias] = [];
            });
          });
          return result;
        },
        "views": function views(a_taskInfo) {
          var projection = fcf.getProjection(a_taskInfo.args.projection);
          return projection.fields;
        },
        "language": function language(a_taskInfo) {
          return fcf.getContext().get("language") ? fcf.getContext().get("language") : fcf.getSystemVariable("fcf:defaultLanguage");
        },
        "languages": function languages(a_taskInfo) {
          return fcf.getSystemVariable("fcf:languages");
        },
        "_values": function _values(a_taskInfo) {
          var _values = {};

          for (var lang in a_taskInfo.args.languages) {
            _values[lang] = {};
          }

          return fcf.actions().eachAC(_values, function (a_lang) {
            var projection = fcf.getProjection(a_taskInfo.args.projection);
            return fcf.query({
              query: {
                type: "select",
                language: a_lang,
                from: a_taskInfo.args.projection,
                fields: [{
                  field: "*"
                }],
                where: [{
                  logic: "and",
                  type: "=",
                  args: [{
                    field: projection.key
                  }, {
                    value: a_taskInfo.args.key
                  }]
                }]
              }
            }).then(function (a_data) {
              _values[a_lang] = a_data[0][0];
            });
          }).then(function () {
            return _values;
          });
        }
      } //
      // Object of the hooks preprocessing of the template arguments
      //
      // hooksBeforeArgument: {
      //   // 
      //   // @result Can return the value of an argument or Promise or undefined
      //   //
      //   "ARG_NAME": function(a_taskInfo) {
      //   }
      // },
      //
      // Object of the hooks postprocessing of the template arguments
      // hooksAfterArgument: {
      //   //
      //   // @result Can return the value of an argument or Promise or undefined
      //   //
      //   "ARG_NAME": function(a_taskInfo) {
      //   }
      // },

    };
  }
});