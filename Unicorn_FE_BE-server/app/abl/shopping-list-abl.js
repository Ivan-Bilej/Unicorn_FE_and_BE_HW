"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../api/errors/shopping-list-error.js");
const Warnings = require("../api/warnings/shopping-list-warning.js");

const FISHY_WORDS = ["barracuda", "broccoli", "Topolánek"];
const EXECUTIVES_PROFILE = "Executives";

const WARNINGS = {

};

class ShoppingListAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("shoppingList");
  }

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListCreateDtoInType", dtoIn);
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

    // set visibility
    const visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    // get uuIdentity information
    const uuIdentity = session.getIdentity().getUuIdentity();
    const uuIdentityName = session.getIdentity().getName();

    //save shopping list into DB
    const listObject = {
      ...dtoIn,
      awid,
      visibility,
      uuIdentity,
      uuIdentityName,
    }
    const shoppingList = await this.dao.create(listObject) 

    // prepare and return dtoOut
    const dtoOut = { ...shoppingList, uuAppErrorMap };
    return dtoOut;
  }

  async list(awid, dtoIn) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("shoppingListListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // set default value for the pageInfo
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    dtoIn.pageInfo.pageSize ??= 100;
    dtoIn.pageInfo.pageIndex ??= 0;

    // fetch list by visibility
    const dtoOut = await this.dao.listByVisibility(awid, true, dtoIn.pageInfo);

    // prepare and return dtoOut
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ShoppingListAbl();
