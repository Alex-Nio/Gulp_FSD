import gulp from 'gulp';
import file from 'gulp-file';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export const addPage = (done) => {
  // Получите аргументы командной строки, начиная с третьего элемента (первые два - пути к Node.js и скрипту)
  const args = process.argv.slice(2);

  // Если аргументов нет, или если первый аргумент не существует, выведите сообщение об ошибке
  if (args.length <= 1 || !args[0] || !args[1]) {
    console.error('Укажите аргументы в формате: --папка --название-страницы');
    return;
  }

  const page = args[1].replace('--', '');
  const pageName = page.charAt(0).toLowerCase() + page.slice(1);

  console.log(`Название целевой папки страницы: ${pageName}`);

  const pageFolder = `src/pages/${pageName}`;

  const addPage = () => {
    // Проверить существование директории pages и создать её, если она не существует
    if (!fs.existsSync(pageFolder)) {
      fs.mkdirSync(pageFolder);
    }

    // Проверить существование директории pages/pageName и создать её, если она не существует
    if (!fs.existsSync(`${pageFolder}`)) {
      fs.mkdirSync(`${pageFolder}`);
    }

    // Создать файлы my-component.html, my-component.scss в папке ui, index.js
    file(`${pageName}.html`, '', { src: true }).pipe(
      gulp.dest(`${pageFolder}`)
    );

    file(`${pageName}.scss`, '', { src: true }).pipe(
      gulp.dest(`${pageFolder}/styles/scss`)
    );

    file(`${pageName}.js`, '', { src: true }).pipe(
      gulp.dest(`${pageFolder}/styles/js`)
    );
  };

  if (page && pageName) {
    addPage();
  } else {
    console.error('Укажите аргументы в формате: --папка --название страницы');
  }

  done();
};
