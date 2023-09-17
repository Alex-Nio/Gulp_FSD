/* eslint-disable */
export const json = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/app/config/data/*.json`)
    .pipe(app.gulp.dest(`${app.path.build.data}/data`));
};
