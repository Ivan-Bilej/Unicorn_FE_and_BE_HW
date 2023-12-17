"use strict";

const FeBeUseCaseError = require("./fe-be-use-case-error.js");
const SHOPPING_LIST_ERROR_PREFIX = `${FeBeUseCaseError.ERROR_PREFIX}shoppingList/`;

const Create = {
  UC_CODE: `${SHOPPING_LIST_ERROR_PREFIX}create/`,
  
  InvalidDtoIn: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TextContainsFishyWords: class extends FeBeUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}textContainsFishyWords`;
      this.message = "The text of the joke contains fishy words.";
    }
  },
};

module.exports = {
  Create
};
