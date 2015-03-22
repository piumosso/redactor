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
  runSequence('build', 'demo', 'test');
});
gulp.task('build', function () {
  runSequence(['transform:lib'], 'build:lib');
});
gulp.task('test', function () {
  runSequence(['build', 'transform:test'], 'test');
});
gulp.task('demo', function () {
  runSequence('build', 'transform:demo');
});


// Build

gulp.task('build:lib', function () {
  return gulp
    .src('build/redactor.js')
    .pipe(browserify({transform: [brfs]})).on('error', noop)
    .pipe(gulp.dest('./dist'));
});
gulp.task('build:stylesheet', function () {
  return gulp
    .src('stylesheets/redactor.less')
    .pipe(less()).on('error', noop)
    .pipe(gulp.dest('./stylesheets'));
});
gulp.task('build:demo:stylesheet', function () {
  return gulp
    .src('demo/demo.less')
    .pipe(less()).on('error', noop)
    .pipe(gulp.dest('./demo'));
});


// Transform

gulp.task('transform:lib', function () {
  return gulp
    .src('lib/*.js')
    .pipe(react()).on('error', noop)
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./build'));
});
gulp.task('transform:test', function () {
  return gulp
    .src(['test/*.js'])
    .pipe(react()).on('error', noop)
    .pipe(babel()).on('error', noop)
    .pipe(gulp.dest('./test/build'));
});
gulp.task('transform:demo', function () {
  return gulp
    .src('demo/demo.source.js')
    .pipe(react()).on('error', noop)
    .pipe(babel()).on('error', noop)
    .pipe(rename('demo.js'))
    .pipe(gulp.dest('./demo'));
});


// Tests

gulp.task('test', function () {
  return gulp
    .src('test/build/*.js')
    .pipe(mocha({reporter: 'spec'})).on('error', noop);
});


// Watch

gulp.task('watch', function () {
  gulp.watch('lib/*.js', ['build', 'test']);
  gulp.watch('test/*.js', ['test']);
  gulp.watch('demo/*.js', ['transform:demo']);
  gulp.watch('demo/*.less', ['build:demo:stylesheet']);
  gulp.watch('stylesheets/*.less', ['build:stylesheet']);
});


// Bower

gulp.task('bower', function () {
  return gulp
    .src(mainBowerFiles())
    .pipe(gulp.dest('./vendors'))
});
