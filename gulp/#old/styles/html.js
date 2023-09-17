/* eslint-disable */
import fileinclude from 'gulp-file-include';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import versionNumber from 'gulp-version-number';
import htmlMin from 'gulp-htmlmin';
import path from 'path';
import * as glob from 'glob';
import { logger } from './../custom/logger.js';

const __dirname = path.resolve();

export const html = (done) => {
  const pageFolders = glob.sync(`src/html/views/*/`);
  const mainFiles = pageFolders.map((folder) => {
    const folderName = path.basename(folder);
    return `${folder}/${folderName}.html`;
  });

  return app.gulp
    .src([app.path.src.styles.html, ...mainFiles])
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
        basepath: path.join(__dirname, 'src/html'),
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
      app.plugins.if(
        app.build.default ||
          app.build.optimized ||
          app.build.min ||
          app.build.max,
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
    )
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browserSync.stream())
    .on('end', () => {
      logger('html done');
      done();
    });
};
