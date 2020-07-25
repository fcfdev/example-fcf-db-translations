fcf.module({
  name: "fcfDBControls:templates/table.hooks.js",
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
      hooksProgramableArgument: {
        "value": function value(a_taskInfo) {
          var mode = a_taskInfo.args.mode;
          var shortMode = fcf.cutMode(a_taskInfo.args.mode, 2);
          var dbfileds = [];
          var projection = fcf.getProjection(a_taskInfo.args.projection);

          if (shortMode == "read.min") {
            dbfileds.push({
              function: "key",
              as: "@key"
            });
            dbfileds.push({
              function: "title",
              as: "@title"
            });
            dbfileds.push({
              function: "description",
              as: "@description"
            });
          } else {
            dbfileds = fcf.array(projection.fields, function (a_k, a_filed) {
              var view = fcf.buildModeObject(mode, a_filed);
              return view.hidden ? undefined : {
                field: view.alias,
                as: view.alias
              };
            });
            dbfileds.push({
              function: "key",
              as: "@key"
            });
            dbfileds.push({
              function: "title",
              as: "@title"
            });
          }

          var where = [];

          if (!fcf.empty(a_taskInfo.search)) {
            var searchWhere = [];
            var likeString = "%" + a_taskInfo.search + "%";
            fcf.each(dbfileds, function (k, field) {
              if (!field["function"] && !fcf.getFilter(field).availableComparison("like")) return;
              searchWhere.push({
                logic: "or",
                type: "like",
                args: [{
                  field: field.alias
                }, {
                  value: likeString
                }]
              });
            });
            where.push({
              logic: "and",
              type: "block",
              args: searchWhere
            });
          }

          return fcf.application.getStorage().query({
            query: {
              type: "select",
              from: a_taskInfo.args.projection,
              fields: dbfileds,
              where: where
            },
            context: fcf.getContext()
          }).then(function (a_data) {
            return a_data[0];
          });
        },
        "columns": function columns(a_taskInfo) {
          var columns = [];
          var shortMode = fcf.cutMode(a_taskInfo.args.mode, 2);

          if (shortMode == "read.min") {
            columns.push({
              alias: "@key",
              type: "int",
              title: fcf.t("Id")
            });
            columns.push({
              alias: "@title",
              type: "text",
              title: fcf.t("Title")
            });
            columns.push({
              alias: "@description",
              type: "text",
              title: fcf.t("Description")
            });
          } else {
            columns = fcf.clone(fcf.getProjection(a_taskInfo.args.projection).fields);
            if (shortMode == "read.short") fcf.each(columns, function (k, c) {
              c.cutHTML = true;
              c.cutSize = 1024;
            });
          }

          return columns;
        }
      },
      hooksBeforeArgument: {
        "value": function value(a_taskInfo) {
          return fcf.loadFilters(a_taskInfo.args.columns);
        }
      } //
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