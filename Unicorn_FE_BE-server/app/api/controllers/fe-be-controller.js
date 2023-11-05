"use strict";
const FEBEAbl = require("../../abl/fe-be-abl.js");

class FEBEController {
  init(ucEnv) {
    return FEBEAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return FEBEAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return FEBEAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new FEBEController();
