/* eslint-disable */
import * as pathNode from 'path';
import fs from 'fs';

const srcFolder = 'src';
const buildFolder = 'dist';

const path = {
  src: pathNode.resolve(srcFolder),
  build: pathNode.resolve(buildFolder),
};

const getPageEntries = (pageFilePath) => {
  const pageEntries = {};
  const pagesPath = pathNode.resolve(`${path.src}/pages/`);
  const pages = fs.readdirSync(pagesPath);

  // console.log('Webpack принимает путь: ' + pageFilePath);
  // console.log('Страницы: ' + pages);

  if (pageFilePath) {
    // Извлекаем название файла из пути без расширения
    const fileName = pathNode.basename(pageFilePath, '.js');

    // Проверяем, существует ли такой файл в списке страниц
    if (pages.includes(fileName)) {
      const indexPath = pathNode.resolve(pageFilePath);
      pageEntries[fileName] = indexPath;
    } else {
      console.error(`Файл "${fileName}" не найден среди страниц.`);
    }
  } else {
    pages.forEach((page) => {
      const pageName = page;
      const indexPath = pathNode.resolve(
        `${pagesPath}/${page}/styles/js/${page}.js`
      );

      // Проверяем, существует ли файл index.js для страницы
      if (fs.existsSync(indexPath)) {
        pageEntries[pageName] = indexPath;
      }
    });
  }

  return pageEntries;
};

export const webpackConfig = (isMode, pageFilePath) => ({
  entry: {
    ...getPageEntries(pageFilePath),
  },
  mode: isMode ? 'development' : 'production',
  output: {
    path: `${path.build}/js`,
    filename: '[name].min.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: [/\.scss$/, /\.css$/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
