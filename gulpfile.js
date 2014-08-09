var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var traceur = require('gulp-traceur');
var mainBowerFiles = require('main-bower-files');
var mocha = require('gulp-mocha');
var noop = function() {};


gulp.task('default', function() {
    gulp
        .src('lib/redactor.js')
        .pipe(browserify())
        .on('error', noop)
        .pipe(traceur({sourceMap: true}))
        .on('error', noop)
        //.pipe(uglify())
        .pipe(gulp.dest('./dist'));
});


gulp.task('test', function() {
    gulp
        .src('test/*.js')
        .pipe(mocha())
        .on('error', noop);
});


gulp.task('watch', function() {
    gulp.watch(['lib/**/*.js', 'test/*.js'], ['default', 'test']);
});


gulp.task('bower', function(){
    return gulp
        .src(mainBowerFiles())
        .pipe(gulp.dest('./vendors'))
});