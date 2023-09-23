/* eslint-disable */
import { logger } from './../../core/logger.js';

export const images = (done) => {
  return app.gulp
    .src(app.path.src.shared.images)
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(app.plugins.if(app.build.max, app.plugins.webp()))
    .pipe(app.plugins.if(app.build.max, app.gulp.dest(app.path.build.images)))
    .pipe(
      app.plugins.if(
        app.build.max || app.build.optimized,
        app.gulp.src(app.path.src.shared.images)
      )
    )
    .pipe(
      app.plugins.imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 4, // 0 to 7
      })
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream())
    .on('end', () => {
      logger('images done');
      done();
    });
};
