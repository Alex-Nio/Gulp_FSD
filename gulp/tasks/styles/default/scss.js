/* eslint-disable */
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.pages.scss, { sourcemaps: app.build.default })
      .pipe(app.plugins.newer(app.path.src.pages.scss))
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'SCSS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(app.plugins.replace(/@img\//g, '../images/'))
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(app.plugins.groupCssMediaQueries())
      .pipe(
        app.plugins.if(
          app.build.max || app.build.optimized,
          app.plugins.webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp',
          })
        )
      )
      .pipe(
        app.plugins.autoPrefixer({
          grid: false,
          overrideBrowserslist: ['last 10 versions'],
          cascade: true,
        })
      )
      // Расскомментировать если нужен обычный дубль файла стилей
      // .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.cleanCss())
      .pipe(
        app.plugins.rename((file) => {
          file.dirname = ''; // Удаляем имя папки
          file.extname = '.min.css'; // Меняем расширение файла
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
};
