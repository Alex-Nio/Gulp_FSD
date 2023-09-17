/* eslint-disable */
import replace from 'gulp-replace'; // Поиск и замена
import plumber from 'gulp-plumber'; // Обработка ошибок
import notify from 'gulp-notify'; // Сообщения (подсказки)
import browserSync from 'browser-sync'; // Локальный сервер
import newer from 'gulp-newer'; // Проверка обновления
import ifPlugin from 'gulp-if'; // Условное ветвление
import imagemin from 'gulp-imagemin';
import flatten from 'gulp-flatten';

export const plugins = {
  replace: replace,
  plumber: plumber,
  imagemin: imagemin,
  notify: notify,
  browserSync: browserSync,
  newer: newer,
  if: ifPlugin,
  flatten: flatten,
};
