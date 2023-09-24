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
    widgets: {
      html: `${layers.widgets}/**/*.html`,
      scss: `${layers.widgets}/**/*.scss`,
      js: `${layers.widgets}/**/*.js`,
      api: `${layers.widgets}/**/api.js`,
    },
    //* Features
    features: {
      html: `${layers.features}/**/*.html`,
      scss: `${layers.features}/**/*.scss`,
      js: `${layers.features}/**/*.js`,
      api: `${layers.features}/**/api.js`,
    },
    //* Shared
    shared: {
      images: `${layers.shared}/assets/images/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
      fonts: `${layers.shared}/assets/fonts/`,
      ui: `${layers.shared}/components/**/ui/*.html`,
      scss: `${layers.shared}/components/**/ui/*.scss`,
      js: `${layers.shared}/components/**/*.js`,
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
    widgets: {
      html: `${layers.widgets}/**/*.html`,
      scss: `${layers.widgets}/**/*.scss`,
      js: `${layers.widgets}/**/*.js`,
    },
    //* Features
    features: {
      html: `${layers.features}/**/*.html`,
      scss: `${layers.features}/**/*.scss`,
      js: `${layers.features}/**/*.js`,
    },
    //* Shared
    shared: {
      images: `${layers.shared}/assets/images/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
      fonts: `${layers.shared}/assets/fonts/`,
      ui: `${layers.shared}/components/**/ui/*.html`,
      scss: `${layers.shared}/components/**/ui/*.scss`,
      js: `${layers.shared}/components/**/*.js`,
    },
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  layers: layers,
};
