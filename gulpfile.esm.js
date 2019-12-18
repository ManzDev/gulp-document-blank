import { src, dest, watch, series, parallel } from "gulp";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import postcss from "gulp-postcss";
import cleancss from "gulp-clean-css";
import terser from "gulp-terser";
import rollup from "gulp-rollup";
import rename from "gulp-rename";
import exec from "gulp-exec";
import del from "del";

import babelConfig from "./babel.config.js";
import rollupConfig from "./rollup.config.js";
import tsRollupConfig from "./rollup.config.ts";
import imageminConfig from "./imagemin.config.js";

export const html = () => {
  return (
    src("src/**/*.html")
      // .pipe(newer("dist/"))
      .pipe(dest("dist/"))
  );
};

export const images = () => {
  return (
    src("src/img/**/*.{jpg,png,svg,gif,webp}")
      // .pipe(newer("dist/img/"))
      .pipe(imagemin(imageminConfig))
      .pipe(dest("dist/img/"))
  );
};

export const css = () => {
  return (
    src("src/css/index.css")
      // .pipe(newer("dist/css/index.css"))
      .pipe(postcss())
      .pipe(cleancss())
      .pipe(dest("dist/css/"))
  );
};

export const js = () => {
  return (
    src("src/js/**/*.js")
      // .pipe(newer("dist/js/index.js"))
      .pipe(babel(babelConfig))
      .pipe(rollup(rollupConfig))
      .pipe(terser())
      .pipe(dest("dist/js/"))
  );
};

export const ts = () => {
  return src("src/js/**/*.ts")
    .pipe(newer("dist/js/index.js"))
    .pipe(rollup(tsRollupConfig))
    .pipe(terser())
    .pipe(rename({ extname: ".js" }))
    .pipe(dest("dist/js/"));
};

export const watchhtml = () => watch("src/**/*.html", html);
export const watchcss = () => watch("src/css/**/*.css", css);
export const watchjs = () => watch("src/js/**/*.js", js);
export const watchts = () => watch("src/js/**/*.ts", ts);
export const watchimages = () =>
  watch("src/img/**/*.{jpg,png,svg,gif,webp}", images);

export const live = () => {
  console.log("Iniciando servidor en http://localhost:8080");
  return src("./**/**")
    .pipe(exec("npx live-server --port 8080 dist/"))
    .pipe(exec.reporter({ err: true, stderr: true, stdout: true }));
};

export const dev = () => series(default_tasks, watchdev)();
export const watchdev = () => parallel(live, ...default_watches)();
export const build = () => series(...default_tasks)();
export const clean = () => del("dist/**/*");

const default_tasks = [html, css, process.env.MODE === "ts" ? ts : js, images];
const default_watches = [
  watchhtml,
  watchcss,
  process.env.MODE === "ts" ? watchts : watchjs,
  watchimages
];

export default default_tasks;
