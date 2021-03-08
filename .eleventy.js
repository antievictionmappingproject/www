const locales = require("./_data/locales.json");
const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPassthroughCopy("admin");

  locales.forEach((locale) => {
    eleventyConfig.addCollection(`posts_${locale}`, function (collectionApi) {
      return collectionApi.getFilteredByGlob(`posts/${locale}/*.md`);
    });
  });
};
