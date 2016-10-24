export default {
  mobile: true,
  inject: false,
  chunksSortMode: 'dependency',
  googleFonts: 'https://fonts.googleapis.com/css?family=Roboto|Slabo+27px',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
};
