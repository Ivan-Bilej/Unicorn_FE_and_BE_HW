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

USER1 = {
  shoppingListId: "658ef64a58664a519450bfcb",
  userId: "123-123-123-123",
  userName: "Test Account"
}

USER2 = {
  shoppingListId: "658ef64a58664a519450bfcb",
  userId: "111-222-333-444",
  userName: "Test Account 2"
}

USER3 = {
  shoppingListId: "658ef64a58664a519450bfcb",
  userId: "555-666-777-888",
  userName: "Test Account 3"
}


describe("list", () => {
  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("user/add", USER1)
    await TestHelper.executePostCommand("user/add", USER2)
    await TestHelper.executePostCommand("user/add", USER3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb"
    }

    const result = await TestHelper.executeGetCommand("user/list", dtoIn)

    expect(result.itemList).toHaveLength(3); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(3);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Custom pageInfo", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("user/add", USER1)
    await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      pageInfo: {
        pageIndex: 0,
        pageSize: 50,
      },
    };

    const result = await TestHelper.executeGetCommand("user/list", dtoIn)

    expect(result.itemList).toHaveLength(2); 
    expect(result.pageInfo.pageIndex).toBe(0);
    expect(result.pageInfo.pageSize).toBe(50); 
    expect(result.pageInfo.total).toBe(2); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("user/add", USER1)
    await TestHelper.executePostCommand("user/add", USER2)
    await TestHelper.executePostCommand("user/add", USER3)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb"
    }

    const result = await TestHelper.executeGetCommand("user/list", dtoIn)

    expect(result.itemList).toHaveLength(3); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(3);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Custom pageInfo", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("user/add", USER1)
    await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb",
      pageInfo: {
        pageIndex: 0,
        pageSize: 50,
      },
    };

    const result = await TestHelper.executeGetCommand("user/list", dtoIn)

    expect(result.itemList).toHaveLength(2); 
    expect(result.pageInfo.pageIndex).toBe(0);
    expect(result.pageInfo.pageSize).toBe(50); 
    expect(result.pageInfo.total).toBe(2); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("invalid dtoIn value - Executives", async () => {
    await TestHelper.login("ExecutivesUser");
    
    expect.assertions(3);
    try {
      const dtoIn = {
        shoppingListId: "658ef64a58664a519450bfcb",
        pageInfo: {
          pageIndex: -1, // Invalid pageIndex
          pageSize: 5,
        },
      };
      await TestHelper.executeGetCommand("user/list", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.invalidValueKeyMap).length).toEqual(3);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn value - Readers", async () => {
    await TestHelper.login("ReadersUser");
    
    expect.assertions(3);
    try {
      const dtoIn = {
        shoppingListId: "658ef64a58664a519450bfcb",
        pageInfo: {
          pageIndex: -1, // Invalid pageIndex
          pageSize: 5,
        },
      };
      await TestHelper.executeGetCommand("user/list", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.invalidValueKeyMap).length).toEqual(3);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");
    
    expect.assertions(3);
    try {
      await TestHelper.executeGetCommand("user/list", {})
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");
    
    expect.assertions(3);
    try {
      await TestHelper.executeGetCommand("user/list", {})
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });
});
