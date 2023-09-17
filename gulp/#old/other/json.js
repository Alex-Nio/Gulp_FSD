/* eslint-disable */
export const json = () => {
  return app.gulp
    .src(app.path.src.data)
    .pipe(app.gulp.dest(app.path.build.data));
};
