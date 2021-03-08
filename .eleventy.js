const locales = ["en", "es"];

const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("locales", locales);

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
