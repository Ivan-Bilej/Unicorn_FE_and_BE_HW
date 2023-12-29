"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class UserMongo extends UuObjectDao {

  async createSchema(){
  }

  async add(user) {
    return await super.insertOne(user);
  }

  async list(shoppingListId, awid, pageInfo) {
    const filter = {
      shoppingListId,
      awid,
    };

    return await super.find(filter, pageInfo);
  }

  async internalList(shoppingListId, awid) {
    const filter = {
      shoppingListId,
      awid,
    };

    return await super.find(filter);
  }

  async remove(shoppingListId, awid, userId) {
    await super.deleteOne({ shoppingListId, awid, userId });
  }
}

module.exports = UserMongo;
