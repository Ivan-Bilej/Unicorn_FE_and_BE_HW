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


describe("update", () => {
  test("hds - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update",
      amount: 100,
      unit: "kg",
    };

    const result = await TestHelper.executePostCommand("item/update", dtoIn)

    expect(result.id).toEqual(itemTest.id);
    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test update");
    expect(result.amount).toEqual(100);
    expect(result.unit).toEqual("kg");
    expect(result.state).toEqual("active");
    expect(result.uuIdentity).toBeDefined();
    expect(result.uuIdentityName).toBeDefined();
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.sys).toBeDefined();
    expect(result.sys.rev).toEqual(1);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest1 = await TestHelper.executePostCommand("item/create", ITEM)
    const itemTest2 = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = [
    {
      id: itemTest1.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update array",
      amount: 100,
      unit: "kg",
      state: "active",
    },
    {
      id: itemTest2.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update array",
      amount: 10,
      unit: "g",
      state: "archived",
    },
    ]

    const result = await TestHelper.executePostCommand("item/update", dtoIn)

    expect(Object.keys(result)).toHaveLength(3);
    expect(result[0].id).toBeDefined();
    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[0].title).toEqual("Item test update array");
    expect(result[0].amount).toEqual(100);
    expect(result[0].unit).toEqual("kg");
    expect(result[0].state).toEqual("active");
    expect(result[0].uuIdentity).toBeDefined();
    expect(result[0].uuIdentityName).toBeDefined();
    expect(result[0].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].sys).toBeDefined();
    expect(result[0].sys.rev).toEqual(1);
    expect(result[1].id).toBeDefined();
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[1].title).toEqual("Item test update array");
    expect(result[1].amount).toEqual(10);
    expect(result[1].unit).toEqual("g");
    expect(result[1].state).toEqual("archived");
    expect(result[1].uuIdentity).toBeDefined();
    expect(result[1].uuIdentityName).toBeDefined();
    expect(result[1].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].sys).toBeDefined();
    expect(result[0].sys.rev).toEqual(1);
  });

  test("hds - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update",
      amount: 100,
      unit: "kg",
    };

    const result = await TestHelper.executePostCommand("item/update", dtoIn)

    expect(result.id).toEqual(itemTest.id);
    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test update");
    expect(result.amount).toEqual(100);
    expect(result.unit).toEqual("kg");
    expect(result.state).toEqual("active");
    expect(result.uuIdentity).toBeDefined();
    expect(result.uuIdentityName).toBeDefined();
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.sys).toBeDefined();
    expect(result.sys.rev).toEqual(1);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest1 = await TestHelper.executePostCommand("item/create", ITEM)
    const itemTest2 = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = [
    {
      id: itemTest1.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update array",
      amount: 100,
      unit: "kg",
      state: "active",
    },
    {
      id: itemTest2.id,
      shoppingListId: "658ef64a58664a519450bfcb",
      title: "Item test update array",
      amount: 10,
      unit: "g",
      state: "archived",
    },
    ]

    const result = await TestHelper.executePostCommand("item/update", dtoIn)

    expect(Object.keys(result)).toHaveLength(3);
    expect(result[0].id).toBeDefined();
    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[0].title).toEqual("Item test update array");
    expect(result[0].amount).toEqual(100);
    expect(result[0].unit).toEqual("kg");
    expect(result[0].state).toEqual("active");
    expect(result[0].uuIdentity).toBeDefined();
    expect(result[0].uuIdentityName).toBeDefined();
    expect(result[0].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].sys).toBeDefined();
    expect(result[0].sys.rev).toEqual(1);
    expect(result[1].id).toBeDefined();
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result[1].title).toEqual("Item test update array");
    expect(result[1].amount).toEqual(10);
    expect(result[1].unit).toEqual("g");
    expect(result[1].state).toEqual("archived");
    expect(result[1].uuIdentity).toBeDefined();
    expect(result[1].uuIdentityName).toBeDefined();
    expect(result[1].awid).toEqual("22222222222222222222222222222222");
    expect(result[0].sys).toBeDefined();
    expect(result[0].sys.rev).toEqual(1);
  });

  test("invalid dtoIn - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/update", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/update", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/update", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/update", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
