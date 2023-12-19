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
  
  describe("uuCmd shoppingList/create", () => {
    test("hds - Executives", async () => {
      await TestHelper.login("ExecutivesUser");

      const dtoIn = {
        name: "Very Good Shopping List",
        text: "Something very funny",
      };
      const result = await TestHelper.executePostCommand("shoppingList/create", dtoIn);
  
      expect(result.data.name).toEqual(dtoIn.name);
      expect(result.data.text).toEqual(dtoIn.text);
      expect(result.data.visibility).toEqual(true);
      expect(result.data.awid).toEqual(TestHelper.awid);
      expect(result.data.uuIdentity).toBeDefined();
      expect(result.data.uuIdentityName).toBeDefined();
      expect(result.data.uuAppErrorMap).toEqual({});
    });

    test("hds - Readers", async () => {
      await TestHelper.login("ReadersUser");
  
      const dtoIn = {
        name: "Very Good Shopping List",
        text: "Something very funny",
      };
      const result = await TestHelper.executePostCommand("shoppingList/create", dtoIn);
  
      expect(result.data.name).toEqual(dtoIn.name);
      expect(result.data.text).toEqual(dtoIn.text);
      expect(result.data.visibility).toEqual(false);
      expect(result.data.awid).toEqual(TestHelper.awid);
      expect(result.data.uuIdentity).toBeDefined();
      expect(result.data.uuIdentityName).toBeDefined();
      expect(result.data.uuAppErrorMap).toEqual({});
    });
  
    test.skip("invalid dtoIn", async () => {
      expect.assertions(3);
      try {
        await TestHelper.executePostCommand("shoppingList/create", {});
      } catch (e) {
        expect(e.code).toEqual("unicorn-fe-be/shoppingList/create/invalidDtoIn");
        expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(2);
        expect(e.status).toEqual(400);
      }
    });
  
    test.skip("textContainsFishyWords", async () => {
      expect.assertions(4);
      const dtoIn = {
        name: "Fishy joke",
        text: "A broccoli is super fun.",
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