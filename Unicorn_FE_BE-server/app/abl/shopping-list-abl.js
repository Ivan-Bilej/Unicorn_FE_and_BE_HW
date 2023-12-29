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
const UserAbl = require("./user-abl.js");
const UserErrors = require("../api/errors/user-error.js");
const UserWarnings = require("../api/warnings/user-warning.js");
const userAbl = require("./user-abl.js");


const FISHY_WORDS = [];
const EXECUTIVES_PROFILE = "Executives";

const WARNINGS = {

};

class ShoppingListAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("shoppingList");
  }

  async getVisibility(awid, shoppingListId, session, authorizationResult) {
    try {
      const shoppingList = await this.dao.get(awid, shoppingListId);
      const allowedUsers = (await UserAbl.listInternal(
        awid, 
        { shoppingListId: shoppingListId }, 
        session, 
        authorizationResult
      )).map(allowedUser => allowedUser.id);
  
      return (
        shoppingList.uuIdentity === session.getIdentity()._uuIdentity ||
        allowedUsers.includes(session.getIdentity()._uuIdentity)
      );
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
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
    
    // Create shopping list
    const shoppingList = await this.dao.create(listObject) 

    // Create items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await Promise.all(dtoIn.items.map(async itemDtoIn => {
        itemDtoIn.shoppingListId = String(shoppingList.id)
        itemDtoIn.visibility = visibility
        return await ItemAbl.create(awid, itemDtoIn, session, authorizationResult);
      }));
    }

    // Add users if they exist in dtoIn
    if (dtoIn.allowedUsers && Array.isArray(dtoIn.allowedUsers)){
      allowedUsers = await Promise.all(dtoIn.allowedUsers.map(async userDtoIn => {
        userDtoIn.shoppingListId = String(shoppingList.id)
        userDtoIn.visibility = visibility
        return await UserAbl.add(awid, userDtoIn, session, authorizationResult)
      }))
    }

    // prepare and return dtoOut
    if (shoppingList){
      shoppingList.items = items.itemList.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit}))
      shoppingList.allowedUsers = allowedUsers.itemList.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    }
    const dtoOut = { 
      ...shoppingList, 
      uuAppErrorMap  
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
    const shoppingList = this.dao.get(awid, dtoIn, session, authorizationResult)
    const visibility = shoppingList.uuIdentity === session.getIdentity()._uuIdentity ? true : false

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
    const updatedShoppingList = await this.dao.update(listObject) 

    // Update items if they exist in dtoIn
    if (dtoIn.items && Array.isArray(dtoIn.items)) {
      items = await Promise.all(dtoIn.items.map(async itemDtoIn => {
        itemDtoIn.shoppingListId = String(updatedShoppingList.id)
        itemDtoIn.visibility = visibility
        return await ItemAbl.update(awid, itemDtoIn, session, authorizationResult);
      }));
    }

    // fetch users of the shopping list 
    const allowedUsers = await UserAbl.listInternal(awid, {shoppingListId: dtoIn.id, visibility: visibility}, session, authorizationResult)
    
    // prepare and return dtoOut
    if (updatedShoppingList){
      updatedShoppingList.items = items.itemList.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit}))
      updatedShoppingList.allowedUsers = allowedUsers.itemList.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    }
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

    // set visibility
    const shoppingList = this.dao.get(awid, dtoIn, session, authorizationResult)
    const visibility = shoppingList.uuIdentity === session.getIdentity()._uuIdentity ? true : false

    /// delete shopping list from DB
    await this.dao.delete(awid, visibility, dtoIn.id);
    
    // delete all items connected to the shopping list
    do {
      const items = await ItemAbl.listInternal(
        awid, {shoppingListId: dtoIn.id}, session, authorizationResult
      );
    
      if (items.itemList.length > 0) {
        await Promise.all(items.itemList.map(async itemDtoIn => {
          itemDtoIn = {
            id: String(itemDtoIn.id), 
            shoppingListId: String(itemDtoIn.shoppingListId),
            visibility: visibility,
          }
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
          userDtoIn = {
            userId: String(userDtoIn.userId), 
            shoppingListId: String(userDtoIn.shoppingListId),
            visibility: visibility,
          }
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

    // set visibility
    console.log(dtoIn)
    console.log(dtoIn.id)
    const visibility = await this.getVisibility(awid, dtoIn.id, session, authorizationResult)
    console.log("Visibility: " + visibility)

    // fetch shopping list by ID
    const shoppingList = await this.dao.getByVisibility(dtoIn.id, awid, visibility);

    // fetch items of the shopping list
    const items = await ItemAbl.listInternal(awid, {shoppingListId: dtoIn.id, visibility: visibility}, session, authorizationResult)

    // fetch users of the shopping list
    const allowedUsers = await UserAbl.listInternal(awid, {shoppingListId: dtoIn.id, visibility: visibility}, session, authorizationResult)

    // prepare and return dtoOut
    if (shoppingList){
      shoppingList.items = items.itemList.map(item => ({id: item.id, title: item.title, amount: item.amount, unit: item.unit}))
      shoppingList.allowedUsers = allowedUsers.itemList.map(allowedUser => ({userId: allowedUser.userId, userName: allowedUser.userName}))
    }
    const dtoOut = { 
      ...shoppingList,
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

    // set visibility
    const visibility = await this.getVisibility(awid, ...dtoIn, session, authorizationResult)

    // set default value for the pageInfo
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    dtoIn.pageInfo.pageSize ??= 100;
    dtoIn.pageInfo.pageIndex ??= 0;

    // fetch list by visibility
    const dtoOut = await this.dao.list(awid, visibility, dtoIn.pageInfo);

    // prepare and return dtoOut
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ShoppingListAbl();
