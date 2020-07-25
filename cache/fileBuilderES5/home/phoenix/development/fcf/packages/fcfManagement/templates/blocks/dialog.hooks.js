fcf.module({
  name: "fcfManagement:templates/blocks/dialog.hooks.js",
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
      // hooksProgramableArgument: {
      //   //
      //   // @result Returns the value of an argument or a Promise object
      //   //
      //   "ARG_NAME": function(a_taskInfo){
      //   }
      // },
      //
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
      hooksAfterArgument: {
        "footer": function footer(a_taskInfo) {
          var html = "";
          return fcf.actions().each(a_taskInfo.args.buttons, function (a_act, k, v) {
            return a_taskInfo.render({
              template: "@controls:button",
              args: {
                title: fcf.t(v.charAt(0).toUpperCase() + v.substr(1)),
                fcfEventClick: "parent.onButtonClick(\"" + v + "\");"
              },
              onResult: function onResult(a_error, a_template) {
                html += a_template.content;
              }
            });
          }).then(function () {
            a_taskInfo.setArg("footer", html);
          });
        }
      }
    };
  }
});