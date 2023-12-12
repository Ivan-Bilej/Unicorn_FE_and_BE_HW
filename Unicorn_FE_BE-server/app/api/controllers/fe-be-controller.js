"use strict";
const FeBeAbl = require("../../abl/fe-be-abl.js");

class FeBeController {
  init(ucEnv) {
    return FeBeAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return FeBeAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return FeBeAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new FeBeController();
