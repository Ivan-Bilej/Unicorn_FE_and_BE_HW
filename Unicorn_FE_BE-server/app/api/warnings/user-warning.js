const Errors = require("../errors/user-error.js");

const Warnings = {
  Add: {
    UnsupportedKeys: {
      code: `${Errors.Add.UC_CODE}unsupportedKeys`,
    },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
    },
  },
  Remove: {
    UnsupportedKeys: {
      code: `${Errors.Remove.UC_CODE}unsupportedKeys`,
    },
  },
  RemoveMyself: {
    UnsupportedKeys: {
      code: `${Errors.RemoveMyself.UC_CODE}unsupportedKeys`,
    },
  },
};

module.exports = Warnings;