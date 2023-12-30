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

const USER1 = {
  shoppingListId: "658ef64a58664a519450bfcb",
  userId: "3039-912-8064-0000",
  userName: "Test Account"
}

describe("removeMyself", () => {
  test("hds - Executives - Single User", async () => {
    await TestHelper.login("ExecutivesUser");

    const userTest = await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb"
    };

    const result = await TestHelper.executePostCommand("user/removeMyself", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers - Single User", async () => {
    await TestHelper.login("ReadersUser");

    const userTest = await TestHelper.executePostCommand("user/add", USER1)

    const dtoIn = {
      shoppingListId: "658ef64a58664a519450bfcb"
    };

    const result = await TestHelper.executePostCommand("user/removeMyself", dtoIn)

    expect(result.success).toBe(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/removeMyself", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/removeMyself/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {}; // Invalid DTO
      await TestHelper.executePostCommand("user/removeMyself", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/user/removeMyself/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1); // Adjust based on your DTO validation
      expect(e.status).toEqual(400);
    }
  });
});
