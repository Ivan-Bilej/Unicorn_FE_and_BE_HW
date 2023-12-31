"use strict";
const ShoppingListAbl = require("../../abl/shopping-list-abl.js");

class ShoppingListController {
  create(ucEnv) {
    return ShoppingListAbl.create(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

  get(ucEnv){
    return ShoppingListAbl.get(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

  update(ucEnv) {
    return ShoppingListAbl.update(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

  list(ucEnv) {
    return ShoppingListAbl.list(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

  delete(ucEnv){
    return ShoppingListAbl.delete(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

}

module.exports = new ShoppingListController();
