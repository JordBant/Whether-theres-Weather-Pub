const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify')

const buildStyles = () => {
  return gulp.src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
};

const uglifyJS = () => {
    return gulp.src('./*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/bundleJS'));

}

const watchDev = () => {
    
}

exports.buildStyles = buildStyles;
exports.uglifyJS = uglifyJS;