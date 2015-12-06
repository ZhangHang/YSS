/**
 * Make sure Graphicsmagick is installed on your system
 * osx: brew install graphicsmagick
 *
 * Install these gulp plugins
 * glup, gulp-image-resize, gulp-imagemin and imagemin-png
 *
 **/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var imageresize = require('gulp-image-resize');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var del = require('del');

var paths = {
  scripts: ['app/constants.js', 'app/common/*.js', 'app/pages/*.js', 'app/*.js'],
  images: ['images/**/*', 'images/*'],
  css: ['style/*.css', 'style/*.less']
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['dist/*']);
});

var scripts = function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    // .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.js'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/app'));
}
gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);

var css = function() {
  return gulp.src(paths.css)
    .pipe(less())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/style'));
}
gulp.task('css', ['clean'], css);
gulp.task('css-watch', css);

var images = function() {
    return gulp.src(paths.images)
      .pipe(imageresize({
        width: 640,
        crop: false,
        // never increase image dimensions
        upscale: false
      }))
      .pipe(imagemin({
        optimizationLevel: 2,
        use: [pngquant()]
      }))
      .pipe(gulp.dest('dist/images'));
  }
  // Copy all static images
gulp.task('images', ['clean'], images);
gulp.task('images-watch', images);


var copy = function() {
    gulp.src(['*lib/*', '*main.html*', '*audio/*'])
      .pipe(gulp.dest('dist'))
  }
  // Copy other files
gulp.task('copy', ['clean'], copy);
gulp.task('copy-watch', copy);

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts-watch']);
  gulp.watch(paths.images, ['images-watch']);
  gulp.watch(paths.css, ['css-watch']);
  gulp.watch(paths.css, ['copy-watch']);
});


// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'css', 'copy', 'images']);
