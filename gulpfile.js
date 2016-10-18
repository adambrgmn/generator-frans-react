'use strict';

const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const excludeGitignore = require('gulp-exclude-gitignore');
const mocha = require('gulp-mocha');
const nsp = require('gulp-nsp');
const del = require('del');
const plumber = require('gulp-plumber');

gulp.task('static', () => gulp.src('**/*.js')
  .pipe(excludeGitignore())
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('nsp', (cb) => {
  nsp({ package: path.resolve('package.json') }, cb);
});

gulp.task('test', (cb) => {
  let mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec',
      require: './test/setup',
    }))
    .on('error', (err) => {
      mochaErr = err;
    })
    .on('end', () => cb(mochaErr));
});

gulp.task('clean', () => del(['generators']));

gulp.task('move-templates', ['clean'], () => gulp.src('src/**/templates/*')
  .pipe(gulp.dest('generators/')));

gulp.task('babel', ['move-templates'], () => gulp.src([
  'src/**/*.js',
  '!src/**/templates/*',
])
  .pipe(babel())
  .pipe(gulp.dest('generators')));


gulp.task('watch', () => {
  gulp.watch(['src/**/*.js', 'test/**'], ['test']);
});

gulp.task('build', ['babel']);
gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
