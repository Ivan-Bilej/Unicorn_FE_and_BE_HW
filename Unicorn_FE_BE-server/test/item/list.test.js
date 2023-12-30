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

const ITEM1 = 
  {
    shoppingListId: "658ef64a58664a519450bfcb",
    title: "Item test 12",
    amount: 10,
    unit: "g",
  }

  const ITEM2 = 
  {
    shoppingListId: "658ef64a58664a519450bfcb",
    title: "Item test 12",
    amount: 10,
    unit: "g",
  }

  const ITEM3 = 
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


describe("list", () => {
  test("hds - Executives - custom pageInfo", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("item/create", ITEM1)
    await TestHelper.executePostCommand("item/create", ITEM2)
    await TestHelper.executePostCommand("item/create", ITEM3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "active",
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    const result = await TestHelper.executeGetCommand("item/list", dtoIn)

    expect(result.itemList.length).toEqual(3); 
    expect(result.uuAppErrorMap).toEqual({}); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(5);
    expect(result.pageInfo.total).toEqual(3); 
  });

  test("hds - Readers - custom pageInfo", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("item/create", ITEM1)
    await TestHelper.executePostCommand("item/create", ITEM2)
    await TestHelper.executePostCommand("item/create", ITEM3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "active",
      pageInfo: {
        pageIndex: 0,
        pageSize: 5,
      },
    };

    const result = await TestHelper.executeGetCommand("item/list", dtoIn)

    expect(result.itemList.length).toEqual(3); 
    expect(result.uuAppErrorMap).toEqual({}); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(5);
    expect(result.pageInfo.total).toEqual(3); 
  });

  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("item/create", ITEM1)
    await TestHelper.executePostCommand("item/create", ITEM2)
    await TestHelper.executePostCommand("item/create", ITEM3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "active",
    };

    const result = await TestHelper.executeGetCommand("item/list", dtoIn)

    expect(result.itemList.length).toEqual(3); 
    expect(result.uuAppErrorMap).toEqual({}); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(3); 
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("item/create", ITEM1)
    await TestHelper.executePostCommand("item/create", ITEM2)
    await TestHelper.executePostCommand("item/create", ITEM3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      state: "active",
    };

    const result = await TestHelper.executeGetCommand("item/list", dtoIn)

    expect(result.itemList.length).toEqual(3); 
    expect(result.uuAppErrorMap).toEqual({}); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(3); 
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executeGetCommand("item/list", dtoIn)
    } catch (e) {
      // Assertions for error response
      expect(e.code).toEqual("unicorn-fe-be/item/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executeGetCommand("item/list", dtoIn)
    } catch (e) {
      // Assertions for error response
      expect(e.code).toEqual("unicorn-fe-be/item/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
