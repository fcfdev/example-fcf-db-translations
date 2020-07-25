fcf.module({
  name: "fcfControls:templates/table.hooks.js",
  dependencies: ["fcf:NTools/view.js"],
  module: function module(toolsView) {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");
    return {
      hooksProgramableArgument: {
        "_links": function _links(a_taskInfo) {
          var links = [];
          var filter = a_taskInfo.args.filter;
          var patternArgs = undefined;
          var patternLinkArgs = undefined;
          fcf.each(a_taskInfo.args.value, function (indexRow, row) {
            if (filter) {
              patternArgs = {
                record: row,
                index: indexRow,
                row: indexRow
              };
              patternLinkArgs = {
                id: a_taskInfo.args.fcfId,
                references: {
                  record: 'value["' + indexRow + '"]',
                  args: ''
                }
              };
              if (!fcf.pattern(filter, patternArgs, patternLinkArgs)) return;
            }

            links.push({
              row: indexRow,
              index: indexRow,
              columns: []
            });
            fcf.each(a_taskInfo.args.columns, function (a_indexColumn, a_column) {
              links[links.length - 1].columns.push({
                row: indexRow,
                index: indexRow,
                column: a_indexColumn
              });
            });
          });
          return fcf.actions().exec(function (a_act) {
            if (fcf.empty(a_taskInfo.args.search)) {
              a_act.complete();
              return;
            }

            toolsView.getFilters(a_taskInfo.args.columns).then(function (a_filters) {
              var newLinks = [];
              var search = a_taskInfo.args.search.toLowerCase();

              for (var linkIndex = 0; linkIndex < links.length; ++linkIndex) {
                var found = false;
                var record = a_taskInfo.args.value[links[linkIndex].row];
                var lnkColumns = links[linkIndex].columns;

                for (var indexColumn = 0; indexColumn < lnkColumns.length; ++indexColumn) {
                  var view = a_taskInfo.args.columns[lnkColumns[indexColumn].column];
                  var value = record[view.alias];
                  if (value == undefined) continue;
                  var frValue = a_filters[view.alias].friendly(view, value);

                  if (frValue.toLowerCase().indexOf(search) != -1) {
                    found = true;
                    break;
                  }
                }

                if (found) newLinks.push(links[linkIndex]);
              }

              links = newLinks;
              a_act.complete();
            })["catch"](function (a_error) {
              a_act.error(a_error);
            });
          }).then(function () {
            var length = links.length;
            var page = fcf.range(a_taskInfo.args.page, 1, Math.floor(length / a_taskInfo.args.outputRowCount) + (length % a_taskInfo.args.outputRowCount != 0 ? 1 : 0));
            a_taskInfo.setArg("_page", page);
            var beginRecord = fcf.range(a_taskInfo.args.outputRowCount * (page - 1), 0, fcf.max(0, length - 1));
            var endRecord = fcf.range(beginRecord + a_taskInfo.args.outputRowCount, 0, fcf.max(0, length));
            var pageCount = length % a_taskInfo.args.outputRowCount ? Math.floor(length / a_taskInfo.args.outputRowCount) + 1 : Math.floor(length / a_taskInfo.args.outputRowCount);
            a_taskInfo.setArg("_pageCount", pageCount);
            return links.slice(beginRecord, endRecord);
          });
        }
      }
    };
  }
});