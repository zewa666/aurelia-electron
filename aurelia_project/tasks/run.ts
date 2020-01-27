import { CLIOptions } from "aurelia-cli";
import * as browserSync from "browser-sync";
import * as historyApiFallback from "connect-history-api-fallback/lib";
import { server } from "electron-connect";
import * as gulp from "gulp";

import * as project from "../aurelia.json";
import build from "./build";
import watch from "./watch";

const electron = server.create();
const serve = gulp.series(
  build,
  (done) => {
    browserSync({
      logLevel: "silent",
      online: false,
      open: CLIOptions.hasFlag("open"),
      port: project.platform.port,
      server: {
        baseDir: [project.platform.baseDir],
        // tslint:disable-next-line:only-arrow-functions
        middleware: [historyApiFallback(), function(req, res, next) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          next();
        }]
      }
      // tslint:disable-next-line:only-arrow-functions
    }, function(err, bs) {
      if (err) { return done(err); }
      const urls = bs.options.get("urls").toJS();
      log(`Application Available At: ${urls.local}`);
      log(`BrowserSync Available At: ${urls.ui}`);
      done();
    });

    electron.start();
  }
);

function log(message) {
  // tslint:disable-next-line:no-console
  console.log(message);
}

function reload() {
  log("Refreshing the browser");
  browserSync.reload();
  electron.restart();
}

const run = gulp.series(
  serve,
  (done) => { watch(reload); done(); }
);

export default run;
