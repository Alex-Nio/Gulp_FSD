/* eslint-disable */
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import { logger } from './../custom/logger.js';

export function linter(done) {
  return gulp
    .src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', () => {
      logger('lint done');
      done();
    });
}
