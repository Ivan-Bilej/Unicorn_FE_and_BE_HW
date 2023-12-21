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

const SHOPLIST1 = {
  name: "Very Funny Shopping List",
  text: "Something very funny",
};

const SHOPLIST2 = {
  name: "Very Funny Shopping List 2",
  text: "Something very funny 2",
};

const SHOPLIST3 = {
  name: "Very Funny Shopping List 3",
  text: "Something very funny 3",
};

describe("uuCmd shoppingList/list", () => {
  test("hds - default pageInfo; all visible", async () => {
    // create three shoppingLists as ExecutivesUser with visibility:true
    await TestHelper.login("ExecutivesUser");
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST1);
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST2);
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST3);

    const result = await TestHelper.executeGetCommand("shoppingList/list");

    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(0);
    expect(result.data.pageInfo.pageSize).toEqual(100);
  });

  test("hds - default pageInfo; not all visible", async () => {
    // create one shoppingList as ReadersUser with visibility:false
    await TestHelper.login("ReadersUser");
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST1);

    // create two shoppingLists as ExecutivesUser with visibility:true
    await TestHelper.login("ExecutivesUser");
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST2);
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST3);

    const result = await TestHelper.executeGetCommand("shoppingList/list");

    expect(result.data.pageInfo.total).toEqual(2);
  });

  test("hds - custom pageInfo", async () => {
    // create three shoppingLists as ExecutivesUser with visibility:true
    await TestHelper.login("ExecutivesUser");
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST1);
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST2);
    await TestHelper.executePostCommand("shoppingList/create", SHOPLIST3);

    const dtoIn = {
      pageInfo: {
        pageIndex: 1,
        pageSize: 2,
      },
    };
    const result = await TestHelper.executeGetCommand("shoppingList/list", dtoIn);

    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(1);
    expect(result.data.pageInfo.pageSize).toEqual(2);
    expect(result.data.itemList.length).toEqual(1);
  });
});