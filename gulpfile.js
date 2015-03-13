var gulp = require('gulp');
var babel = require('gulp-babel');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var less = require('gulp-less');
var noop = console.log;

var reactify = require('reactify');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');


gulp.task('default', function () {
  runSequence(['to5.lib', 'to5.test'], 'test');
});


gulp.task('install', function () {
  runSequence(['to5.lib'], 'build');
});


gulp.task('example', function () {
  runSequence(['to5.lib', 'to5.example'], ['build', 'stylesheet']);
});


gulp.task('stylesheet', function () {
  return gulp
    .src('stylesheets/redactor.less')
    .pipe(less()).on('error', noop)
    .pipe(gulp.dest('./stylesheets'));
});


gulp.task('build', function () {
  return gulp
    .src('build/redactor.js')
    .pipe(browserify({transform: ['brfs']})).on('error', noop)
    .pipe(gulp.dest('./dist'));
});


gulp.task('to5.lib', function () {
  return gulp
    .src('lib/*.js')
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./build'));
});


gulp.task('to5.example', function () {
  return gulp
    .src('react/*.es6.js')
    .pipe(babel()).on('error', noop)
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./react'));
});


gulp.task('to5.test', function () {
  return gulp
    .src(['test/*.js'])
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./test/build'));
});


gulp.task('test', function () {
  return gulp
    .src('test/build/*.js')
    .pipe(mocha({reporter: 'spec'})).on('error', noop);
});


gulp.task('watch', function () {
  gulp.watch('lib/**/*.js', ['default']);
  gulp.watch('test/*.js', ['default']);
});


gulp.task('bower', function () {
  return gulp
    .src(mainBowerFiles())
    .pipe(gulp.dest('./vendors'))
});


gulp.task('compile:lib', function () {
  var bundler;

  bundler = watchify(browserify('lib/*.js', watchify.args));
  bundler.transform(reactify);
  bundler.transform(babelify);
  bundler.on('update', bundle);

  return bundler.bundle()
    .on('error', function (err) {
      gutil.log(err.message);
      browserSync.notify("Browserify Error!");
      this.emit("end");
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('.build'))
    .pipe(browserSync.reload({stream: true, once: true}));
});