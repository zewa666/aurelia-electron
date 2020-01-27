import * as gulp from 'gulp';
import tslint from 'gulp-tslint';
import * as gulpStylelint from "gulp-stylelint";
import * as merge from "merge-stream";
import * as ts from "typescript";
import * as tsl from "tslint";

import * as project from '../aurelia.json';

export default function lint() {
  const tslintProgram = tsl.Linter.createProgram("./tsconfig.json", ".");
  ts.getPreEmitDiagnostics(tslintProgram);

  const tsLinting = gulp.src([project.transpiler.source])
    .pipe(tslint({
      tslint: require("tslint"),
      formatter: 'prose',
      program: tslintProgram
    }))
    .pipe(tslint.report());

  const scssLinting = gulp.src(project.cssProcessor.source)
    .pipe(gulpStylelint({
      reporters: [
        { formatter: "string", console: true }
      ]
    }));

  return merge(tsLinting, scssLinting);
}
