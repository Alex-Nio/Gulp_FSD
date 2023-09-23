/* eslint-disable */
import webpack from 'webpack-stream';
import { webpackConfig } from '../../../../webpack.config.js';

export const js = () =>
  app.gulp
    .src(app.path.src.pages.js, { sourcemaps: app.build.default })
    .pipe(app.plugins.newer(app.path.src.pages.js))
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'JS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(webpack({ config: webpackConfig(app.build.default) }))
    .pipe(app.plugins.flatten({ includeParents: 0 }))
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browserSync.stream());
