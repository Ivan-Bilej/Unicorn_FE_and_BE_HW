"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/shopping-list-error.js");
const Warnings = require("../api/warnings/shopping-list-warning.js");
const itemAbl = require("./item-abl.js");
const ItemAbl = itemAbl

const FISHY_WORDS = [];
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
    let items = [];

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      const validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
      uuAppErrorMap = ValidationHelper.processValidationResult(
        dtoIn,
        validationResult,
        uuAppErrorMap,
        Warnings.Create.UnsupportedKeys.code,
        Errors.Create.InvalidDtoIn
      );
    }


    // check for fishy words
    FISHY_WORDS.forEach((word) => {
      if (dtoIn.text.includes(word)) {
        throw new Errors.Create.TextContainsFishyWords({ uuAppErrorMap }, { text: dtoIn.text, fishyWord: word });
      }
    });

    // set visibility
    const visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);
    console.log(authorizationResult)
    console.log(authorizationResult.getAuthorizedProfiles())
    console.log(authorizationResult.getAuthorizedProfiles().includes())

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

    // Create items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await dtoIn.items.map(async itemDto => {
        return await ItemAbl.create(awid, itemDto, session);
      });
    }

    // prepare and return dtoOut
    const dtoOut = { ...shoppingList, items: items.map(item => item.id), uuAppErrorMap };
    return dtoOut;
  }

  async get(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("shoppingListGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // fetch list by ID
    const shoppingList = await this.dao.get(awid, dtoIn._id);

    // Create items if they exist in dtoIn
    let items = await ItemsAbl.get(awid, session);

    // prepare and return dtoOut
    const dtoOut = { ...shoppingList, items: items.map(item => item.id), uuAppErrorMap };
    return dtoOut;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validation of dtoIn
    const validationResult = this.validator.validate("shoppingListUpdateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

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
    const updatedShoppingList = await this.dao.update(listObject) 

    // Create items if they exist in dtoIn
    let items = [];
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await dtoIn.items.map(async itemDto => {
        return await ItemsAbl.update(awid, itemDto, session);
      });
    }

    // prepare and return dtoOut
    const dtoOut = { ...updatedShoppingList, items: items.map(item => item.id), uuAppErrorMap };
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("shoppingListDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    /// delete shopping list from DB
    await this.dao.delete(awid, dtoIn._id);

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
    return dtoOut;
  }

  async list(awid, dtoIn, session, authorizationResult) {
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
