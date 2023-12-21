"use strict";

const FeBeUseCaseError = require("./fe-be-use-case-error.js");
const ITEMS_ERROR_PREFIX = `${FeBeUseCaseError.ERROR_PREFIX}items/`;

const Create = {
  UC_CODE: `${ITEMS_ERROR_PREFIX}create/`,
  
  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const List = {
  UC_CODE: `${ITEMS_ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Update = {
  UC_CODE: `${ITEMS_ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Get = {
  UC_CODE: `${ITEMS_ERROR_PREFIX}get/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Delete = {
  UC_CODE: `${ITEMS_ERROR_PREFIX}delete/`,

  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

module.exports = {
  Create,
  List,
  Update,
  Get,
  Delete,
};
