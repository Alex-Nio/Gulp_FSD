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

//? Default
import { html } from './gulp/tasks/styles/default/html.js';
import { scss } from './gulp/tasks/styles/default/scss.js';
import { images } from './gulp/tasks/styles/default/images.js';
import {
  ttfToWoff,
  ttfToWoff2,
  iconFont,
} from './gulp/tasks/styles/default/fonts.js';

import { json } from './gulp/tasks/styles/default/json.js';
import { js } from './gulp/tasks/styles/default/js.js';

//? Core
import { clean } from './gulp/tasks/core/clean.js';
import { logger } from './gulp/tasks/core/logger.js';
import { linter } from './gulp/tasks/core/linter.js';
import { server } from './gulp/tasks/core/server.js';

//? Widgets
import {
  findWidgetHtml,
  findWidgetScss,
  findWidgetJs,
} from './gulp/tasks/styles/widgets/widgets.js';

// TODO: add
// import { zip } from './gulp/tasks/zip.js';
// import { ftp } from './gulp/tasks/ftp.js';

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.pages.html, html);
  gulp.watch(path.watch.widgets.html, findWidgetHtml);
  gulp.watch(path.watch.widgets.scss, findWidgetScss);
  gulp.watch(path.watch.widgets.js, findWidgetJs);
  //Test

  //
  gulp.watch(path.watch.shared.ui, html);
  gulp.watch(path.watch.app, gulp.parallel(scss, json));
  gulp.watch(path.watch.pages.scss, scss);
  gulp.watch(path.watch.pages.js, js);
}

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
    logger('start');
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

// Экспорт сценариев
export { dev };
export { build };

// Выполнение сценария по умолчанию
gulp.task('default', dev);
gulp.task('build', build);
