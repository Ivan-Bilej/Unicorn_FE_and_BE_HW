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

ITEM = {
  shoppingListId: "658ef64a58664a519450bfcb",
  title: "Item test 12",
  amount: 10,
  unit: "g",
}

ITEMARRAY = [
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
]

describe("create", () => {
  test("hds - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    const dtoIn = ITEM;

    const result = await TestHelper.executePostCommand("item/create", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    const dtoIn = ITEMARRAY

    const result = await TestHelper.executePostCommand("item/create", dtoIn)

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
  });

  test("hds - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    const dtoIn = ITEM

    const result = await TestHelper.executePostCommand("item/create", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb");
    expect(result.title).toEqual("Item test 12");
    expect(result.amount).toEqual(10);
    expect(result.unit).toEqual("g");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.id).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");

    const dtoIn = ITEMARRAY;

    const result = await TestHelper.executePostCommand("item/create", dtoIn)

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
  });

  test("invalid dtoIn - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/create", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(4); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser"); 

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/create", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(4); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/create", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(4); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser"); 
    
    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/create", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(4); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
