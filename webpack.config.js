/* eslint-disable */
import * as pathNode from 'path';
import fs from 'fs';

const srcFolder = 'src';
const buildFolder = 'dist';

const path = {
  src: pathNode.resolve(srcFolder),
  build: pathNode.resolve(buildFolder),
};

const getPageEntries = () => {
  const pagesPath = pathNode.resolve(`${path.src}/pages/`);
  const pages = fs.readdirSync(pagesPath);
  const pageEntries = {};

  pages.forEach((page) => {
    const pageName = page;
    const indexPath = pathNode.resolve(
      `${pagesPath}/${page}/styles/js/${page}.js`
    );

    if (fs.existsSync(indexPath)) {
      // Проверяем, существует ли файл index.js для страницы
      pageEntries[pageName] = indexPath;
    }
  });

  console.log(pageEntries);
  return pageEntries;
};

export const webpackConfig = (isMode) => ({
  entry: {
    ...getPageEntries(),
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
        test: [/\.css$/, /\.scss$/],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
});
