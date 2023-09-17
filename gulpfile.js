import gulp from 'gulp'; // Основной модуль
import { path } from './gulp/config/path.js'; // Импорт путей
import { plugins } from './gulp/config/plugins.js'; // Импорт общих плагинов

const outOfKey =
  !process.argv.includes('--max') &&
  !process.argv.includes('--min') &&
  !process.argv.includes('--optimized');

// Передаем значения в глобальную переменную
global.app = {
  build: {
    max: process.argv.includes('--max'),
    min: process.argv.includes('--min'),
    optimized: process.argv.includes('--optimized'),
    default: outOfKey,
  },
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// Импорт задач

// Styles
import { html } from './gulp/tasks/styles/html.js';
import { scss } from './gulp/tasks/styles/scss.js';
import { images } from './gulp/tasks/styles/images.js';
import { ttfToWoff, ttfToWoff2, iconFont } from './gulp/tasks/styles/fonts.js';
import { json } from './gulp/tasks/styles/json.js';
import { js } from './gulp/tasks/styles/js.js';
// import { svgSprive } from './gulp/tasks/styles/svgSprive.js';
// Components
// import { createComponent } from './gulp/tasks/components/createComponent.js';
// import { cleanComponents } from './gulp/tasks/components/cleanComponents.js';
// Custom
// import { createPage } from './gulp/tasks/custom/createPage.js';
import { logger } from './gulp/tasks/core/logger.js';
// Other
import { clean } from './gulp/tasks/core/clean.js';
import { server } from './gulp/tasks/core/server.js';
import { linter } from './gulp/tasks/core/linter.js';

// import { zip } from './gulp/tasks/zip.js'; // TODO: тестирование
// import { ftp } from './gulp/tasks/ftp.js'; // TODO: тестирование

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.pages.html, html);
  gulp.watch(path.watch.widgets, html);
  gulp.watch(path.watch.shared.ui, html);
  gulp.watch(path.watch.app, gulp.parallel(scss, json));
  gulp.watch(path.watch.pages.scss, scss);
  gulp.watch(path.watch.pages.js, js);
}

// export { svgSprive };

// Последовательная обработка шрифтов
const fontsCopy = gulp.series(ttfToWoff, ttfToWoff2, iconFont, (done) => {
  logger('fonts done'), done();
});

// Основные задачи
const mainTasks = gulp.series(
  linter,
  fontsCopy,
  gulp.parallel(html, scss, js, json, images)
);

//* Development
const dev = gulp.series(
  (done) => {
    logger('start'); // Вызываем logger с аргументом 'start'
    done();
  },
  clean,
  (done) => {
    logger('clean done');
    done();
  },
  mainTasks,
  gulp.parallel(watcher, server)
);

const build = gulp.series(clean, gulp.parallel(mainTasks));
// const removeEmpty = gulp.series(cleanComponents);
// const deployZIP = gulp.series(clean, mainTasks, zip); // TODO: тестирование
// const deployFTP = gulp.series(clean, mainTasks, ftp); // TODO: тестирование

// Экспорт сценариев
export { dev };
export { build };
// export { removeEmpty };
// export { deployZIP }; // TODO: тестирование
// export { deployFTP }; // TODO: тестирование

// Выполнение сценария по умолчанию
gulp.task('default', dev);

/*

  *Создание компонента по команде: gulp create-component --name my-component
  *Примечание: my-component - это имя компонента, которое вы хотите создать

 */

// gulp.task('create-component', createComponent);

/*

  *Создание компонента по команде: gulp create-page --name page
  *Примечание: page - это имя файла страницы, которое вы хотите создать

*/

// gulp.task('create-page', createPage);
