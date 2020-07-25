fcf.module({
  name: "fcf:NFSQL/NFilter/BigInt.js",
  dependencies: ["fcf:NFSQL/NFilter/BaseSimpleType.js", "fcf:NFSQL/NFilter/Errors.js"],
  module: function module(BaseSimpleType, Errors) {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");

    NFilter.Boolean = function () {
      BaseSimpleType.call(this, {
        type: "bigint"
      });
      this.comparisons = {
        "*": ["=", "<", ">", "<>", ">=", "<=", "like"]
      };

      this.validate = function (a_description, a_dstErrors) {
        var value = a_description.data;
        var field = a_description.field;

        if ((a_description.field.notEmpty || a_description.field.notNull) && fcf.empty(value)) {
          a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_NOT_EMPTY"));
          return;
        }

        if (value === undefined) return;
        if (typeof value !== "number") value = parseInt(value);
        if (isNaN(value)) a_dstErrors.push(new fcf.Exception("ERROR_NFSQL_INCORRECT_INTEGER_TYPE", {
          projection: from,
          field: field.alias,
          value: value
        }));
        if (!fcf.empty(field.min) && value < field.min) a_dstErrors.push(new fcf.Exception("ERROR_NFSQL_INCORRECT_INTEGER_MIN", {
          projection: from,
          field: field.alias,
          value: value,
          min: field.min
        }));
        if (!fcf.empty(field.max) && value > field.max) a_dstErrors.push(new fcf.Exception("ERROR_NFSQL_INCORRECT_INTEGER_MAX", {
          projection: from,
          field: field.alias,
          value: value,
          max: field.max
        }));
        var maxInt = Math.pow(2, 64) / 2;
        var minInt = -maxInt;
        if (value < minInt) a_dstErrors.push(new fcf.Exception("ERROR_NFSQL_INCORRECT_INTEGER_MIN", {
          projection: from,
          field: field.alias,
          value: value,
          min: minInt
        }));
        if (value > maxInt) a_dstErrors.push(new fcf.Exception("ERROR_NFSQL_INCORRECT_INTEGER_MAX", {
          projection: from,
          field: field.alias,
          value: value,
          max: maxInt
        }));
      };

      this.insertFieldHandler = function (a_handler, a_queryObject, a_originQueryObject, a_container, a_key, a_originContainer, a_originKey) {
        var f = a_container[a_key];
        var of = a_originContainer[a_originKey];
        var value = typeof of.value !== "string" || fcf.trim(of.value) != "" ? of.value : null;
        f.value = value;
        this.checkModify(a_handler, a_queryObject, a_originQueryObject, a_container, a_key, a_originContainer, a_originKey);
      };
    };

    return NFilter.Boolean;
  }
});