"use strict";

let gulp = require("gulp");
let del = require("del");
let rename = require("gulp-rename");
let plumber = require("gulp-plumber");
let sourcemap = require("gulp-sourcemaps");
let sass = require("gulp-sass");
let postcss = require("gulp-postcss");
let autoprefixer = require("autoprefixer");
let server = require("browser-sync").create();
let htmlmin = require("gulp-htmlmin");
let csso = require("gulp-csso");
let imagemin = require("gulp-imagemin");
let mozjpeg = require("imagemin-mozjpeg");
let webp = require("gulp-webp");
let svgstore = require("gulp-svgstore");
let uglyfly = require("gulp-uglyfly");
let babel = require("gulp-babel");
let iife = require("gulp-iife");
const isProduction = process.env.NODE_ENV;

gulp.task("html", function () {
  return  gulp.src("source/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("css", function () {
  if (isProduction) {
    return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  } else {
    return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
  }
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 80}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo(),
      mozjpeg({quality: 80})
      ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("js", function () {
  if (isProduction) {
    return gulp.src("source/js/**/*.js")
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglyfly())
    .pipe(iife({useStrict: false}))
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest("build/js"));
  } else {
    return gulp.src("source/js/**/*.js")
    .pipe(sourcemap.init())
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(uglyfly())
    .pipe(iife({useStrict: false}))
    .pipe(rename({extname: ".min.js"}))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"));
  }
});

gulp.task("sprite", function() {
  return gulp.src("source/img/{icon,logo}-*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/*.ico",
    "source/css/*.css"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/*.{jpg,png,svg}", gulp.series("webp", "images"));
  gulp.watch("source/img/{icon,logo}-*.svg", gulp.series("sprite", "refresh"));
  gulp.watch("source/*.html", gulp.series("html"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "html", "css", "webp", "images", "sprite", "js"));
gulp.task("start", gulp.series("build", "server"));
