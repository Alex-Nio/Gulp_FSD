/* eslint-disable */
import fileinclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';
import htmlMin from 'gulp-htmlmin';
import gulpCached from 'gulp-cached';
import path from 'path';
import flatten from 'gulp-flatten';
// import newer from 'gulp-app.plugins.newer';
import { logger } from './../core/logger.js';

const __dirname = path.resolve();

export const html = () => {
  return (
    app.gulp
      .src(app.path.src.pages.html)
      .pipe(app.plugins.newer(app.path.src.pages.html))
      .pipe(app.plugins.newer(app.path.src.widgets))
      .pipe(app.plugins.newer(app.path.src.shared.ui))
      // .pipe(gulpCached('html'))
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'HTML',
            message: 'Ошибка: <%= error.message %>',
          })
        )
      )
      .pipe(
        fileinclude({
          prefix: '@@',
          basepath: path.join(__dirname, 'src/widgets'),
        })
      )
      .pipe(
        htmlMin({
          useShortDoctype: true,
          sortClassName: true,
          collapseWhitespace: app.build.max || app.build.min,
          removeComments: app.build.max || app.build.min,
        })
      )
      .pipe(app.plugins.replace(/@img\//g, 'images/'))
      .pipe(app.plugins.if(app.build.max, webpHtmlNosvg()))
      .pipe(
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: ['css', 'js'],
          },
          output: {
            file: 'gulp/version.json',
          },
        })
      )
      .pipe(app.plugins.flatten({ includeParents: 0 }))
      .pipe(app.gulp.dest(app.path.build.html))
      .pipe(app.plugins.browserSync.stream())
  );
};
