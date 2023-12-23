"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {}

  async create(item) {
    return await super.insertOne(item);
  }

  async get(shoppingListId, awid, id) {
    return await super.findOne({ shoppingListId, id, awid,  });
  }

  async list(shoppingListId, awid, pageInfo) {
    const filter = {
      shoppingListId,
      awid,
    };

    return await super.find(filter, pageInfo);
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid, shoppingListId: uuObject.shoppingListId};
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(shoppingListId, awid, id) {
    await super.deleteOne({ shoppingListId, awid, id });
  }
}

module.exports = ItemMongo;
