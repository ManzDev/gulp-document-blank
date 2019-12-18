import imagemin from "gulp-imagemin";

export default [
  imagemin.gifsicle({
    interlaced: true,
    optimizationLevel: 3
  }),
  imagemin.jpegtran({
    progressive: true
  }),
  imagemin.optipng({
    optimizationLevel: 7
  }),
  imagemin.svgo({
    plugins: [
      { removeViewBox: true },
      { cleanupIDs: false },
      { sortAttrs: true }
    ]
  })
];
