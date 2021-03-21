const CleanCSS = require("clean-css");

const { translations } = require("./_data/translations.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("translate", function (value) {
    const o = translations.find(({ en }) => en === value);
    return (typeof o === "object" && o[this.ctx.locale]) || value;
  });

  ["en", "es"].forEach((locale) => {
    eleventyConfig.addCollection(locale, (collectionApi) => {
      return collectionApi.getAll().filter((item) => {
        return item.data.locale === locale;
      });
    });
  });

  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
};
