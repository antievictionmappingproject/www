const he = require("he");
const markdownIt = require("markdown-it");
const markdownItRegexp = require("markdown-it-regexp");

const { translations } = require("./_data/translations.json");
const { languages } = require("./_data/site.js");
const components = require("./components/index.js");

function componentPlugin(md, { id, pattern, toPreview, fromBlock }) {
  const name = "component_" + id;
  md.block.ruler.before(
    "paragraph",
    name,
    function replace(state, startLine, endLine, silent) {
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const max = state.eMarks[startLine];
      if (state.src.charCodeAt(start) !== "!".charCodeAt(0)) {
        return false;
      }
      const match = pattern.exec(state.src.slice(start, max));
      if (!match) {
        return false;
      }
      if (silent) {
        return true;
      }
      const token = state.push(name, "", 0);
      token.meta = match;
      state.line = endLine;
      return true;
    }
  );
  md.renderer.rules[name] = function (tokens, id) {
    return toPreview(fromBlock(tokens[id].meta));
  };
}

const md = markdownIt({ html: true });
components.forEach((component) => {
  md.use(componentPlugin, component);
});

module.exports = function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setLibrary("md", md);

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

  components.forEach((component) => {
    eleventyConfig.addShortcode(component.id, component.render);
  });

  return {
    markdownTemplateEngine: "njk",
  };
};
