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

const SHOPPINGLIST1 = {
  "title": "Test1",
	"description": "This is test of the create 1",
	"imageUrl": "Hahahahahaha",
	"items": [
		{
			"title": "Test Item",
			"amount": 20,
			"unit" : "kg"
		},
		{
			"title": "Test Item",
			"amount": 20,
			"unit" : "kg"
		},
		{
			"title": "Test Item",
			"amount": 20,
			"unit" : "kg"
		}
	],
	"allowedUsers": [
		{
			"userId": "123-123-123-123",
			"userName": "Kyle"
		},
		{
			"userId": "123-123-123-555",
			"userName": "Kyle 2"
		}
	]
}


describe("get", () => {
  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    const shoppingListTest = await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)

    const dtoIn = {
      id: shoppingListTest.id
    };

    const result = await TestHelper.executeGetCommand("shoppingList/get", dtoIn)

    expect(result.title).toEqual("Test1");
    expect(result.description).toEqual("This is test of the create 1");
    expect(result.imageUrl).toEqual("Hahahahahaha");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.visibility).toEqual(true);
    expect(result.uuIdentity).toEqual("3039-912-8064-0000");
    expect(result.uuIdentityName).toEqual("uuEE 3039-912-8064-0000");
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.items).toHaveLength(3); // Check if items were fetched
    expect(result.allowedUsers).toHaveLength(2); // Check if allowed users were fetched
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    const shoppingListTest = await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)

    const dtoIn = {
      id: shoppingListTest.id
    };

    const result = await TestHelper.executeGetCommand("shoppingList/get", dtoIn)

    expect(result.title).toEqual("Test1");
    expect(result.description).toEqual("This is test of the create 1");
    expect(result.imageUrl).toEqual("Hahahahahaha");
    expect(result.awid).toEqual("22222222222222222222222222222222");
    expect(result.visibility).toEqual(false);
    expect(result.uuIdentity).toEqual("3039-912-8064-0000");
    expect(result.uuIdentityName).toEqual("uuEE 3039-912-8064-0000");
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.items).toHaveLength(3); // Check if items were fetched
    expect(result.allowedUsers).toHaveLength(2); // Check if allowed users were fetched
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      await TestHelper.executeGetCommand("shoppingList/get", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      await TestHelper.executeGetCommand("shoppingList/get", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });
});
