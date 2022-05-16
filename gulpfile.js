const { src, dest, watch } = require('gulp');
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css')

const buildCSS = () => {
  return src('./public/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./public/dist/css'));
};

const uglifyCSS = () => {
    return src('./public/dist/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('./public/dist/css'))
}

const uglifyJS = () => {
    return src('./public/*.js')
    .pipe(uglify())
    .pipe(dest('./public/dist/bundleJS'));
}

const watchDev = () => {
    watch('./styles/*.scss',buildCSS)
    watch('./script.js', uglifyJS)
}


exports.buildCSS = buildCSS;
exports.uglifyJS = uglifyJS;
exports.uglifyCSS = uglifyCSS
exports.watchDev = watchDev