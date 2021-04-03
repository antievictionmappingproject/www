const he = require("he");
const { translations } = require("./_data/translations.json");
const { languages } = require("./_data/site.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addFilter("translate", function (value) {
    const o = translations.find(({ en }) => en === value);
    return (typeof o === "object" && o[this.ctx.locale]) || value;
  });

  eleventyConfig.addFilter("squash", function (text) {
    let content = new String(text);
    const words = he
      .decode(content)
      .replace(/(<([^>]+)>)/gi, "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s/g, " ")
      .split(" ");
    return [...new Set(words)].join(" ");
  });

  languages
    .map((lang) => lang.code)
    .forEach((locale) => {
      eleventyConfig.addCollection(locale, (collectionApi) => {
        return collectionApi.getAll().filter((item) => {
          return item.data.locale === locale;
        });
      });
    });

  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("assets");
};
