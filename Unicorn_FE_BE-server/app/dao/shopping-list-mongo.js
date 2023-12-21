"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ShoppingListMongo extends UuObjectDao {
  async createSchema() {}

  async create(shoppingList) {
    return await super.insertOne(shoppingList);
  }

  async listByVisibility(awid, visibility, pageInfo = {}) {
    const filter = { awid, visibility };

    return await super.find(filter, pageInfo);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async list(awid, pageInfo) {
    const filter = {
      awid,
    };

    return await super.find(filter, pageInfo);
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }
}

module.exports = ShoppingListMongo;
