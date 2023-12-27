"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/user-error.js");

const WARNINGS = {

};

class UserAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("user");
  }

  /**
   * Creates one or more items.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object|Object[]} dtoIn - The data transfer object(s) for item creation.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - The created item(s) and any validation errors.
   */
  async add(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    let item = {}

    console.log(dtoIn)

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
   * Deletes an item.
   * @param {string} awid - The unique workspace identifier.
   * @param {Object} dtoIn - The data transfer object for item deletion.
   * @param {Object} session - The user session.
   * @param {Object} authorizationResult - The authorization result.
   * @returns {Object} - Success message and any validation errors.
   */
  async remove(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    
    /// delete item from DB
    await this.dao.delete(dtoIn.shoppingListId, awid, dtoIn.id);

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
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
  async removeMyself(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // validates dtoIn
    const validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Delete.UnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );
    
    /// delete item from DB
    await this.dao.delete(dtoIn.shoppingListId, awid, dtoIn.id);

    // return dtoOut with success message
    const dtoOut = { success: true, uuAppErrorMap };
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
}

module.exports = new UserAbl();
