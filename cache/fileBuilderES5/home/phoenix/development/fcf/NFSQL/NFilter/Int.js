fcf.module({
  name: "fcf:NFSQL/NFilter/Int.js",
  dependencies: ["fcf:NFSQL/NFilter/BaseSimpleType.js", "fcf:NFSQL/NFilter/Errors.js"],
  module: function module(BaseSimpleType, Errors) {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");

    NFilter.Int = function () {
      BaseSimpleType.call(this, {
        type: "int"
      });
      this.comparisons = {
        "*": ["=", "<", ">", "<>", ">=", "<=", "like"]
      };

      this.validate = function (a_description, a_dstErrors) {
        var value = fcf.str(a_description.data);

        if (value != "") {
          var testValue = value.charAt(0) != "-" ? value : value.substr(1);
          var check = testValue.search(/[^0-9]/i);

          if (check != -1) {
            a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_INCORRECT_INT", [value]));
            return;
          }
        }

        if ((a_description.field.notEmpty || a_description.field.notNull) && fcf.empty(value)) {
          a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_NOT_EMPTY"));
          return;
        }

        var intValue = parseInt(value);

        if (!fcf.empty(a_description.field.min) && intValue < a_description.field.min) {
          a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_MIN", {
            value: intValue,
            min: a_description.field.min
          }));
          return;
        }

        if (!fcf.empty(a_description.field.max) && intValue > a_description.field.max) {
          a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_MAX", {
            value: intValue,
            max: a_description.field.max
          }));
          return;
        }
      };
    };

    return NFilter.Int;
  }
});