jest.mock("electron-connect");
jest.mock("electron", () => {
  // tslint:disable-next-line:no-any
  (global as any).onSubscription = {};

  return {
    BrowserWindow: class {
      public loadFile = jest.fn();
      public webContents = {
        openDevTools: jest.fn()
      };
      public on = () => { /**/ };
      public maximize = () => { /**/ };
    },
    app: {
      // tslint:disable-next-line:no-any
      emit: (event: string) => { (global as any).onSubscription[event](); },
      // tslint:disable-next-line:no-any
      on: (event: string, callback: () => any) => { (global as any).onSubscription[event] = callback; },
      quit: () => { /**/ },
    }
  };
});
