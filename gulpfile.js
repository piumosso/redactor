var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var traceur = require('gulp-traceur');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var noop = console.log;


gulp.task('default', ['traceur.lib', 'traceur.test']);


gulp.task('traceur.lib', function() {
    gulp
        .src('lib/redactor.js')
        .pipe(traceur()).on('error', noop)
        .pipe(gulp.dest('./dist/lib'));
});


gulp.task('traceur.test', function() {
    gulp
        .src(['test/*.js'])
        .pipe(traceur()).on('error', noop)
        .pipe(gulp.dest('./test/build'));
});


gulp.task('test', function() {
    gulp
        .src('test/build/*.js')
        .pipe(mocha({reporter: 'spec'})).on('error', noop);
});


gulp.task('watch', function() {
    gulp.watch('lib/**/*.js', ['traceur.lib', 'test']);
    gulp.watch('test/*.js', ['traceur.test', 'test']);
});


gulp.task('bower', function(){
    return gulp
        .src(mainBowerFiles())
        .pipe(gulp.dest('./vendors'))
});