import gulp from 'gulp';
import file from 'gulp-file';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const addWidget = (done) => {
  // Получите аргументы командной строки, начиная с третьего элемента (первые два - пути к Node.js и скрипту)
  const args = process.argv.slice(2);

  // Если аргументов нет, или если первый аргумент не существует, выведите сообщение об ошибке
  if (args.length <= 1 || !args[0] || !args[1]) {
    console.error('Укажите аргументы в формате: --папка --название компонента');
    return;
  }

  const widget = args[1].replace('--', '');
  const widgetName = widget.charAt(0).toLowerCase() + widget.slice(1);

  // console.log(`Название целевой папки Widgets компонента: ${widgetName}`);

  const widgetFolder = `src/widgets/${widgetName}`;

  const addWidget = () => {
    // Проверить существование директории widgets и создать её, если она не существует
    if (!fs.existsSync(widgetFolder)) {
      fs.mkdirSync(widgetFolder);
    }

    // Проверить существование директории widgets/widgetName и создать её, если она не существует
    if (!fs.existsSync(`${widgetFolder}`)) {
      fs.mkdirSync(`${widgetFolder}/_widget`);
    }

    // Создать файлы my-component.html, my-component.scss в папке ui, index.js
    file(`${widgetName}.html`, '', { src: true }).pipe(
      gulp.dest(`${widgetFolder}/_widget`)
    );

    file(`${widgetName}.scss`, '', { src: true }).pipe(
      gulp.dest(`${widgetFolder}/_widget`)
    );

    file('api.js', '', { src: true }).pipe(gulp.dest(`${widgetFolder}`));
  };

  if (widget && widgetName) {
    addWidget();
  } else {
    console.error('Укажите аргументы в формате: --папка --название компонента');
  }

  done();
};
