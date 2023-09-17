/* eslint-disable */
import ttf2woff from 'gulp-ttf2woff';
import ttf2woff2 from 'gulp-ttf2woff2';
import mergeStream from 'merge-stream';

// 1. Конвертируем .ttf в .woff
export const ttfToWoff = () => {
  const ttfFiles = app.gulp.src(`${app.path.srcFolder}/assets/fonts/*.ttf`, {});

  const woffStream = ttfFiles
    .pipe(ttf2woff())
    .pipe(app.gulp.dest(app.path.build.fonts));

  return mergeStream(woffStream);
};

// 2. Конвертируем .ttf в .woff2
export const ttfToWoff2 = () => {
  const ttfFiles = app.gulp.src(`${app.path.srcFolder}/assets/fonts/*.ttf`, {});

  const woff2Stream = ttfFiles
    .pipe(ttf2woff2())
    .pipe(app.gulp.dest(app.path.build.fonts));

  return mergeStream(woff2Stream);
};

// 3. Переносим файлы icon шрифта
export const iconFont = () => {
  const iconFontFiles = app.gulp
    .src(`${app.path.srcFolder}/assets/fonts/iconfont.{woff,eot,svg}`)
    .pipe(app.gulp.dest(`${app.path.build.fonts}`));

  return mergeStream(iconFontFiles);
};
