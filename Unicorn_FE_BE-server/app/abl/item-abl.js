"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");
const Warnings = require("../api/warnings/item-warning.js");

const WARNINGS = {

};

class ItemAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
  }

  async create(awid, dtoIn, session) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // check for fishy words
    FISHY_WORDS.forEach((word) => {
      if (dtoIn.text.includes(word)) {
        throw new Errors.Create.TextContainsFishyWords({ uuAppErrorMap }, { text: dtoIn.text, fishyWord: word });
      }
    });

    // get uuIdentity information
    const uuIdentity = session.getIdentity().getUuIdentity();
    const uuIdentityName = session.getIdentity().getName();
    
    // Create item in DB
    const item = await this.dao.create({ awid, ...dtoIn, uuIdentity, uuIdentityName, });
    return item;
  }

  // Implement other CRUD methods (get, update, list, delete) similarly
}

module.exports = new ItemAbl();
