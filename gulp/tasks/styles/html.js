/* eslint-disable */
import path from 'path';

const __dirname = path.resolve();

export const html = () => {
  return app.gulp
    .src(app.path.src.pages.html)
    .pipe(app.plugins.newer(app.path.src.pages.html))
    .pipe(app.plugins.newer(app.path.src.widgets))
    .pipe(app.plugins.newer(app.path.src.shared.ui))
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Ошибка: <%= error.message %>',
        })
      )
    )
    .pipe(
      app.plugins.fileinclude({
        prefix: '@@',
        basepath: path.join(__dirname, 'src/widgets'),
      })
    )
    .pipe(
      app.plugins.htmlMin({
        useShortDoctype: true,
        sortClassName: true,
        collapseWhitespace: app.build.max || app.build.min,
        removeComments: app.build.max || app.build.min,
      })
    )
    .pipe(app.plugins.replace(/@img\//g, 'images/'))
    .pipe(app.plugins.if(app.build.max, app.plugins.webpHtmlNosvg()))
    .pipe(
      app.plugins.versionNumber({
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
    .pipe(app.plugins.browserSync.stream());
};
