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


describe("remove", () => {
  test("hds - Executives - Single User", async () => {
    await TestHelper.login("ExecutivesUser");

    const userTest = await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      userId: userTest.userId,
      shoppingListId: userTest.shoppingListId
    };

    const result = await TestHelper.executePostCommand("user/remove", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Executives - Array of Users", async () => {
    await TestHelper.login("ExecutivesUser");

    const userTest1 = await TestHelper.executePostCommand("user/add", USER1)
    const userTest2 = await TestHelper.executePostCommand("user/add", USER2)

    const dtoIn = [
      {
        userId: userTest1.userId,
        shoppingListId: userTest1.shoppingListId
      },
      {
        userId: userTest2.userId,
        shoppingListId: userTest2.shoppingListId
      }
    ];

    const result = await TestHelper.executePostCommand("user/remove", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single User", async () => {
    await TestHelper.login("ReadersUser");

    const userTest = await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      userId: userTest.userId,
      shoppingListId: userTest.shoppingListId
    };

    const result = await TestHelper.executePostCommand("user/remove", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Array of Users", async () => {
    await TestHelper.login("ReadersUser");

    const userTest1 = await TestHelper.executePostCommand("user/add", USER1)
    const userTest2 = await TestHelper.executePostCommand("user/add", USER2)

    const dtoIn = [
      {
        userId: userTest1.userId,
        shoppingListId: userTest1.shoppingListId
      },
      {
        userId: userTest2.userId,
        shoppingListId: userTest2.shoppingListId
      }
    ];

    const result = await TestHelper.executePostCommand("user/remove", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn - Executives - Single User", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/remove", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/remove/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Users", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = []; // Invalid DTO
      await TestHelper.executePostCommand("user/remove", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/remove/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single User", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/remove", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/remove/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Users", async () => {
    await TestHelper.login("ReadersUser");
    
    expect.assertions(3);
    try {
      const dtoIn = []; // Invalid DTO
      await TestHelper.executePostCommand("user/remove", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/remove/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
