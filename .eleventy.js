const CleanCSS = require("clean-css");
const i18nPlugin = require("eleventy-plugin-i18n");

const translations = require("./_data/translations.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPlugin(i18nPlugin, {
    translations,
    fallbackLocales: {
      "*": "en",
    },
  });

  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
};
