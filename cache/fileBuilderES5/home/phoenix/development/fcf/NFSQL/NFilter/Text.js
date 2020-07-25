fcf.module({
  name: "fcf:NFSQL/NFilter/Text.js",
  dependencies: ["fcf:NFSQL/NFilter/BaseSimpleType.js"],
  module: function module(BaseSimpleType) {
    var NFilter = fcf.prepareObject(fcf, "NFSQL.NFilter");

    NFilter.Text = function () {
      BaseSimpleType.call(this, {
        type: "text"
      });
      this.comparisons = {
        "*": ["=", "<", ">", "<>", ">=", "<=", "like"]
      };

      this.validate = function (a_description, a_dstErrors) {
        var value = fcf.str(a_description.data);

        if ((a_description.field.notEmpty || a_description.field.notNull) && fcf.empty(value)) {
          a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_NOT_EMPTY"));
          return;
        }

        if (!fcf.empty(a_description.field.maxSize)) {
          var byteCount = fcf.byteCount(value);

          if (byteCount > a_description.field.maxSize) {
            a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_MAX_BYTE_COUNT", {
              count: byteCount,
              maxcount: a_description.field.maxSize
            }));
            return;
          }
        }

        if (!fcf.empty(a_description.field.maxLength)) {
          if (value.length > a_description.field.maxLength) {
            a_dstErrors.push(new fcf.Exception("ERROR_FIELD_VALIDATION_MAX_LENGTH", {
              length: value.length,
              maxlength: a_description.field.maxLength
            }));
            return;
          }
        }
      };
    };

    return NFilter.Text;
  }
});