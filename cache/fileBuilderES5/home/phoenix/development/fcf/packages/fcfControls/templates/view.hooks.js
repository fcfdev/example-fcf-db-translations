fcf.module({
  name: "fcfControls:templates/view.hooks.js",
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
        "except": function except(a_taskInfo) {
          var mode = a_taskInfo.args.mode.split(".")[0];
          if (mode == "add" && a_taskInfo.args.view.notAdd) return true;else if (mode == "edit" && a_taskInfo.args.view.notEdit) return true;
          return false;
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