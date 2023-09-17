/* eslint-disable */
// Получаем имя папки проекта
const buildFolder = `./dist`;
const srcFolder = `./src`;

const layers = {
  app: `${srcFolder}/app`,
  processes: `${srcFolder}/process`,
  pages: `${srcFolder}/pages`,
  widgets: `${srcFolder}/widgets`,
  features: `${srcFolder}/features`,
  shared: `${srcFolder}/shared`,
};

export const path = {
  build: {
    js: `${buildFolder}/styles/js/`,
    css: `${buildFolder}/styles/css/`,
    html: `${buildFolder}/`,
    pages: `${buildFolder}/`,
    images: `${buildFolder}/assets/images/`,
    fonts: `${buildFolder}/assets/fonts/`,
    files: `${buildFolder}/files/`,
    data: `${buildFolder}/`,
  },
  src: {
    //* App
    app: `${layers.app}/`,
    //* Processes
    processes: `${layers.processes}/`,
    //* Pages
    pages: {
      html: `${layers.pages}/**/*.html`,
      scss: `${layers.pages}/**/styles/scss/*.scss`,
      js: `${layers.pages}/**/styles/js/*.js`,
    },
    //* Widgets
    widgets: `${layers.widgets}/**/*.html`,
    //* Features
    features: `${layers.features}/**/*.js`,
    //* Shared
    shared: {
      images: `${layers.shared}/assets/images/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
      fonts: `${layers.shared}/assets/fonts/`,
      ui: `${layers.shared}/**/ui/*.html`,
    },
  },
  watch: {
    //* App
    app: `${layers.app}/`,
    //* Processes
    processes: `${layers.processes}/`,
    //* Pages
    pages: {
      html: `${layers.pages}/**/*.html`,
      scss: `${layers.pages}/**/styles/scss/*.scss`,
      js: `${layers.pages}/**/styles/js/*.js`,
    },
    //* Widgets
    widgets: `${layers.widgets}/**/*.html`,
    //* Features
    features: `${layers.features}/**/*.js`,
    //* Shared
    shared: {
      images: `${layers.shared}/assets/images/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
      fonts: `${layers.shared}/assets/fonts/`,
      ui: `${layers.shared}/**/ui/*.html`,
    },
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  layers: layers,
};
