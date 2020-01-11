"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var imagemin = require("gulp-imagemin")
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src([
    "build/img/**/photo*.{png,jpg}",
    "build/img/**/panorama*.{png,jpg}"
    ])
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src([
    "build/img/icon*.svg",
    "build/img/logo*.svg"
  ])
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

gulp.task("jsmin", function () {
  return gulp.src("source/js/**/*.js")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min",
      extname: ".js"
    }))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/js"))
})

gulp.task("html", function() {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
});

gulp.task("server", function () {
  server.init({
    server: "build/"
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/img/*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/js/*.js", gulp.series("jsmin", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy",
  "css", "images", "webp", "sprite", "jsmin", "html"));
gulp.task("start", gulp.series("build", "server"));
