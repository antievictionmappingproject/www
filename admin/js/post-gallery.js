const component = {
  id: "post-gallery",
  label: "Post Gallery",
  fields: [
    {
      name: "tag",
      label: "Tags",
      widget: "string",
    },
  ],
  pattern: /^post-gallery( \S+)*$/,
  fromBlock: function ([, tag]) {
    return { tag };
  },
  toBlock: function ({ tag }) {
    return `post-gallery ${tag}`;
  },
  toPreview: function ({ tag }) {
    return `!!! post-gallery <${tag}> !!!`;
  },
};

if (typeof window !== "undefined" && window.CMS) {
  window.CMS.registerEditorComponent(component);
}

if (module.exports) {
  module.exports = component;
}
