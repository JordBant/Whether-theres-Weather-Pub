const { src, dest, watch } = require('gulp');
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css')

const buildStyles = () => {
  return src('./styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dist/css'));
};

const uglifyCSS = () => {
    return src('./dist/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('dist/css'))
}

const uglifyJS = () => {
    return gulp.src('./script.js')
    .pipe(uglify())
    .pipe(dest('./dist/bundleJS'));
}

const watchDev = () => {
    watch('./styles/*.scss',buildStyles)
    watch('./script.js', uglifyJS)
}

// const deploy = () =>{
//     return gulp.src"./dist/**/*"
//     .pipe(deploy())
// }

exports.buildStyles = buildStyles;
exports.uglifyJS = uglifyJS;
exports.uglifyCSS = uglifyCSS
exports.watchDev = watchDev
