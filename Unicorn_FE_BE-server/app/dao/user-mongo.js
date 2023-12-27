"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class UserMongo extends UuObjectDao {

  async createSchema(){
  }

  async add(user) {
    return await super.insertOne(item);
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

  async remove(shoppingListId, awid, id) {
    await super.deleteOne({ shoppingListId, awid, id });
  }

  async removeMyself(shoppingListId, awid, id) {
    await super.deleteOne({ shoppingListId, awid, id });
  }
}

module.exports = UserMongo;
