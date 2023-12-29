"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {}

  async create(item) {
    return await super.insertOne(item);
  }

  async get(shoppingListId, awid, visibility, id) {
    return await super.findOne({ shoppingListId, id, visibility, awid,  });
  }

  async list(shoppingListId, awid, visibility, pageInfo) {
    const filter = {
      shoppingListId,
      awid,
      visibility,
    };

    return await super.find(filter, pageInfo);
  }

  async internalList(shoppingListId, awid, visibility) {
    const filter = {
      shoppingListId,
      awid,
      visibility,
    };

    return await super.find(filter);
  }

  async update(uuObject) {
    let filter = { 
      id: uuObject.id, 
      awid: uuObject.awid, 
      visibility: uuObject.visibility, 
      shoppingListId: uuObject.shoppingListId};
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(shoppingListId, awid, visibility, id) {
    await super.deleteOne({ shoppingListId, awid, visibility, id });
  }
}

module.exports = ItemMongo;
