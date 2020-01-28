import * as path from "path";
import { Application } from "spectron";

describe("Application launch", () => {
  jest.setTimeout(10000);
  let app: Application;

  beforeEach(() => {
    app = new Application({
      args: [path.join(__dirname, "../../dist/aurelia-electron/backend/main.js")],
      path: path.join(__dirname, "../../", "node_modules", ".bin", "electron"),
      requireName: "nodeRequire"
    });
    return app.start();
  });

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it("should show an initial window", async () => {
    const count = await app.client.getWindowCount();
    // It's two because 1 => renderer window 2 => the open devtools
    expect(count).toBe(2);
  });

  it("should have a welcome title", async () => {
    await app.client.waitUntilWindowLoaded();

    const header = await app.client.element("[data-aid='welcome-title']");
    await app.client.waitForVisible(header.selector);

    const text = await app.client.getText(header.selector);

    expect(text).toBe("Hello Aurelia from Electron!");
  });
});
