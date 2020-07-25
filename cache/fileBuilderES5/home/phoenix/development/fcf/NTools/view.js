fcf.module({
  name: "fcf:NTools/view.js",
  dependencies: [],
  module: function module() {
    var Namespace = fcf.prepareObject(fcf, "NTools");

    Namespace.View = function () {
      this.getFilters = function (a_views) {
        return fcf.actions().exec(function (a_act) {
          var result = {};
          var filters = fcf.application.getConfiguration().getConfiguration().filters;
          var files = [];

          if (fcf.empty(a_views)) {
            a_act.complete(result);
            return;
          }

          fcf.each(a_views, function (a_key, a_view) {
            files.push(filters[a_view.type] ? filters[a_view.type] : filters["text"]);
          });
          fcf.requireEx(files, function (a_error) {
            if (a_error) {
              a_act.error(a_error);
              return;
            }

            var args = fcf.append([], arguments);
            args.shift();

            for (var i = 0; i < args.length; ++i) {
              var alias = a_views[i].alias ? a_views[i].alias : i;
              result[alias] = new args[i]();
            }

            a_act.complete(result);
          });
        });
      };
    };

    Namespace.view = new Namespace.View();
    return Namespace.view;
  }
});