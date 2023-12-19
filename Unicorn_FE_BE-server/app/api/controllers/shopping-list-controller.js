"use strict";
const ShoppingListAbl = require("../../abl/shopping-list-abl.js");

class ShoppingListController {
  create(ucEnv) {
    //const awid = ucEnv.getUri().getAwid();
    //const dtoIn = ucEnv.parameters;
    return ShoppingListAbl.create(
      ucEnv.getUri().getAwid(), 
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult()
      );
  }

  list(ucEnv) {
    return ShoppingListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn())
  }

}

module.exports = new ShoppingListController();
