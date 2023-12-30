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

describe("delete", () => {
  test("hds - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId
    };

    const result = await TestHelper.executePostCommand("item/delete", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

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

    const result = await TestHelper.executePostCommand("item/delete", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    const itemTest = await TestHelper.executePostCommand("item/create", ITEM)

    const dtoIn = {
      id: itemTest.id,
      shoppingListId: itemTest.shoppingListId
    };

    const result = await TestHelper.executePostCommand("item/delete", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Array of Items", async () => {
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

    const result = await TestHelper.executePostCommand("item/delete", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn - Executives - Single Item", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/delete", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Items", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/delete", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single Item", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("item/delete", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Items", async () => {
    await TestHelper.login("ReadersUser");
    
    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("item/delete", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/item/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
