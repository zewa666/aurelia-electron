import { build } from "aurelia-cli";
import * as debounce from "debounce";
import * as gulp from "gulp";
import * as gulpWatch from "gulp-watch";
import * as minimatch from "minimatch";
import * as project from "../aurelia.json";
import copyFiles from "./copy-files";
import processCSS from "./process-css";
import processMarkup from "./process-markup";
import transpile from "./transpile";
import electron from './electron';

const debounceWaitTime = 100;
let isBuilding = false;
const pendingRefreshPaths = [];
let watchCallback = () => { /*noop*/ };
const watches = [
  { name: "transpile", callback: transpile, source: project.transpiler.source },
  { name: "markup", callback: processMarkup, source: project.markupProcessor.source },
  { name: "CSS", callback: processCSS, source: project.cssProcessor.source },
  { name: "electron", callback: electron, source: "backend/**/*.ts" }
];

if (typeof project.build.copyFiles === "object") {
  for (const src of Object.keys(project.build.copyFiles)) {
    watches.push({ name: "file copy", callback: copyFiles, source: src });
  }
}

const watch = (callback?) => {
  watchCallback = callback || watchCallback;

  // watch every glob individually
  for (const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for (const glob of watcher.source) {
        watchPath(glob);
      }
    } else {
      watchPath(watcher.source);
    }
  }
};

const watchPath = (p) => {
  gulpWatch(
    p,
    {
      read: false, // performance optimization: do not read actual file contents
      verbose: true
    },
    (vinyl) => processChange(vinyl));
};

const processChange = (vinyl) => {
  if (vinyl.path && vinyl.cwd && vinyl.path.startsWith(vinyl.cwd)) {
    const pathToAdd = vinyl.path.slice(vinyl.cwd.length + 1);
    log(`Watcher: Adding path ${pathToAdd} to pending build changes...`);
    pendingRefreshPaths.push(pathToAdd);
    refresh();
  }
};

const refresh = debounce(() => {
  if (isBuilding) {
    log("Watcher: A build is already in progress, deferring change detection...");
    return;
  }

  isBuilding = true;

  const paths = pendingRefreshPaths.splice(0);
  const refreshTasks = [];

  // determine which tasks need to be executed
  // based on the files that have changed
  for (const watcher of watches) {
    if (Array.isArray(watcher.source)) {
      for (const source of watcher.source) {
        if (paths.find((path) => minimatch(path, source))) {
          refreshTasks.push(watcher);
        }
      }
    } else {
      if (paths.find((path) => minimatch(path, watcher.source))) {
        refreshTasks.push(watcher);
      }
    }
  }

  if (refreshTasks.length === 0) {
    log("Watcher: No relevant changes found, skipping next build.");
    isBuilding = false;
    return;
  }

  log(`Watcher: Running ${refreshTasks.map((x) => x.name).join(", ")} tasks on next build...`);

  const toExecute = gulp.series(
    readProjectConfiguration,
    gulp.parallel(refreshTasks.map((x) => x.callback)),
    writeBundles,
    (done) => {
      isBuilding = false;
      watchCallback();
      done();
      if (pendingRefreshPaths.length > 0) {
        log("Watcher: Found more pending changes after finishing build, triggering next one...");
        refresh();
      }
    }
  );

  toExecute();
}, debounceWaitTime);

function log(message: string) {
  // tslint:disable-next-line:no-console
  console.log(message);
}

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}

export default watch;
