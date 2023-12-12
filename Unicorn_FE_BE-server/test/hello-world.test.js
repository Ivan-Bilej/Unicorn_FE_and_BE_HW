const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Hello world uuCMD tests", () => {
  test("helloWorld", async () => {
    const result = await TestHelper.executeGetCommand("helloWorld");
    expect(result.data.text).toEqual("Hello World!");
    expect(result.data.uuAppErrorMap).toEqual({});
  });
})