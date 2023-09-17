/* eslint-disable */
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoPrefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа запросов
import newer from 'gulp-newer';
// import gulpCached from 'gulp-cached';
// import path from 'path';
// import * as glob from 'glob';
const sass = gulpSass(dartSass);

export const scss = () => {
  return (
    app.gulp
      .src(app.path.src.pages.scss, { sourcemaps: app.build.default })
      .pipe(newer(app.path.src.pages.scss))
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
      .pipe(groupCssMediaQueries())
      .pipe(
        app.plugins.if(
          app.build.max || app.build.optimized,
          webpcss({
            webpClass: '.webp',
            noWebpClass: '.no-webp',
          })
        )
      )
      .pipe(
        autoPrefixer({
          grid: false,
          overrideBrowserslist: ['last 10 versions'],
          cascade: true,
        })
      )
      // Расскомментировать если нужен обычный дубль файла стилей
      // .pipe(app.gulp.dest(app.path.build.css))
      .pipe(cleanCss())
      .pipe(
        rename((file) => {
          file.dirname = ''; // Удаляем имя папки
          file.extname = '.min.css'; // Меняем расширение файла
        })
      )
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browserSync.stream())
  );
};
