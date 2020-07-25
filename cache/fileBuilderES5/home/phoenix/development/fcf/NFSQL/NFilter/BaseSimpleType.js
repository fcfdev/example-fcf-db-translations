fcf.module({
  name: "fcf:NFSQL/NFilter/BaseSimpleType.js",
  dependencies: ["fcf:NFSQL/NFilter/NFilter.js", "fcf:NFSQL/NFilter/Filter.js"],
  module: function module(NFilter, Filter) {
    var NBuild = fcf.prepareObject(fcf, "NFSQL.NDetails.NBuild");

    NFilter.BaseSimpleType = function (a_options) {
      var self = this;
      Filter.call(this, a_options);

      this.processOutputField = function (a_taskInfo, a_info) {
        var tableAlias = a_taskInfo.getQueryTableByField(a_info.field);
        a_info.field.field = a_taskInfo.getQueryField(a_info.field);
        a_info.field.from = tableAlias;
      };

      this.processWhereField = function (a_taskInfo, a_info) {
        var tableAlias = a_taskInfo.getQueryTableByField(a_info.field);
        a_info.field.field = a_taskInfo.getQueryField(a_info.field);
        a_info.field.from = tableAlias;
      };

      this.processUpdateField = function (a_taskInfo, a_info) {
        var tableAlias = a_taskInfo.getQueryTableByField(a_info.field);
        a_info.field.field = a_taskInfo.getQueryField(a_info.field);
        a_info.field.from = tableAlias;
      };

      this.processInsertField = function (a_taskInfo, a_info) {
        var tableAlias = a_taskInfo.getQueryTableByField(a_info.field);
        a_info.field.field = a_taskInfo.getQueryField(a_info.field);
        a_info.field.from = tableAlias;
      };
    };

    return NFilter.BaseSimpleType;
  }
});