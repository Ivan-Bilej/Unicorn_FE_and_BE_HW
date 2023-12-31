"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const Errors = require("../api/errors/shopping-list-error.js");
const Warnings = require("../api/warnings/shopping-list-warning.js");
const ItemAbl = require("./item-abl.js");
const UserAbl = require("./user-abl.js");
const { log } = require("console");

const FISHY_WORDS = ["barracuda", "broccoli", "Topolánek"];
const EXECUTIVES_PROFILE = "Executives";

const logger = LoggerFactory.get("UnicornFeBe.Abls.ShoppingListAbl");

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
      if (dtoIn.description.includes(word)) {
        throw new Errors.Create.TextContainsFishyWords({ uuAppErrorMap }, { text: dtoIn.description, fishyWord: word });
      }
    });

    // set visibility
    const visibility = authorizationResult.getAuthorizedProfiles().includes(EXECUTIVES_PROFILE);

    //get uuIdentity information
    const { _uuIdentity: uuIdentity, _name: uuIdentityName } = session.getIdentity();

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
    
    if (logger.isDebugLoggable()) {
      logger.debug("Creating shopping list with parameters: " + JSON.stringify(listObject));
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

    // Add users if they exist in dtoIn
    if (dtoIn.allowedUsers && Array.isArray(dtoIn.allowedUsers)){
      allowedUsers = await Promise.all(dtoIn.allowedUsers.map(async userDtoIn => {
        userDtoIn.shoppingListId = String(shoppingList.id)
        return await UserAbl.add(awid, userDtoIn, session, authorizationResult)
      }))
    }

    // prepare and return dtoOut
    shoppingList.items = items.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit, state: item.state}))
    shoppingList.allowedUsers = allowedUsers.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    const dtoOut = { 
      ...shoppingList, 
      uuAppErrorMap, 
    };
    return dtoOut;
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let items = [];

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
    const { _uuIdentity: uuIdentity, _name: uuIdentityName } = session.getIdentity();

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

    if (logger.isDebugLoggable()) {
      logger.debug("Updating shopping list with parameters: " + JSON.stringify(listObject));
    }

    // Update existing shopping list
    const updatedShoppingList = await this.dao.update(listObject) 

    // Update items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await Promise.all(dtoIn.items.map(async itemDtoIn => {
        itemDtoIn.shoppingListId = String(updatedShoppingList.id)
        return await ItemAbl.update(awid, itemDtoIn, session, authorizationResult);
      }));
    }

    // fetch users of the shopping list 
    const allowedUsers = await UserAbl.listInternal(awid, {shoppingListId: dtoIn.id}, session, authorizationResult)
    
    // prepare and return dtoOut
    updatedShoppingList.items =  items.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit, state: item.state}))
    updatedShoppingList.allowedUsers= allowedUsers.itemList.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    const dtoOut = {
      ...updatedShoppingList, 
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
        awid, {shoppingListId: dtoIn.id}, session, authorizationResult
      );
    
      if (items.itemList.length > 0) {
        await Promise.all(items.itemList.map(async itemDtoIn => {
          itemDtoIn = {id: String(itemDtoIn.id), shoppingListId: String(itemDtoIn.shoppingListId)}
          return await ItemAbl.delete(awid, itemDtoIn, session, authorizationResult) 
        }))
      } else {
        break;
      }
    } while (true);

    // remove all users connected to the shopping list
    do {
      const users = await UserAbl.listInternal(
        awid, {shoppingListId: dtoIn.id}, session, authorizationResult
      );
    
      if (users.itemList.length > 0) {
        await Promise.all(users.itemList.map(async userDtoIn => {
          userDtoIn = {userId: String(userDtoIn.userId), shoppingListId: String(userDtoIn.shoppingListId)}
          return await UserAbl.remove(awid, userDtoIn, session, authorizationResult) 
        }))
      } else {
        break;
      }
    } while (true);

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
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

    // fetch shopping list by ID
    const shoppingList = await this.dao.get(awid, dtoIn.id);

    // fetch items of the shopping list
    const items = await ItemAbl.listInternal(awid, {shoppingListId: dtoIn.id}, session, authorizationResult)

    // fetch users of the shopping list
    const allowedUsers = await UserAbl.listInternal(awid, {shoppingListId: dtoIn.id}, session, authorizationResult)

    // prepare and return dtoOut
    shoppingList.items = items.itemList.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit, state: item.state}))
    shoppingList.allowedUsers = allowedUsers.itemList.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    const dtoOut = { 
      ...shoppingList, 
      uuAppErrorMap, 
    };
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
