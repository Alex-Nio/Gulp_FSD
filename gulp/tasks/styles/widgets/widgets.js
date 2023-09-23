/* eslint-disable */
import path from 'path';
import * as glob from 'glob';
import fs from 'fs';
import webpack from 'webpack-stream';
import { webpackConfig } from './../../../../webpack.config.js';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(dartSass);
const __dirname = path.resolve();

function reloadBrowser() {
  app.plugins.browserSync.reload(); // Вызываем метод reload() для перезагрузки браузера
  console.log('reloaded');
}

// Функция для определения последнего измененного файла из массива
function findLastModifiedFile(files) {
  let lastModifiedFile = null;
  let lastModifiedTime = 0;

  files.forEach((file) => {
    const stat = fs.statSync(file);
    const fileModifiedTime = stat.mtimeMs;

    if (fileModifiedTime > lastModifiedTime) {
      lastModifiedFile = file;
      lastModifiedTime = fileModifiedTime;
    }
  });

  return lastModifiedFile;
}

function extractWidgetName(filePath) {
  const parts = filePath.split(path.sep);
  if (parts.length >= 4) {
    // Возьмем третий элемент, который содержит имя папки
    return parts[2];
  }
  return null;
}

//! HTML
export const findWidgetHtml = () => {
  const W_HTML = glob.sync(app.path.src.widgets.html);

  // Определение последнего измененного файла
  const lastModifiedWidgetHtml = findLastModifiedFile(W_HTML);

  const html = extractWidgetName(lastModifiedWidgetHtml);

  // console.log(`Последний измененный файл Html: ${lastModifiedWidgetHtml}`);

  // console.log('--------Компоненты которые были изменены--------');
  // console.log(html);
  // console.log('------------------------------------------------');

  const pages = {};

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const fileContents = file.contents.toString();
        const widgetNames = [];
        const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

        // Регулярное выражение для поиска названий папок виджетов
        const importPattern =
          /import\s+\*\s+as\s+([^\s]+)\s+from\s+'([^']+?)';/g;

        let match;
        while ((match = importPattern.exec(fileContents)) !== null) {
          const importPath = match[2]; // Получаем путь из импорта
          const widgetName = importPath.match(/\/([^/]+)\/api$/); // Извлекаем часть пути

          if (widgetName) {
            const widget = widgetName[1];
            widgetNames.push(widget);
          }
        }

        // Полученные виджеты
        // console.log('--------Компоненты--------');
        // console.log(widgetNames);
        // console.log('---------------------------');

        // Сохраняем информацию о виджетах для текущей страницы
        pages[pageName] = widgetNames;

        // Передаем информацию в следующий этап обработки
        file.widgetNames = widgetNames;
        cb(null, file);
      })
    )
    .on('end', () => {
      // console.log('-------------DATA----------');
      // console.log(JSON.stringify(pages, null, 2));
      // console.log('---------------------------');

      // Перебор всех ключей в объекте
      function findKeysWithName(obj, name) {
        const result = [];

        // Проверка каждого массива значений на наличие данного наименования
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const values = obj[key];

            if (values.includes(name)) {
              result.push(key);
            }
          }
        }

        return result;
      }

      const currentChangedWidget = [html];
      const totalFilesToProcess = currentChangedWidget.length;

      console.log(`Поиск файла виджета HTML: ${currentChangedWidget}`);
      console.log(
        `Файл виджета найден в страницах: ${JSON.stringify(pages, null, 2)}`
      );

      currentChangedWidget.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/${pageName}.html`;
          console.log(pageFilePath);

          return app.gulp
            .src(pageFilePath)
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
            .pipe(app.gulp.dest(app.path.build.html));
        });
      });
    })
    .on('end', () => {
      console.log('end');
      reloadBrowser();
    });
};

//! Scss
export const findWidgetScss = () => {
  const W_SCSS = glob.sync(app.path.src.widgets.scss);

  // Определение последнего измененного файла
  const lastModifiedWidgetScss = findLastModifiedFile(W_SCSS);

  const scss = extractWidgetName(lastModifiedWidgetScss);

  // console.log(`Последний измененный файл Scss: ${lastModifiedWidgetScss}`);

  // console.log('--------Компоненты которые были изменены--------');
  // console.log(scss);
  // console.log('------------------------------------------------');

  const pages = {};

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const fileContents = file.contents.toString();
        const widgetNames = [];
        const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

        // Регулярное выражение для поиска названий папок виджетов
        const importPattern =
          /import\s+\*\s+as\s+([^\s]+)\s+from\s+'([^']+?)';/g;

        let match;
        while ((match = importPattern.exec(fileContents)) !== null) {
          const importPath = match[2]; // Получаем путь из импорта
          const widgetName = importPath.match(/\/([^/]+)\/api$/); // Извлекаем часть пути

          if (widgetName) {
            const widget = widgetName[1];
            widgetNames.push(widget);
          }
        }

        //* Полученные виджеты
        // console.log('--------Компоненты--------');
        // console.log(widgetNames);
        // console.log('---------------------------');

        //* Сохраняем информацию о виджетах для текущей страницы
        pages[pageName] = widgetNames;

        //* Передаем информацию в следующий этап обработки
        file.widgetNames = widgetNames;
        cb(null, file);
      })
    )
    .on('end', () => {
      // console.log('-------------DATA----------');
      // console.log(JSON.stringify(pages, null, 2));
      // console.log('---------------------------');

      // Перебор всех ключей в объекте
      function findKeysWithName(obj, name) {
        const result = [];

        // Проверка каждого массива значений на наличие данного наименования
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const values = obj[key];

            if (values.includes(name)) {
              result.push(key);
            }
          }
        }

        return result;
      }

      const currentChangedWidget = [scss];

      console.log(`Поиск файла виджета Scss: ${currentChangedWidget}`);
      console.log(
        `Файл виджета найден в страницах: ${JSON.stringify(pages, null, 2)}`
      );

      // scss compile
      currentChangedWidget.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/scss/${pageName}.scss`;
          console.log(pageFilePath);

          return (
            app.gulp
              .src(pageFilePath, { sourcemaps: app.build.default })
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
        });
      });

      // js compile
      currentChangedWidget.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/js/${pageName}.js`;
          console.log(pageFilePath);

          app.gulp
            .src(pageFilePath, { sourcemaps: app.build.default })
            .pipe(
              app.plugins.plumber(
                app.plugins.notify.onError({
                  title: 'JS',
                  message: 'Error: <%= error.message %>',
                })
              )
            )
            .pipe(
              webpack({
                config: webpackConfig(app.build.default, pageFilePath),
              })
            )
            .pipe(app.plugins.flatten({ includeParents: 0 }))
            .pipe(app.gulp.dest(app.path.build.js))
            .pipe(app.plugins.browserSync.stream());
        });
      });
    })
    .on('end', () => {
      console.log('end');
      reloadBrowser();
    });
};

//! JS
export const findWidgetJs = () => {
  const W_JS = glob.sync(app.path.src.widgets.js);

  // Определение последнего измененного файла
  const lastModifiedWidgetJs = findLastModifiedFile(W_JS);

  const js = extractWidgetName(lastModifiedWidgetJs);

  // console.log(`Последний измененный файл Js: ${lastModifiedWidgetJs}`);

  // console.log('--------Компоненты которые были изменены--------');
  // console.log(js);
  // console.log('------------------------------------------------');

  const pages = {};

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const fileContents = file.contents.toString();
        const widgetNames = [];
        const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

        // Регулярное выражение для поиска названий папок виджетов
        const importPattern =
          /import\s+\*\s+as\s+([^\s]+)\s+from\s+'([^']+?)';/g;

        let match;
        while ((match = importPattern.exec(fileContents)) !== null) {
          const importPath = match[2]; // Получаем путь из импорта
          const widgetName = importPath.match(/\/([^/]+)\/api$/); // Извлекаем часть пути

          if (widgetName) {
            const widget = widgetName[1];
            widgetNames.push(widget);
          }
        }

        // Полученные виджеты
        // console.log('--------Компоненты--------');
        // console.log(widgetNames);
        // console.log('---------------------------');

        // Сохраняем информацию о виджетах для текущей страницы
        pages[pageName] = widgetNames;

        // Передаем информацию в следующий этап обработки
        file.widgetNames = widgetNames;
        cb(null, file);
      })
    )
    .on('end', () => {
      // console.log('-------------DATA----------');
      // console.log(JSON.stringify(pages, null, 2));
      // console.log('---------------------------');

      // Перебор всех ключей в объекте
      function findKeysWithName(obj, name) {
        const result = [];

        // Проверка каждого массива значений на наличие данного наименования
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const values = obj[key];

            if (values.includes(name)) {
              result.push(key);
            }
          }
        }

        return result;
      }

      const currentChangedWidget = [js];

      console.log(`Поиск файла виджета Js: ${currentChangedWidget}`);
      console.log(
        `Файл виджета найден в страницах: ${JSON.stringify(pages, null, 2)}`
      );

      currentChangedWidget.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/js/${pageName}.js`;
          console.log(pageFilePath);

          app.gulp
            .src(pageFilePath, { sourcemaps: app.build.default })
            .pipe(
              app.plugins.plumber(
                app.plugins.notify.onError({
                  title: 'JS',
                  message: 'Error: <%= error.message %>',
                })
              )
            )
            .pipe(
              webpack({
                config: webpackConfig(app.build.default, pageFilePath),
              })
            )
            .pipe(app.plugins.flatten({ includeParents: 0 }))
            .pipe(app.gulp.dest(app.path.build.js))
            .pipe(app.plugins.browserSync.stream());
        });
      });
    })
    .on('end', () => {
      console.log('end');
      reloadBrowser();
    });
};

// Регулярное выражение для поиска импортов виджетов
// const importPattern = /import\s+\*\s+as\s+([^\s]+)\s+from\s+'(.*?)';/g;

// let match;
// while ((match = importPattern.exec(fileContents)) !== null) {
//   const importedWidgets = match[1].split(',').map((w) => w.trim());

//   // Сохраняем только названия виджетов
//   importedWidgets.forEach((widget) => {
//     widgetNames.push(widget);
//   });
// }
