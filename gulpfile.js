var gulp = require('gulp');
var to5 = require('gulp-6to5');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var rename = require("gulp-rename");
var noop = console.log;


gulp.task('default', function () {
  runSequence(['to5.lib', 'to5.test'], 'test');
});


gulp.task('install', function () {
  runSequence(['to5.lib'], 'build');
});

gulp.task('example', function () {
  runSequence(['to5.lib', 'to5.example'], 'build');
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
    .pipe(to5()).on('error', noop)
    .pipe(gulp.dest('./build'));
});


gulp.task('to5.example', function () {
  return gulp
    .src('react/*.es6.js')
    .pipe(to5()).on('error', noop)
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.es6', '');
    }))
    .pipe(gulp.dest('./react'));
});


gulp.task('to5.test', function () {
  return gulp
    .src(['test/*.js'])
    .pipe(to5()).on('error', noop)
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