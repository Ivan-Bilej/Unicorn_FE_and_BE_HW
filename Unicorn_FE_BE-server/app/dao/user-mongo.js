"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class UserMongo extends UuObjectDao {

  async createSchema(){
  }

  async add(user) {
    return await super.insertOne(user);
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

  async remove(shoppingListId, awid, visibility, userId) {
    await super.deleteOne({ shoppingListId, awid, visibility, userId });
  }
}

module.exports = UserMongo;
