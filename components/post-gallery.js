module.exports = {
  id: "postGallery",
  label: "Post Gallery",
  fields: [
    {
      name: "tag",
      label: "Tags",
      widget: "string",
    },
  ],
  pattern: /^{% postGallery "(\S+)", collections %}$/,
  fromBlock([, tag]) {
    return { tag };
  },
  toBlock({ tag }) {
    return `{% postGallery "${tag}", collections %}`;
  },
  toPreview({ tag }) {
    return `<div class="component">Post Gallery: ${tag}<div>`;
  },
  render(tag, collections) {
    return collections[tag]
      .map((item) => `<div>${item.data.title}</div>`)
      .join("");
  },
};
