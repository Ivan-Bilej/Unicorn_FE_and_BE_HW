"use strict";

const FeBeUseCaseError = require("./fe-be-use-case-error.js");
const USER_ERROR_PREFIX = `${FeBeUseCaseError.ERROR_PREFIX}user/`;

const Add = {
  UC_CODE: `${USER_ERROR_PREFIX}add/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Add.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const Remove = {
  UC_CODE: `${USER_ERROR_PREFIX}add/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Remove.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const RemoveMyself = {
  UC_CODE: `${USER_ERROR_PREFIX}add/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${RemoveMyself.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};

const List = {
  UC_CODE: `${USER_ERROR_PREFIX}add/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }
};
module.exports = {
  Add,
  Remove,
  RemoveMyself,
  List,
};
