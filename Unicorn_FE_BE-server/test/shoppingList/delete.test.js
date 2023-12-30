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


describe("delete", () => {
  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    const shoppingListTest = await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)

    const dtoIn = {
      id: shoppingListTest.id
    };

    const result = await TestHelper.executePostCommand("shoppingList/delete", dtoIn);

    expect(result.success).toEqual(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    const shoppingListTest = await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)

    const dtoIn = {
      id: shoppingListTest.id
    };

    const result = await TestHelper.executePostCommand("shoppingList/delete", dtoIn);

    expect(result.success).toEqual(true);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("shoppingList/delete", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("shoppingList/delete", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });
});
