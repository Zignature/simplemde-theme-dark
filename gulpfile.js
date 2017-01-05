const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const rimraf = require('rimraf');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const insert = require('gulp-insert');
const runSequence = require('run-sequence');
const pkg = require('./package.json');

const prependText = `/* SimpleMDE Theme Dark v${pkg.version} ${pkg.homepage} */\n\n`;

const postcssConfig = [autoprefixer({ browsers: [
  'last 3 iOS versions',
  'last 3 Android versions',
  'last 3 ExplorerMobile versions',
  'last 3 ChromeAndroid versions',
  'last 3 UCAndroid versions',
  'last 3 FirefoxAndroid versions',
  'last 3 OperaMobile versions',
  'last 3 OperaMini versions',
  'last 3 Samsung versions',

  'last 3 Chrome versions',
  'last 3 Firefox versions',
  'last 3 Safari versions',
  'last 3 Edge versions',
] })];

const SRC_DIR = path.resolve(__dirname, 'src');
const DIST_DIR = path.resolve(__dirname, 'dist');
const SITE_DIR = path.resolve(__dirname, 'docs');
const SITE_CSS_DIR = path.resolve(__dirname, 'docs/vendor/theme');

gulp.task('default', ['build_copy'], () => {
  gulp.watch([
    `${SRC_DIR}/**/*`,
  ], ['build_copy']);
});

gulp.task('build_copy', () => {
  setTimeout(() => {
    runSequence('build', 'copy');
  }, 300);
});

gulp.task('build', [
  'clean:dist',
  'build:simplemde-theme-dark',
  'build:simplemde-theme-dark:min',
]);

gulp.task('copy', [
  'clean:site_css',
  'copy:site_css',
]);

gulp.task('clean:dist', () => {
  rimraf.sync(`${DIST_DIR}/*`);
});

gulp.task('build:simplemde-theme-dark:min', ['build:simplemde-theme-dark'], () => gulp.src(`${DIST_DIR}/simplemde-theme-dark.css`)
  .pipe(sourcemaps.init())
  .pipe(cleanCSS())
  .pipe(insert.prepend(prependText))
  .pipe(rename('simplemde-theme-dark.min.css'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(DIST_DIR)));

gulp.task('build:simplemde-theme-dark', () => gulp.src(`${SRC_DIR}/simplemde-theme-dark.scss`)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss(postcssConfig))
  .pipe(insert.prepend(prependText))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(DIST_DIR)));

gulp.task('clean:site_css', () => {
  rimraf.sync(`${SITE_CSS_DIR}/*`);
});

gulp.task('copy:site_css', () => gulp.src(`${DIST_DIR}/*`)
  .pipe(gulp.dest(`${SITE_CSS_DIR}/`)));
