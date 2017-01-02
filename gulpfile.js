// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var file = require('gulp-file');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var jsonSass = require('gulp-json-sass');

// var page  = require('content/page.js');

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('public/sass/*.scss')
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe(sass())
    .pipe(gulp.dest('public/css'));
});

// gulp.task('hello', function(){
//   return file('page.json', JSON.stringify(page))
//     .pipe(gulp.dest('content'));
// });


gulp.task('jsontosass', function(){
  return gulp
  .src('content/page.json')
  .pipe(jsonSass())
  .pipe(concat('settings.scss'))
  .pipe(gulp.dest('public/sass'));
});

// Concatenate & Minify CSS
gulp.task('css', function() {
  return gulp.src('pubic/css/*.css')
    .pipe(concat('all.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('public/production'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('content/page.json', ['jsontosass', 'sass', 'css']);
  gulp.watch('public/sass/*.scss', ['sass', 'css']);
});

// Default Task
gulp.task('default', ['jsontosass', 'sass', 'css', 'watch']);
// gulp.task('default', ['jsontosass', 'watch']);

