

export class App {
  public message: string = "Hello Aurelia from Electron!";
  public flashdemo: string;

  constructor() {
    const { remote } = (window as any).electronRequire('electron');
    const path = (window as any).electronRequire('path');

    this.flashdemo = remote.process.env.NODE_ENV === "development"
      ? "./build/assets/flashdemo.swf"
      : path.join(path.dirname(remote.app.getPath('exe')), "./build/assets/flashdemo.swf");
  }
}
