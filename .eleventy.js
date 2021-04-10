const he = require("he");
const markdownIt = require("markdown-it");
const markdownItRegexp = require("markdown-it-regexp");

const { translations } = require("./_data/translations.json");
const { languages } = require("./_data/site.js");
const postGalleryComponent = require("./admin/js/post-gallery.js");

const markdownLib = markdownIt({ html: true }).use(
  markdownItRegexp(postGalleryComponent.pattern, function (match) {
    return toPreview(fromBlock(match));
  })
);

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setLibrary("md", markdownLib);

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
      .replace(/\s+/g, " ")
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
