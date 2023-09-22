/* eslint-disable */
import replace from 'gulp-replace'; // Поиск и замена
import plumber from 'gulp-plumber'; // Обработка ошибок
import notify from 'gulp-notify'; // Сообщения (подсказки)
import browserSync from 'browser-sync'; // Локальный сервер
import newer from 'gulp-newer'; // Проверка обновления
import ifPlugin from 'gulp-if'; // Условное ветвление
import autoPrefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import imagemin from 'gulp-imagemin';
import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import flatten from 'gulp-flatten';
import fileinclude from 'gulp-file-include';
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа запросов
import rename from 'gulp-rename';
import webpHtmlNosvg from 'gulp-webp-html-nosvg';
import webp from 'gulp-webp';
import versionNumber from 'gulp-version-number';
import htmlMin from 'gulp-htmlmin';
import gulpCached from 'gulp-cached';
import through2 from 'through2';
import { logger } from './../tasks/core/logger.js';

export const plugins = {
  through2: through2,
  logger: logger,
  gulpCached: gulpCached,
  groupCssMediaQueries: groupCssMediaQueries,
  rename: rename,
  webpcss: webpcss,
  cleanCss: cleanCss,
  replace: replace,
  webp: webp,
  autoPrefixer: autoPrefixer,
  fileinclude: fileinclude,
  webpHtmlNosvg: webpHtmlNosvg,
  versionNumber: versionNumber,
  htmlMin: htmlMin,
  plumber: plumber,
  imagemin: imagemin,
  notify: notify,
  browserSync: browserSync,
  newer: newer,
  if: ifPlugin,
  flatten: flatten,
};
