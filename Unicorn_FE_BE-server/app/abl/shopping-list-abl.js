"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/shopping-list-error.js");
const Warnings = require("../api/warnings/shopping-list-warning.js");
const ItemAbl = require("./item-abl.js");
const ItemErrors = require("../api/errors/item-error.js");
const ItemWarnings = require("../api/warnings/item-warning.js");
const { type } = require("os");

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
    let allowedUsers = [];

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
    const listDtoIn = {...dtoIn}
    delete listDtoIn.items
    delete listDtoIn.allowedUsers
    const listObject = {
      ...listDtoIn,
      awid,
      visibility,
      uuIdentity,
      uuIdentityName,
    }
    
    // Create shopping list
    const shoppingList = await this.dao.create(listObject) 

    // Create items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await Promise.all(dtoIn.items.map(async itemDtoIn => {
        itemDtoIn.shoppingListId = String(shoppingList.id)
        return await ItemAbl.create(awid, itemDtoIn, session, authorizationResult);
      }));
    }

    // prepare and return dtoOut
    const dtoOut = { 
      ...shoppingList, 
      items: items.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit})), 
      allowedUsers: allowedUsers.map(allowedUser => ({id: allowedUser.id})), 
      uuAppErrorMap, 
    };
    return dtoOut;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let items = [];
    let allowedUsers = [];

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
    const listDtoIn = {...dtoIn}
    delete listDtoIn.items
    delete listDtoIn.allowedUsers
    const listObject = {
      ...listDtoIn,
      awid,
      visibility,
      uuIdentity,
      uuIdentityName,
    }
    const updatedShoppingList = await this.dao.update(listObject) 

    // Update items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await Promise.all(dtoIn.items.map(async itemDtoIn => {
        itemDtoIn.shoppingListId = String(updatedShoppingList.id)
        return await ItemAbl.update(awid, itemDtoIn, session, authorizationResult);
      }));
    }

    // prepare and return dtoOut
    const dtoOut = {
      ...updatedShoppingList, 
      items: items.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit})), 
      allowedUsers: allowedUsers.map(allowedUser => ({id: allowedUser.id})), 
      uuAppErrorMap 
      };
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
    await this.dao.delete(awid, dtoIn.id);
    
    // delete all items connected to the shopping list
    do {
      const items = await ItemAbl.listInternal(
        awid, 
        {
          shoppingListId: dtoIn.id, 
        }, 
        session, 
        authorizationResult
      );
    
      console.log(items);
    
      if (items.itemList.length > 0) {
        await Promise.all(items.itemList.map(async itemDtoIn => {
          itemDtoIn = {id: String(itemDtoIn.id), shoppingListId: String(itemDtoIn.shoppingListId)}
          return await ItemAbl.delete(awid, itemDtoIn, session, authorizationResult) 
        }))
      } else {
        // No more items on this page, break out of the loop
        break;
      }
    } while (true);

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
    return dtoOut;
  }

  async get(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let allowedUsers = [];

    // validates dtoIn
    const validationResult = this.validator.validate("shoppingListGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // fetch shopping list by ID
    const shoppingList = await this.dao.get(awid, dtoIn.id);

    const items = await ItemAbl.listInternal(awid, {shoppingListId: dtoIn.id}, session, authorizationResult)
    console.log(items)

    // prepare and return dtoOut
    const dtoOut = { 
      ...shoppingList, 
      items: items.itemList.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit})),
      allowedUsers: allowedUsers.map(allowedUser => ({id: allowedUser.id})), 
      uuAppErrorMap };
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
