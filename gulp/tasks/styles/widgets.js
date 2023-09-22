/* eslint-disable */
import path from 'path';
import * as glob from 'glob';
import fs from 'fs';

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

// Функция для поиска виджетов в JS файлах страниц
export const findWidgetNames = () => {
  const W_SCSS = glob.sync(app.path.src.widgets.scss);
  const W_HTML = glob.sync(app.path.src.widgets.html);
  const W_JS = glob.sync(app.path.src.widgets.js);

  // Определение последнего измененного файла
  const lastModifiedWidgetScss = findLastModifiedFile(W_SCSS);
  const lastModifiedWidgetHtml = findLastModifiedFile(W_HTML);
  const lastModifiedWidgetJs = findLastModifiedFile(W_JS);

  const test1 = extractWidgetName(lastModifiedWidgetScss);
  const test2 = extractWidgetName(lastModifiedWidgetHtml);
  const test3 = extractWidgetName(lastModifiedWidgetJs);

  console.log(`Последний измененный файл Scss: ${lastModifiedWidgetScss}`);
  console.log(`Последний измененный файл Html: ${lastModifiedWidgetHtml}`);
  console.log(`Последний измененный файл Js: ${lastModifiedWidgetJs}`);

  console.log('--------Компоненты которые были изменены--------');
  console.log(test1, test2, test3);
  console.log('------------------------------------------------');

  const pages = {};

  return app.gulp
    .src(app.path.src.pages.js)
    .pipe(
      app.plugins.through2.obj((file, enc, cb) => {
        const fileContents = file.contents.toString();
        const widgetNames = [];
        const pageName = path.basename(file.path, '.js').replace(/['"]/g, '');

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
        console.log('--------Компоненты--------');
        console.log(widgetNames);
        console.log('---------------------------');

        // Сохраняем информацию о виджетах для текущей страницы
        pages[pageName] = widgetNames;

        // Передаем информацию в следующий этап обработки
        file.widgetNames = widgetNames;
        cb(null, file);
      })
    )
    .on('end', () => {
      console.log('-------------DATA----------');
      console.log(JSON.stringify(pages, null, 2));
      console.log('---------------------------');
    });
};

export const findFile = () => {
  console.log('find file...');
};
