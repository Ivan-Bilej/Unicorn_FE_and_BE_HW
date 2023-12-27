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

  /**
   * Creates one or more items.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object|Object[]} dtoIn - The data transfer object(s) for item creation.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The created item(s) and any validation errors.
   */
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
    const { uuIdentity, name: uuIdentityName } = session.getIdentity();

    // Create item(s) in DB
    if (Array.isArray(dtoIn)){
      item = await Promise.all(dtoIn.map(async itemDtoIn => {
         return this.dao.create({ awid, ...itemDtoIn, uuIdentity, uuIdentityName, })
      }))
    }
    else{
      item = await this.dao.create({ awid, ...dtoIn, uuIdentity, uuIdentityName, });
    }
    
    // return dtoOut
    return {...item, uuAppErrorMap};
  }

  /**
   * Updates one or more items.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object|Object[]} dtoIn - The data transfer object(s) for item update.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The updated item(s) and any validation errors.
   */
  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let updatedShoppingList = {}

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

     // get uuIdentity information
     const { uuIdentity, name: uuIdentityName } = session.getIdentity();

    // update item(s) in DB
    if (Array.isArray(dtoIn)) {
      updatedShoppingList = await Promise.all(dtoIn.map(async itemDtoIn => {
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
      updatedShoppingList = await this.dao.update(itemObject) 
    }

    // prepare and return dtoOut
    const dtoOut = {
       ...updatedShoppingList, 
       uuAppErrorMap 
      };
    return dtoOut;
  }

  /**
   * Deletes an item.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object} dtoIn - The data transfer object for item deletion.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - Success message and any validation errors.
   */
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

  /**
   * Retrieves an item by ID.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object} dtoIn - The data transfer object for item retrieval.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The retrieved item and any validation errors.
   */
  async get(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Get.UnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // fetch item by ID and shopping list ID
    const shoppingList = await this.dao.get(dtoIn.shoppingListId, awid, dtoIn.id);

    // prepare and return dtoOut
    const dtoOut = { 
      ...shoppingList, 
      uuAppErrorMap };
    return dtoOut;
  }

  /**
   * Lists items based on criteria.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object} dtoIn - The data transfer object for item listing.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The list of items and any validation errors.
   */
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
    const dtoOut = await this.dao.list(dtoIn.shoppingListId, awid, dtoIn.pageInfo);

    // return dtoOut
    return {...dtoOut, uuAppErrorMap};
  }

  /**
   * Lists items internally.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object} dtoIn - The data transfer object for internal item listing.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The list of items and any validation errors.
   */
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
