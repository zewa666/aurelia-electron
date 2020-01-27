import { build as buildCLI, CLIOptions } from "aurelia-cli";
import * as gulp from "gulp";

import * as project from "../aurelia.json";
import copyFiles from "./copy-files";
import electron from "./electron";
import processCSS from "./process-css";
import processJson from "./process-json";
import processMarkup from "./process-markup";
import transpile from "./transpile";
import watch from "./watch";

const build = gulp.series(
  readProjectConfiguration,
  gulp.parallel(
    transpile,
    electron,
    processMarkup,
    processJson,
    processCSS,
    copyFiles
  ),
  writeBundles
);

let main;

if (CLIOptions.taskName() === "build" && CLIOptions.hasFlag("watch")) {
  main = gulp.series(
    build,
    (done) => { watch(); done(); }
  );
} else {
  main = build;
}

function readProjectConfiguration() {
  return buildCLI.src(project);
}

function writeBundles() {
  return buildCLI.dest();
}

export { main as default };
