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

  async create(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let item = {}

    // validation of dtoIn
    const validationResult = Array.isArray(dtoIn)
      ? this.validator.validate("itemArrayCreateDtoInType", dtoIn)
      : this.validator.validate("itemCreateDtoInType", dtoIn);

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Create.UnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );
    
    //get uuIdentity information
    const { _uuIdentity: uuIdentity, _name: uuIdentityName } = session.getIdentity();

    // Create item(s) in DB
    if (Array.isArray(dtoIn)){
      item = await Promise.all(dtoIn.map(async itemDtoIn => {
         return this.dao.create({ awid, ...itemDtoIn, uuIdentity, uuIdentityName, })
      }))
    }
    else{
      item = await this.dao.create({ awid, ...dtoIn, uuIdentity, uuIdentityName, state: "active"});
    }
    
    // return dtoOut
    return {...item, uuAppErrorMap};
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let updatedItem = {}

    // validation of dtoIn
    const validationResult = Array.isArray(dtoIn)
      ? this.validator.validate("itemArrayUpdateDtoInType", dtoIn)
      : this.validator.validate("itemUpdateDtoInType", dtoIn);

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Update.UnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //get uuIdentity information
    const { _uuIdentity: uuIdentity, _name: uuIdentityName } = session.getIdentity();

    // update item(s) in DB
    if (Array.isArray(dtoIn)) {
      updatedItem = await Promise.all(dtoIn.map(async itemDtoIn => {
        const itemObject = {
          ...itemDtoIn,
          awid,
          uuIdentity,
          uuIdentityName,
        }
        return this.dao.update(itemObject)
      }))
    }
    else {
      const itemObject = {
        ...dtoIn,
        awid,
        uuIdentity,
        uuIdentityName,
      }
      updatedItem = await this.dao.update(itemObject) 
    }

    // prepare and return dtoOut
    const dtoOut = {
       ...updatedItem, 
       uuAppErrorMap 
      };
    return dtoOut;
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = Array.isArray(dtoIn)
    ? this.validator.validate("itemArrayDeleteDtoInType", dtoIn)
    : this.validator.validate("itemDeleteDtoInType", dtoIn);
    
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    
    /// delete item from DB
    if (Array.isArray(dtoIn)) {
      await Promise.all(dtoIn.map(async itemDtoIn => {
        return this.dao.delete(itemDtoIn.shoppingListId, awid, itemDtoIn.id)
      }))
    }
    else {
      await this.dao.delete(dtoIn.shoppingListId, awid, dtoIn.id);
    }

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
    return dtoOut;
  }

  async get(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let item = {}

    // validates dtoIn
    const validationResult = Array.isArray(dtoIn)
    ? this.validator.validate("itemArrayGetDtoInType", dtoIn)
    : this.validator.validate("itemGetDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );
    
    // fetch item by ID and shopping list ID
    if (Array.isArray(dtoIn)) {
      item = await Promise.all(dtoIn.map(async itemDtoIn => {
        const state = itemDtoIn.state !== undefined ? itemDtoIn.state : "active"
        return this.dao.get(itemDtoIn.shoppingListId, awid, itemDtoIn.id, state);
      }))
    }
    else {
      const state = dtoIn.state !== undefined ? dtoIn.state : "active"
      item = await this.dao.get(dtoIn.shoppingListId, awid, dtoIn.id, state);
    }

    // prepare and return dtoOut
    const dtoOut = { 
      ...item, 
      uuAppErrorMap };
    return dtoOut;
  }

  async list(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("itemListDtoInType", dtoIn);
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

    // fetch items list
    const state = dtoIn.state !== undefined ? dtoIn.state : "active"
    const dtoOut = await this.dao.list(
      dtoIn.shoppingListId, 
      awid, 
      dtoIn.pageInfo,
      state
      );

    // return dtoOut
    return {...dtoOut, uuAppErrorMap};
  }

  async listInternal(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.List.UnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // fetch items list for shopping list ABL
    const dtoOut = await this.dao.internalList(dtoIn.shoppingListId, awid);

    // return dtoOut
    return {...dtoOut, uuAppErrorMap};
  }
}

module.exports = new ItemAbl();
