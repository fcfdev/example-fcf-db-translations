fcf.module({
  name: "fcf:NFSQL/NFilter/Errors.js",
  dependencies: [],
  module: function module() {
    fcf.addException("ERROR_FIELD_SUBFIELD_INCORRECT", "The specified '${{subfield}}$' subfield is not valid for the '${{field}}$' field");
    fcf.addException("ERROR_FIELD_VALIDATION_FIELD", "Invalid filling in the ${{field}}$ field");
    fcf.addException("ERROR_FIELD_VALIDATION_INCORRECT_INT", "Invalid integer format '${{1}}$'");
    fcf.addException("ERROR_FIELD_VALIDATION_NOT_EMPTY", "field is not set");
    fcf.addException("ERROR_FIELD_VALIDATION_MIN", "The value ${{value}}$ is less than the minimum value ${{min}}$");
    fcf.addException("ERROR_FIELD_VALIDATION_MAX", "The value of ${{value}}$ is greater than the maximum value of ${{max}}$");
    fcf.addException("ERROR_FIELD_VALIDATION_MAX_BYTE_COUNT", "The string size in bytes (${{count}}$) is greater than the maximum value of ${{maxcount}}$");
    fcf.addException("ERROR_FIELD_VALIDATION_MAX_LENGTH", "The string length (${{length}}$) is greater than the maximum value of ${{maxlength}}$");
  }
});