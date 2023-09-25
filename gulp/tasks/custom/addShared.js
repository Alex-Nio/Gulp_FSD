import gulp from 'gulp';
import file from 'gulp-file';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// Add shared component task
export const addShared = (done) => {
  // Получите аргументы командной строки, начиная с третьего элемента (первые два - пути к Node.js и скрипту)
  const args = process.argv.slice(2);

  // Если аргументов нет, или если первый аргумент не существует, выведите сообщение об ошибке
  if (args.length <= 1 || !args[0] || !args[1]) {
    console.error('Укажите аргументы в формате: --папка --название компонента');
    return;
  }

  const folder = args[1].replace('--', '');
  const folderName = folder.charAt(0).toUpperCase() + folder.slice(1);
  const component = args[2].replace('--', '');
  const componentName = component.charAt(0).toLowerCase() + component.slice(1);

  console.log(`Название целевой папки Shared компонента: ${folderName}`);
  console.log(`Название компонента: ${componentName}`);

  const shared = `src/shared/components/${folderName}`;
  const sharedUi = `${shared}/${componentName}/ui`;

  const addSharedComponent = () => {
    // Проверить существование директории shared и создать её, если она не существует
    if (!fs.existsSync(shared)) {
      fs.mkdirSync(shared);
    }

    // Проверить существование директории shared/componentName и создать её, если она не существует
    if (!fs.existsSync(`${shared}/${componentName}`)) {
      fs.mkdirSync(`${shared}/${componentName}`);
    }

    // Проверить существование директории sharedUi и создать её, если она не существует
    if (!fs.existsSync(sharedUi)) {
      fs.mkdirSync(sharedUi);
    }

    // Создать файлы my-component.html, my-component.scss в папке ui, index.js
    file(`${componentName}.html`, '', { src: true }).pipe(
      gulp.dest(`${sharedUi}`)
    );

    file(`${componentName}.scss`, '', { src: true }).pipe(
      gulp.dest(`${sharedUi}`)
    );

    file('index.js', '', { src: true }).pipe(
      gulp.dest(`${shared}/${componentName}`)
    );

    setTimeout(() => {
      addImports();
    }, 10);
  };

  const addImports = () => {
    // Изменить импорт в index.js
    const importStatement = `import './ui/${componentName}.scss';\n`;

    const componentIndexPath = path.join(`${shared}/${componentName}/index.js`);

    // Прочитать текущее содержимое файла
    fs.readFile(componentIndexPath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Ошибка чтения файла ${componentIndexPath}: ${err}`);
        return;
      }

      // Добавить импорт в начало файла
      const updatedData = importStatement + data;

      // Записать обновленное содержимое обратно в файл
      fs.writeFile(componentIndexPath, updatedData, 'utf8', (err) => {
        if (err) {
          console.error(`Ошибка записи в файл ${componentIndexPath}: ${err}`);
          return;
        }

        console.log(`Добавлен импорт в ${componentIndexPath}`);
      });
    });
  };

  if (folderName && componentName) {
    addSharedComponent();
  } else {
    console.error('Укажите аргументы в формате: --папка --название компонента');
  }

  done();
};
