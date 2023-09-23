/* eslint-disable */
import inquirer from 'inquirer';
import browserSync from 'browser-sync';
import fs from 'fs/promises'; // Используем асинхронные методы работы с файлами
import { fileURLToPath } from 'url';
import path from 'path';

// Получаем абсолютный путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, 'config.json'); // Абсолютный путь к файлу config.json

export const server = async (done) => {
  const browsers = ['firefox', 'opera', 'chrome'];

  // Чтение файла конфигурации
  let config = {};
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    config = JSON.parse(configData);
  } catch (err) {
    console.error('Ошибка чтения файла конфигурации:', err);
  }

  let selectedBrowser = config.defaultBrowser || ''; // Используем браузер по умолчанию из конфигурации

  // Если браузер по умолчанию не установлен, предложим выбрать браузер
  if (!selectedBrowser) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'browser',
        message: 'Выберите браузер для запуска:',
        choices: browsers,
      },
      {
        type: 'confirm',
        name: 'setDefault',
        message: 'Сделать выбранный браузер браузером по умолчанию?',
        default: false,
      },
    ]);

    selectedBrowser = answers.browser;
    const setDefault = answers.setDefault;

    if (setDefault) {
      config.defaultBrowser = selectedBrowser;

      // Запись выбранного браузера в файл конфигурации
      try {
        await fs.writeFile(
          configPath,
          JSON.stringify(config, null, 2),
          'utf-8'
        );
      } catch (err) {
        console.error('Ошибка записи файла конфигурации:', err);
      }
    }
  }

  const bs = browserSync.create();

  bs.init({
    server: {
      baseDir: `${app.path.build.html}`,
    },
    notify: true,
    port: 3000,
    browser: selectedBrowser,
  });

  done();
};
