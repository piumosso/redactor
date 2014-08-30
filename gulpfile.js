var gulp = require('gulp');
var traceur = require('gulp-traceur');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var noop = console.log;


gulp.task('default', function () {
    runSequence(['traceur.lib', 'traceur.test'], 'test');
});


gulp.task('traceur.lib', function() {
    return gulp
        .src('lib/*.js')
        .pipe(traceur()).on('error', noop)
        .pipe(gulp.dest('./build'));
});


gulp.task('traceur.test', function() {
    return gulp
        .src(['test/*.js'])
        .pipe(traceur()).on('error', noop)
        .pipe(gulp.dest('./test/build'));
});


gulp.task('test', function() {
    return gulp
        .src('test/build/*.js')
        .pipe(mocha({reporter: 'spec'})).on('error', noop);
});


gulp.task('watch', function() {
    gulp.watch('lib/**/*.js', ['default']);
    gulp.watch('test/*.js', ['default']);
});


gulp.task('bower', function(){
    return gulp
        .src(mainBowerFiles())
        .pipe(gulp.dest('./vendors'))
});