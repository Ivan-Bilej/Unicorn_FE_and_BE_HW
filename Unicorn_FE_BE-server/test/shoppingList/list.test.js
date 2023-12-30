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

const SHOPPINGLIST2 = {
  "title": "Test2",
	"description": "This is test of the create 2",
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

const SHOPPINGLIST3 = {
  "title": "Test3",
	"description": "This is test of the create 3",
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


describe("list", () => {
  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST2)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST3)

    const result = await TestHelper.executeGetCommand("shoppingList/list", {})

    expect(result.itemList).toHaveLength(3); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(3);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - custom pageInfo Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST2)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST3)

    const dtoIn = {
      pageInfo: {
        pageIndex: 0,
        pageSize: 1,
      },
    };

    const result = await TestHelper.executeGetCommand("shoppingList/list", dtoIn)

    expect(result.itemList).toHaveLength(1); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(1);
    expect(result.pageInfo.total).toEqual(3);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST2)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST3)

    const result = await TestHelper.executeGetCommand("shoppingList/list", {})

    expect(result.itemList).toHaveLength(0); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(100);
    expect(result.pageInfo.total).toEqual(0);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("hds - custom pageInfo Readers", async () => {
    await TestHelper.login("ReadersUser");

    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST1)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST2)
    await TestHelper.executePostCommand("shoppingList/create", SHOPPINGLIST3)

    const dtoIn = {
      pageInfo: {
        pageIndex: 0,
        pageSize: 1,
      },
    };

    const result = await TestHelper.executeGetCommand("shoppingList/list", dtoIn)

    expect(result.itemList).toHaveLength(0); 
    expect(result.pageInfo.pageIndex).toEqual(0);
    expect(result.pageInfo.pageSize).toEqual(1);
    expect(result.pageInfo.total).toEqual(0);
    expect(result.uuAppErrorMap).toEqual({});
  });

  test("invalid dtoIn value - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      const dtoIn = {
        pageInfo: {
          pageIndex: -1, // Invalid pageIndex
          pageSize: 5,
        },
      };
      await TestHelper.executeGetCommand("shoppingList/list", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.invalidValueKeyMap).length).toEqual(3);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn value - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      const dtoIn = {
        pageInfo: {
          pageIndex: -1, // Invalid pageIndex
          pageSize: 5,
        },
      };
      await TestHelper.executeGetCommand("shoppingList/list", dtoIn)
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/list/invalidDtoIn");
      expect(Object.keys(e.paramMap.invalidValueKeyMap).length).toEqual(3);
      expect(e.status).toEqual(400);
    }
  });
});
