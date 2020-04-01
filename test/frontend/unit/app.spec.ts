import { App } from "../../../src/app";

describe("the app", () => {
  xit("says hello", () => {
    expect(new App().message).toBe("Hello Aurelia from Electron!");
  });
});
