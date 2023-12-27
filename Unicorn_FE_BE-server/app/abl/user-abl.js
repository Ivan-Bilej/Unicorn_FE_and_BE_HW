"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/user-error.js");
const Warnings = require("../api/warnings/user-warning.js")

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
    let user = {}

    // validation of dtoIn
    const validationResult = Array.isArray(dtoIn)
      ? this.validator.validate("userArrayAddDtoInType", dtoIn)
      : this.validator.validate("userAddDtoInType", dtoIn);

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Add.UnsupportedKeys.code,
      Errors.Add.InvalidDtoIn
    );

    // Create user(s) in DB
    if (Array.isArray(dtoIn)){
      user = await Promise.all(dtoIn.map(async itemDtoIn => {
         return this.dao.add({ awid, ...itemDtoIn })
      }))
    }
    else{
      user = await this.dao.add({ awid, ...dtoIn });
    }
    
    // return dtoOut
    return {...user, uuAppErrorMap};
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

    // validation of dtoIn
    const validationResult = Array.isArray(dtoIn)
      ? this.validator.validate("userArrayRemoveDtoInType", dtoIn)
      : this.validator.validate("userRemoveDtoInType", dtoIn);

    ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.Remove.UnsupportedKeys.code,
      Errors.Remove.InvalidDtoIn
    );
    
    /// delete item from DB
    if (Array.isArray(dtoIn)) {
      await Promise.all(dtoIn.map( async userDtoIn => {
        await this.dao.remove( userDtoIn.shoppingListId, awid, userDtoIn.userId );
      }))
    }
    else {
      await this.dao.remove( dtoIn.shoppingListId, awid, dtoIn.userId );
    }
    
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
    const validationResult = this.validator.validate("userRemoveMyselfDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.RemoveMyself.UnsupportedKeys.code,
      Errors.RemoveMyself.InvalidDtoIn
    );
    
    const { _uuIdentity: uuIdentity, _name: uuIdentityName } = session.getIdentity();

    /// delete item from DB
    await this.dao.remove(dtoIn.shoppingListId,  awid, uuIdentity );

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
    const validationResult = this.validator.validate("userListDtoInType", dtoIn);
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
    const validationResult = this.validator.validate("userListDtoInType", dtoIn);
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

module.exports = new UserAbl();
