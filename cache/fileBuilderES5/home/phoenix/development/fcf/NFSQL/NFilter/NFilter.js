fcf.module({
  name: "fcf:NFSQL/NFilter/NFilter.js",
  dependencies: [],
  module: function module() {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");

    NFilter.getProjectionByField = function (a_handler, a_queryObject, a_originQueryObject, a_field) {
      var alias = a_field.from ? a_field.from : a_originQueryObject.from;
      var projectionName = a_queryObject.details.fromAliases[alias] ? a_queryObject.details.fromAliases[alias] : alias;
      var projection = a_handler.getProjection(projectionName);
      if (!projection) fcf.Exception("ERROR_NFSQL_UNKNOWN_PROJECTION_IN_FIELD", {
        projection: projectionName,
        field: a_field.field
      });
      return projection;
    };

    NFilter.getTableByField = function (a_handler, a_queryObject, a_originQueryObject, a_field) {
      if (a_field.from && a_queryObject.details.fromAliases[a_field.from]) return a_field.from;
      return NFilter.getProjectionByField(a_handler, a_queryObject, a_originQueryObject, a_field).table;
    };

    NFilter.getProjectionField = function (a_handler, a_queryObject, a_originQueryObject, a_queryfield) {
      var projection = NFilter.getProjectionByField(a_handler, a_queryObject, a_originQueryObject, a_queryfield);
      var projectionField = projection.mapFields[a_queryfield.field];
      if (!projectionField) throw new fcf.Exception("ERROR_NFSQL_UNKNOWN_FIELD_IN_QUERY", {
        projection: projection.alias,
        field: a_queryfield.field
      });
      return projectionField;
    };

    NFilter.getValue = function (a_handler, a_queryObject, a_originQueryObject, a_queryfield) {
      return a_queryfield.value;
    };

    NFilter.setAsField = function (a_handler, a_queryObject, a_originQueryObject, a_queryfield, a_originQueryfield) {
      if (!a_queryObject.details.outputAliases) a_queryObject.details.outputAliases = {};
      var as = "";
      as = a_queryfield.as ? a_queryfield.as : a_originQueryfield.as ? a_originQueryfield.as : "";

      if (!fcf.empty(as)) {
        a_queryfield.as = as;
        a_queryObject.details.outputAliases[as] = true;
        return as;
      }

      var alias = a_originQueryfield.from ? a_originQueryfield.from : a_originQueryObject.from;
      if (a_originQueryObject.from != alias) as += alias + ".";
      as += a_originQueryfield.field;

      if (a_originQueryfield.mode && a_originQueryfield.result) {
        as += ":" + a_originQueryfield.mode + ":" + a_originQueryfield.result;
      }

      var resas = as;
      var count = 1;

      while (a_queryObject.details.outputAliases[resas]) {
        resas = as + count;
        ++count;
      }

      a_queryfield.as = resas;
      a_queryObject.details.outputAliases[resas] = true;
      return resas;
    };

    NFilter.setAsFieldByValue = function (a_handler, a_as, a_from) {
      if (!a_queryObject.details.outputAliases) a_queryObject.details.outputAliases = {};
      var as = "";
      if (!fcf.empty(a_from)) as += a_from + ".";
      as += a_as;
      var resas = as;
      var count = 1;

      while (a_queryObject.details.outputAliases[resas]) {
        resas = as + count;
        ++count;
      }

      a_queryfield.as = resas;
      a_queryObject.details.outputAliases[resas] = true;
      return resas;
    };

    return fcf.NFSQL.NFilter;
  }
});