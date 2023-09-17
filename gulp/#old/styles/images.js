/* eslint-disable */
import webp from 'gulp-webp';

export const images = () => {
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
    .pipe(app.plugins.if(app.build.max, webp()))
    .pipe(app.plugins.if(app.build.max, app.gulp.dest(app.path.build.images)))
    .pipe(app.gulp.src(app.path.src.shared.images))
    .pipe(
      imagemin(
        {
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 4, // 0 to 7
        },
        { verbose: true }
      )
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browserSync.stream());
};
