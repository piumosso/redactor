var gulp = require('gulp');
var babel = require('gulp-babel');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var browserify = require('gulp-browserify');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var less = require('gulp-less');
var react = require('gulp-react');
var brfs = require('brfs');
var noop = console.log;


// Common tasks

gulp.task('default', function () {
  runSequence(['transform:lib', 'transform:test'], 'test');
});
gulp.task('install', function () {
  runSequence(['transform:lib'], 'build:lib');
});
gulp.task('example', function () {
  runSequence('install', 'transform:example');
});


// Build

gulp.task('build', ['build:stylesheet', 'build:lib']);
gulp.task('build:stylesheet', function () {
  return gulp
    .src('stylesheets/redactor.less')
    .pipe(less()).on('error', noop)
    .pipe(gulp.dest('./stylesheets'));
});
gulp.task('build:lib', function () {
  return gulp
    .src('build/redactor.js')
    .pipe(browserify({transform: [brfs]})).on('error', noop)
    .pipe(gulp.dest('./dist'));
});


// Transform

gulp.task('transform', ['transform:lib', 'transform:test', 'transform:example']);
gulp.task('transform:lib', function () {
  return gulp
    .src('lib/*.js')
    .pipe(react())
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./build'));
});
gulp.task('transform:test', function () {
  return gulp
    .src(['test/*.js'])
    .pipe(react())
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./test/build'));
});
gulp.task('transform:example', function () {
  return gulp
    .src('react/init.source.js')
    .pipe(react())
    .pipe(babel()).on('error', noop)
    .pipe(rename('init.js'))
    .pipe(gulp.dest('./react'));
});


// Tests

gulp.task('test', function () {
  return gulp
    .src('test/build/*.js')
    .pipe(mocha({reporter: 'spec'})).on('error', noop);
});


// Watch

gulp.task('watch', function () {
  gulp.watch('lib/**/*.js', ['default']);
  gulp.watch('test/*.js', ['default']);
});


// Bower

gulp.task('bower', function () {
  return gulp
    .src(mainBowerFiles())
    .pipe(gulp.dest('./vendors'))
});
