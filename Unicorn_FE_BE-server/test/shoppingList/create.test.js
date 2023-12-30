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

describe("create", () => {
  test("hds - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    const dtoIn = {
      title: "Test5",
      description: "This is test of the create",
      imageUrl: "Hahahahahaha",
      items: [
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
      ],
      allowedUsers: [
        {
          userId: "123-123-123-123",
          userName: "Kyle",
        },
        {
          userId: "123-123-123-555",
          userName: "Kyle 2",
        },
      ],
    };

    const result = await TestHelper.executePostCommand("shoppingList/create", dtoIn);

    expect(result.title).toEqual(dtoIn.title);
    expect(result.description).toEqual(dtoIn.description);
    expect(result.imageUrl).toEqual(dtoIn.imageUrl);
    expect(result.visibility).toEqual(true);
    expect(result.awid).toEqual(TestHelper.awid);
    expect(result.uuIdentity).toBeDefined();
    expect(result.uuIdentityName).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.items).toHaveLength(3); // Check if items were created
    expect(result.allowedUsers).toHaveLength(2); // Check if allowed users were added
  });

  test("hds - Readers", async () => {
    await TestHelper.login("ReadersUser");

    const dtoIn = {
      title: "Test5",
      description: "This is test of the create",
      imageUrl: "Hahahahahaha",
      items: [
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
        {
          title: "Test Item",
          amount: 20,
          unit: "kg",
        },
      ],
      allowedUsers: [
        {
          userId: "123-123-123-123",
          userName: "Kyle",
        },
        {
          userId: "123-123-123-555",
          userName: "Kyle 2",
        },
      ],
    };

    const result = await TestHelper.executePostCommand("shoppingList/create", dtoIn);

    expect(result.title).toEqual(dtoIn.title);
    expect(result.description).toEqual(dtoIn.description);
    expect(result.imageUrl).toEqual(dtoIn.imageUrl);
    expect(result.visibility).toEqual(false);
    expect(result.awid).toEqual(TestHelper.awid);
    expect(result.uuIdentity).toBeDefined();
    expect(result.uuIdentityName).toBeDefined();
    expect(result.uuAppErrorMap).toEqual({});
    expect(result.items).toHaveLength(3); // Check if items were created
    expect(result.allowedUsers).toHaveLength(2); // Check if allowed users were added
  });

  test("invalid dtoIn - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("shoppingList/create", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(5);
      expect(e.status).toEqual(400);
    }
  });

  test("invalid dtoIn - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("shoppingList/create", {});
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(5);
      expect(e.status).toEqual(400);
    }
  });

  test("textContainsFishyWords - Executives", async () => {
    await TestHelper.login("ExecutivesUser");

    expect.assertions(4);
    const dtoIn = {
      title: "Fishy joke",
      description: "A broccoli is super fun.",
      imageUrl: "https://example.com/image.png",
      items: [],
      allowedUsers: [],
    };

    try {
      await TestHelper.executePostCommand("shoppingList/create", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/create/textContainsFishyWords");
      expect(e.paramMap.text).toEqual("A broccoli is super fun.");
      expect(e.paramMap.fishyWord).toEqual("broccoli");
      expect(e.status).toEqual(400);
    }
  });

  test("textContainsFishyWords - Readers", async () => {
    await TestHelper.login("ReadersUser");

    expect.assertions(4);
    const dtoIn = {
      title: "Fishy joke",
      description: "A broccoli is super fun.",
      imageUrl: "https://example.com/image.png",
      items: [],
      allowedUsers: [],
    };

    try {
      await TestHelper.executePostCommand("shoppingList/create", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("unicorn-fe-be/shoppingList/create/textContainsFishyWords");
      expect(e.paramMap.text).toEqual("A broccoli is super fun.");
      expect(e.paramMap.fishyWord).toEqual("broccoli");
      expect(e.status).toEqual(400);
    }
  });
});
