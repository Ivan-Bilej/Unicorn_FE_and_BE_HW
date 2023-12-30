const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({ uuAppProfileAuthorities: "urn:uu:GGPLUS4U" });
});

afterEach(async () => {
  await TestHelper.teardown();
});

const ITEM = 
  {
    shoppingListId: "658ef64a58664a519450bfcb",
    title: "Item test 12",
    amount: 10,
    unit: "g",
  }

const ITEMARRAY = [
  {
    shoppingListId: "658ef64a58664a519450bfcb",
    title: "Item test 12",
    amount: 10,
    unit: "g",
  },
  {
    shoppingListId: "658ef64a58664a519450bfcb",
    title: "Item test 12",
    amount: 10,
    unit: "g",
  },
];

const ITEMUPDATE = {
  shoppingListId: "658ef64a58664a519450bfcb",
  title: "Item test archived",
  amount: 10,
  unit: "g",
  state: "archived",
}


describe("get", () => {
  test("hds - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Single Item with state Active", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId,
      state: "active"
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.state).toEqual("active")
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Single Item with state Archived", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)
    await TestHelper.executePostCommand("item/update", {
      id: itemTest.id, shoppingListId: itemTest.shoppingListId,
    state: "archived"})

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "archived"
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.state).toEqual("archived")
    expect(result.uuAppErrorMap).toEqual({});
  });

  test.skip("hds - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    itemTest1 = await TestHelper.executePostCommand("item/create", ITEM)
    itemTest2 = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = [
      {
        id: itemTest1.id,
        shoppingListId: "658ef64a58664a519450bfcb"
      },
      {
        id: itemTest2.id,
        shoppingListId: "658ef64a58664a519450bfcb"
      }
    ];

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(Object.keys(result)).toHaveLength(3);
    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[0].title).toEqual("Item test 12");
    expect(result[0].amount).toEqual(10);
    expect(result[0].unit).toEqual("g");
    expect(result[0].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].id).toBeDefined();
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[1].title).toEqual("Item test 12");
    expect(result[1].amount).toEqual(10);
    expect(result[1].unit).toEqual("g");
    expect(result[1].awid).toEqual("22222222222222222222222222222222");
    expect(result[1].id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single Item with state Active", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId,
      state: "active"
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.state).toEqual("active")
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single Item with state Archived", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)
    await TestHelper.executePostCommand("item/update", {
      id: itemTest.id, shoppingListId: itemTest.shoppingListId,
    state: "archived"})

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "archived"
    };

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.state).toEqual("archived")
    expect(result.uuAppErrorMap).toEqual({});
  });

  test.skip("hds - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEMARRAY)

    const dtoIn = [
      {
        id: itemTest[0].id,
        shoppingListId: itemTest[0].shoppingListId
      },
      {
        id: itemTest[1].id,
        shoppingListId: itemTest[1].shoppingListId
      }
    ];

    const result = await TestHelper.executeGetCommand("item/get", dtoIn)

    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[0].title).toEqual("Item test 12");
    expect(result[0].amount).toEqual(10);
    expect(result[0].unit).toEqual("g");
    expect(result[0].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].id).toBeDefined();
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[1].title).toEqual("Item test 12");
    expect(result[1].amount).toEqual(10);
    expect(result[1].unit).toEqual("g");
    expect(result[1].awid).toEqual("22222222222222222222222222222222");
    expect(result[1].id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executeGetCommand("item/get", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executeGetCommand("item/get", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executeGetCommand("item/get", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");
    
    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executeGetCommand("item/get", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});