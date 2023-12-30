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
  userName: "Test Account2"
}


describe("add", () => {
  test("hds - Executives - Single User", async () => {
    await TestHelper.login("ExecutivesUser");

    const dtoIn = USER1
    const result = await TestHelper.executePostCommand("user/add", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result.userId).toEqual(dtoIn.userId); 
    expect(result.userName).toEqual(dtoIn.userName); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("hds - Executives - Array of Users ", async () => {
    await TestHelper.login("ExecutivesUser");

    const dtoIn = [
      USER1,
      USER2,
    ];

    const result = await TestHelper.executePostCommand("user/add", dtoIn)

    expect(Object.keys(result)).toHaveLength(3)
    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result[0].userId).toEqual(USER1.userId); 
    expect(result[0].userName).toEqual(USER1.userName); 
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result[1].userId).toEqual(USER2.userId); 
    expect(result[1].userName).toEqual(USER2.userName); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("hds - Readers - Single User", async () => {
    await TestHelper.login("ReadersUser");

    const dtoIn = USER1
    const result = await TestHelper.executePostCommand("user/add", dtoIn)

    expect(result.shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result.userId).toEqual(dtoIn.userId); 
    expect(result.userName).toEqual(dtoIn.userName); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("hds - Readers - Array of Users ", async () => {
    await TestHelper.login("ReadersUser");

    const dtoIn = [
      USER1,
      USER2,
    ];

    const result = await TestHelper.executePostCommand("user/add", dtoIn)

    expect(Object.keys(result)).toHaveLength(3)
    expect(result[0].shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result[0].userId).toEqual(USER1.userId); 
    expect(result[0].userName).toEqual(USER1.userName); 
    expect(result[1].shoppingListId).toEqual("658ef64a58664a519450bfcb"); 
    expect(result[1].userId).toEqual(USER2.userId); 
    expect(result[1].userName).toEqual(USER2.userName); 
    expect(result.uuAppErrorMap).toEqual({}); 
  });

  test("invalid dtoIn - Executives - Single User", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/add", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/add/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(3); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Executives - Array of Users", async () => {
    await TestHelper.login("ExecutivesUser"); 

    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("user/add", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/add/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(3); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Single User", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/add", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/add/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(3); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers - Array of Users", async () => {
    await TestHelper.login("ReadersUser"); 
    
    expect.assertions(3);
    try {
      const dtoIn = [{}]; // Invalid DTO
      await TestHelper.executePostCommand("user/add", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/add/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(3); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
