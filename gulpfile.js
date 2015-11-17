var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var del = require('del');

var paths = {
  scripts: ['app/constants.js','app/common/*.js','app/pages/*.js','app/*.js'],
  images: ['images/**/*', 'images/*'],
  css: ['style/*.css', 'style/*.less']
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['dist']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    // .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(concat('main.js'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/app'));
});

gulp.task('css', ['clean'], function() {
  return gulp.src(paths.css)
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/style'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    // .pipe(imagemin({
    // optimizationLevel: 2,
    // }))
    .pipe(gulp.dest('dist/images'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.images, ['css']);
});

// Copy other files
gulp.task('copy', ['clean'], function() {
  gulp.src(['*lib/*', 'main.html', '*audio/*'])
    .pipe(gulp.dest('dist'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'css', 'copy', 'images']);
