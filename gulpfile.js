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

//? Core
import { clean } from './gulp/tasks/core/clean.js';
import { logger } from './gulp/tasks/core/logger.js';
import { linter } from './gulp/tasks/core/linter.js';
import { server } from './gulp/tasks/core/server.js';
//? Default
import { html } from './gulp/tasks/styles/default/html.js';
import { scss } from './gulp/tasks/styles/default/scss.js';
import { images } from './gulp/tasks/styles/default/images.js';
import { compileFonts } from './gulp/tasks/styles/default/fonts.js';
import { json } from './gulp/tasks/styles/default/json.js';
import { js } from './gulp/tasks/styles/default/js.js';
//? Widgets
import { widgets } from './gulp/tasks/styles/widgets/widgets.js';
//? Features
import { features } from './gulp/tasks/styles/features/features.js';
//? Custom
import { addShared } from './gulp/tasks/custom/addShared.js';

// Наблюдатель за изменениями в файлах
function watcher() {
  // App
  gulp.watch(path.watch.app, gulp.parallel(scss, json));
  // Pages
  gulp.watch(path.watch.pages.html, html);
  gulp.watch(path.watch.pages.scss, scss);
  gulp.watch(path.watch.pages.js, js);
  // Widgets
  gulp.watch(path.watch.widgets.html, widgets.findWidgetHtml);
  gulp.watch(path.watch.widgets.scss, widgets.findWidgetScss);
  gulp.watch(path.watch.widgets.js, widgets.findWidgetJs);
  // Features
  gulp.watch(path.watch.features.html, features.findFeatureHtml);
  gulp.watch(path.watch.features.scss, features.findFeatureScss);
  gulp.watch(path.watch.features.js, features.findFeatureJs);
  // Shared
  gulp.watch(path.watch.shared.html, html);
  gulp.watch(path.watch.shared.scss, gulp.series(js, scss));
}

// Последовательная обработка шрифтов
const fonts = gulp.series(
  compileFonts.ttfToWoff,
  compileFonts.ttfToWoff2,
  compileFonts.iconFont,
  (done) => {
    logger('fonts done'), done();
  }
);

// Основные задачи
const mainTasks = gulp.series(
  linter,
  fonts,
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
gulp.task('add-s', addShared);
