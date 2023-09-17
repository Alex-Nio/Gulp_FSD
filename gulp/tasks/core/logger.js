/*eslint indent: "off"*/
import chalk from 'chalk';

export const logger = (action) => {
  switch (action) {
    case 'start':
      console.log(chalk.magenta.bgYellow.bold('Запуск Gulp, приятной работы!'));
      break;
    case 'clean done':
      console.log(
        chalk.magenta.bgYellow.bold('Директория Dist очищена от старых файлов')
      );
      break;
    case 'lint done':
      console.log(chalk.magenta.bgYellow.bold('Выполнена проверка линтером'));
      break;
    case 'fonts done':
      console.log(chalk.magenta.bgYellow.bold('Шрифты скомпилированы'));
      break;
    case 'images done':
      console.log(chalk.magenta.bgYellow.bold('Изображения оптимизированы'));
      break;
  }
};
