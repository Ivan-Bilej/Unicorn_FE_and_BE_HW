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

  async getByVisibility(id, awid) {
    return await super.findOne({ id, awid });
  }

  async getByVisibility(id, awid, visibility) {
    return await super.findOne({ id, awid, visibility });
  }

  async list(awid, visibility, pageInfo) {
    const filter = {awid, visibility};
    return await super.find(filter, pageInfo);
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid, visibility: uuObject.visibility };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(id, awid, visibility) {
    await super.deleteOne({ id, awid, visibility });
  }
}

module.exports = ShoppingListMongo;
