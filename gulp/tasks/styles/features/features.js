/* eslint-disable */
import path from 'path';
import * as glob from 'glob';
import fs from 'fs';
import webpack from 'webpack-stream';
import { webpackConfig } from './../../../../webpack.config.js';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import { plugins } from './../../../config/plugins.js';

const sass = gulpSass(dartSass);
const __dirname = path.resolve();
const loggerEnabled = false;

//! Logger
const featuresLogger = (log, variable) => {
  switch (log) {
    case 'extracted html':
      console.log(log, `Обновлена фича: ${variable}`);
      break;
    case 'extracted scss':
      console.log(log, `Обновлена фича: ${variable}`);
      break;
    case 'extracted js':
      console.log(log, `Обновлена фича: ${variable}`);
      break;
    case 'extracted data':
      console.log('-------------DATA----------');
      console.log(log, variable);
      console.log('---------------------------');
      break;
    case 'search html':
      console.log(log, `Поиск виджета HTML: ${variable}`);
      break;
    case 'search scss':
      console.log(log, `Поиск виджета Scss: ${variable}`);
      break;
    case 'search js':
      console.log(log, `Поиск виджета Js: ${variable}`);
      break;
    case 'Feature found':
      console.log(log, `Файл виджета найден в страницах: ${variable}`);
      break;
    case 'reload done':
      console.log(log, `Браузер перезагружен`);
      break;
    case 'null':
      break;
  }
};

// Hot reloading
const reloadBrowser = () => {
  plugins.browserSync.reload();
  featuresLogger('', 'reload done');
};

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

// Extracting the last modification time
function extractFeatureName(filePath) {
  const parts = filePath.split(path.sep);
  if (parts.length >= 4) {
    // Возьмем третий элемент, который содержит имя папки
    return parts[2];
  }
  return null;
}

// Перебор всех ключей в объекте
function findKeysWithName(obj, name) {
  const result = [];

  for (const key in obj) {
    const widgets = obj[key];

    widgets.forEach((widget) => {
      if (widget.updatedFeature === name) {
        if (!result.includes(key)) {
          result.push(key);
        }
      }
    });
  }

  return result;
}

//! HTML
export const findFeatureHtml = () => {
  const F_HTML = glob.sync(app.path.src.features.html);

  // Определение последнего измененного файла
  const lastModifiedFeatureHtml = findLastModifiedFile(F_HTML);
  const html = extractFeatureName(lastModifiedFeatureHtml);
  const pages = {};

  //* Logger
  loggerEnabled
    ? featuresLogger('extracted html', html)
    : featuresLogger('null', null);

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const createWidgetsArr = () => {
          const fileContents = file.contents.toString();
          const FeatureNames = [];
          const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

          // Регулярное выражение для поиска названий папок виджетов
          const importPattern =
            /import\s+\*\s+as\s+([^\s]+)\s+from\s+'(.*\/widgets\/[^']+?)';/g;

          let match;
          while ((match = importPattern.exec(fileContents)) !== null) {
            const importPath = match[2]; // Получаем путь из импорта

            const FeatureName = importPath.match(/\/widgets\/([^/]+)\//); // Извлекаем часть пути // header

            if (FeatureName) {
              const widget = FeatureName[1];

              const widgetObject = {
                inWidget: widget,
                updatedFeature: html,
              };

              FeatureNames.push(widgetObject);

              console.log(
                `${widget} -искомый виджет в котором используется фича ${html}`
              );
            }
          }

          // Сохраняем информацию о виджетах для текущей страницы
          pages[pageName] = FeatureNames;

          // Передаем информацию в следующий этап обработки
          file.FeatureNames = FeatureNames;
        };

        createWidgetsArr();
        cb(null, file);
      })
    )
    .on('end', () => {
      const currentChangedFeature = [html];
      // Compile function
      const compile = (pageFilePath) => {
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
              basepath: path.join(__dirname, 'src'),
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

      //* Logger
      loggerEnabled
        ? featuresLogger('search html', currentChangedFeature)
        : featuresLogger('null', null);

      //* Logger
      loggerEnabled
        ? featuresLogger('Feature found', JSON.stringify(pages, null, 2))
        : featuresLogger('null', null);

      currentChangedFeature.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        console.log(pageNames, ' : страница в виджете которой обновили фичу');

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/${pageName}.html`;

          compile(pageFilePath);
        });
      });
    });
};

//! Scss
export const findFeatureScss = () => {
  const F_SCSS = glob.sync(app.path.src.features.scss);

  // Определение последнего измененного файла
  const lastModifiedFeatureScss = findLastModifiedFile(F_SCSS);
  const scss = extractFeatureName(lastModifiedFeatureScss);
  const pages = {};

  //* Logger
  loggerEnabled
    ? featuresLogger('extracted scss', scss)
    : featuresLogger('null', scss);

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const createWidgetsArr = () => {
          const fileContents = file.contents.toString();
          const FeatureNames = [];
          const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

          // Регулярное выражение для поиска фич внутри виджетов
          const importPattern =
            /import\s+\*\s+as\s+([^\s]+)\s+from\s+'(.*\/widgets\/[^']+?)';/g;

          let match;

          while ((match = importPattern.exec(fileContents)) !== null) {
            const importPath = match[2]; // Получаем путь из импорта

            const FeatureName = importPath.match(/\/widgets\/([^/]+)\//); // Извлекаем часть пути

            if (FeatureName) {
              const widget = FeatureName[1];

              const widgetObject = {
                inWidget: widget,
                updatedFeature: scss,
              };

              FeatureNames.push(widgetObject);

              console.log(
                `${widget} -искомый виджет в котором используется фича ${scss}`
              );
            }
          }

          //* Сохраняем информацию о виджетах для текущей страницы
          pages[pageName] = FeatureNames;

          //* Передаем информацию в следующий этап обработки
          file.FeatureNames = FeatureNames;
        };

        createWidgetsArr();
        cb(null, file);
      })
    )
    .on('end', () => {
      const currentChangedFeature = [scss];
      // compile function
      const compile = (pageFilePath) => {
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
      };

      //* Logger
      loggerEnabled
        ? featuresLogger('extracted data', JSON.stringify(pages, null, 2))
        : featuresLogger('null', null);

      //* Logger
      loggerEnabled
        ? featuresLogger('search html', currentChangedFeature)
        : featuresLogger('null', null);

      //* Logger
      loggerEnabled
        ? featuresLogger('Feature found', JSON.stringify(pages, null, 2))
        : featuresLogger('null', null);

      // scss compile
      currentChangedFeature.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/scss/${pageName}.scss`;

          compile(pageFilePath);
        });
      });

      // js compile
      currentChangedFeature.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/js/${pageName}.js`;

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
      reloadBrowser();
    });
};

//! JS
export const findFeatureJs = () => {
  const F_JS = glob.sync(app.path.src.features.js);

  // Определение последнего измененного файла
  const lastModifiedFeatureJs = findLastModifiedFile(F_JS);

  const js = extractFeatureName(lastModifiedFeatureJs);

  //* Logger
  loggerEnabled
    ? featuresLogger('extracted js', js)
    : featuresLogger('null', null);

  const pages = {};

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const createWidgetsArr = () => {
          const fileContents = file.contents.toString();
          const FeatureNames = [];
          const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

          // Регулярное выражение для поиска названий папок виджетов
          const importPattern =
            /import\s+\*\s+as\s+([^\s]+)\s+from\s+'(.*\/widgets\/[^']+?)';/g;

          let match;
          while ((match = importPattern.exec(fileContents)) !== null) {
            const importPath = match[2]; // Получаем путь из импорта

            const FeatureName = importPath.match(/\/widgets\/([^/]+)\//); // Извлекаем часть пути // header

            if (FeatureName) {
              const widget = FeatureName[1];

              const widgetObject = {
                inWidget: widget,
                updatedFeature: js,
              };

              FeatureNames.push(widgetObject);

              console.log(
                `${widget} -искомый виджет в котором используется фича ${js}`
              );
            }

            // Сохраняем информацию о виджетах для текущей страницы
            pages[pageName] = FeatureNames;

            // Передаем информацию в следующий этап обработки
            file.FeatureNames = FeatureNames;
          }
        };

        createWidgetsArr();
        cb(null, file);
      })
    )
    .on('end', () => {
      const currentChangedFeature = [js];

      // compile
      const compile = (pageFilePath) => {
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
      };

      //* Logger
      loggerEnabled
        ? featuresLogger('extracted data', JSON.stringify(pages, null, 2))
        : featuresLogger('null', null);

      //* Logger
      loggerEnabled
        ? featuresLogger('search js', currentChangedFeature)
        : featuresLogger('null', null);

      //* Logger
      loggerEnabled
        ? featuresLogger('Feature found', JSON.stringify(pages, null, 2))
        : featuresLogger('null', null);

      currentChangedFeature.forEach((name) => {
        let pageNames = findKeysWithName(pages, name);

        pageNames.forEach((pageName) => {
          let pageFilePath = `src/pages/${pageName}/styles/js/${pageName}.js`;

          compile(pageFilePath);
        });
      });
    })
    .on('end', () => {
      reloadBrowser();
    });
};
