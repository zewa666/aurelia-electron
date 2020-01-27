import { app, BrowserWindow } from "electron";

describe("the main entry", () => {
  it("should listen to app is ready", async () => {
    await import("../../../backend/main");
    // tslint:disable-next-line:no-any
    expect((global as any).onSubscription).toEqual(expect.objectContaining({ ready: expect.any(Function) }));
  });

  it("should create a BrowserWindow once app is ready", async () => {
    const sut = await import("../../../backend/main");
    expect(sut.mainWindow).toBeUndefined();

    app.emit("ready");

    expect(sut.mainWindow instanceof BrowserWindow).toBe(true);
  });
});
