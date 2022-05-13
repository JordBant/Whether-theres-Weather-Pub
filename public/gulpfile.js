const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify')

const buildStyles = () => {
  return src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist/css'));
};

const uglifyJS = () => {
    return gulp.src('./script.js')
    .pipe(uglify())
    .pipe(dest('./dist/bundleJS'));
}

const watchDev = () => {
    watch('./script.js', uglifyJS)
    watch('./styles/*.scss',buildStyles)
}

exports.buildStyles = buildStyles;
exports.uglifyJS = uglifyJS;
exports.watchDev = watchDev