var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var sassdoc = require('sassdoc');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var html = require('gulp-prettify');


var input = './src/sass/**/*.scss';
var output = './public/css';

var js_input = './src/js/**/*.js';
var js_output = './public/js';

var html_input = './src/html/**/*.html';
var html_output = './public/';

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

var sassdocOptions = {
  dest: './public/sassdoc'
};

var sourcemapsOutput = './maps';

gulp.task('sass', function () {
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sassdoc(sassdocOptions))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write(sourcemapsOutput))
    .pipe(gulp.dest(output))
    .resume();
});

gulp.task('sassdoc', function () {
  return gulp
    .src(input)
    .pipe(sassdoc(sassdocOptions))
    .resume();
});

gulp.task('js', function () {
  return gulp
    .src(js_input)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write(sourcemapsOutput))
    .pipe(gulp.dest(js_output));
});

gulp.task('html', function() {
  gulp
    .src(html_input)
    .pipe(sourcemaps.init())
    .pipe(html({indent_size: 4}))
    .pipe(sourcemaps.write(sourcemapsOutput))
    .pipe(gulp.dest(html_output))
});

gulp.task('watch', function() {
  return gulp
    .watch([input, js_input, html_input], ['sass', 'js', 'html'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['sass', 'js', 'html', 'watch']);

gulp.task('prod', ['sassdoc'], function () {
  return gulp
    .src(input)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(output));
});