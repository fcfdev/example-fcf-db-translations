fcf.module({
  name: "templates/pages/main+body.hooks.js",
  dependencies: [],
  module: function(){
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
        "record": function(a_taskInfo){
          return fcf.query("SELECT * from page where alias=${1} LANGUAGE ${2} DEFAULT", ["main", fcf.getContext().get("language")])
          .then((a_result)=>{return a_result[0][0] });
        }
      },

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
