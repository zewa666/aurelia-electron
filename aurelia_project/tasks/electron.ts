import * as eventStream from "event-stream";
import * as gulp from "gulp";
import * as plumber from "gulp-plumber";
import * as preprocess from "gulp-preprocess";
import * as sourcemaps from "gulp-sourcemaps";
import * as ts from "gulp-typescript";
import { processArgs } from "../process-args";

let typescriptCompiler = null;

function buildTypeScriptElectron() {
  typescriptCompiler = ts.createProject("tsconfig_backend.json", {
    typescript: require("typescript")
  });

  const dts = gulp.src("./custom_typings/**/*.d.ts");

  return eventStream.merge(dts, typescriptCompiler.src())
    // tslint:disable-next-line:no-any
    .pipe(preprocess({ context: { NODE_ENV: processArgs().environment || "development" } }) as any)
    .pipe(plumber({ errorHandler: () => { /**/ } }))
    .pipe(sourcemaps.init())
    .pipe(typescriptCompiler())
    .pipe(sourcemaps.write(".", {
      includeContent: false,
      mapSources: (p) => "../" + p,
    }))
    .pipe(gulp.dest("./dist"));
}

export default gulp.series(
  buildTypeScriptElectron
);
