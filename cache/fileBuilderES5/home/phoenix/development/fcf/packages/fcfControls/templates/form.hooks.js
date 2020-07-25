fcf.module({
  name: "fcfControls:templates/form.hooks.js",
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
          fcf.each(a_taskInfo.args.errors, function (a_key, a_errorsInfo) {
            if (fcf.empty(a_errorsInfo)) return;
            fcf.each(a_errorsInfo, function (a_key, a_errorInfo) {
              if (fcf.empty(a_errorInfo)) return;
              empty = false;
              var view = a_taskInfo.args.views[fcf.find(a_taskInfo.args.views, function (k, v) {
                return a_errorInfo.alias == v.alias;
              })];
              var title = view && view.title ? fcf.pattern(view.title) : a_errorInfo.alias;
              message += "<div><erroritem>" + fcf.t("Field") + " '" + fcf.t(title) + "': " + a_errorInfo.error.message + "</erroritem></div>";
            });
          });
          return empty ? "" : message;
        },
        'errors': function errors(a_taskInfo) {
          var errors = {};
          fcf.each(a_taskInfo.args.views, function (a_key, a_view) {
            var alias = a_view.alias ? a_view.alias : a_key;
            errors[alias] = [];
          });
          return errors;
        },
        'items': function items(a_taskInfo) {
          var result = [];
          var errors = {};
          return fcf.actions().each(a_taskInfo.args.views, function (a_act, a_key, a_view) {
            if (a_taskInfo.args.fill) a_view.width = "100%";
            var value = a_view.alias ? fcf.arg("reference", {
              id: a_taskInfo.args.fcfId,
              arg: "value[\"" + a_view.alias + "\"]"
            }) : "";
            var alias = a_view.alias ? a_view.alias : a_key;
            var languageDetails = a_taskInfo.args.languageDetails && a_taskInfo.args.projection && fcf.getProjection(a_taskInfo.args.projection) && fcf.getProjection(a_taskInfo.args.projection).translate;
            return a_taskInfo.render({
              template: "@controls:view",
              args: {
                view: fcf.pattern(a_view),
                value: value,
                mode: a_taskInfo.args.mode,
                enableTitle: a_taskInfo.args.enableTitle,
                messagePosition: a_taskInfo.args.itemErrorPosition,
                languageDetails: languageDetails,
                errors: fcf.arg("reference", {
                  id: a_taskInfo.args.fcfId,
                  arg: "errors[\"" + alias + "\"]"
                })
              },
              onResult: function onResult(a_error, a_template) {
                result.push(a_template);
              }
            });
          }).then(function () {
            return result;
          });
        },
        'map': function map(a_taskInfo) {
          return fcf.map(a_taskInfo.args.items, function (k, v) {
            return [v.args.fcfAlias, v];
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