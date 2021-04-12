module.exports = {
  id: "post-gallery",
  label: "Post Gallery",
  fields: [
    {
      name: "tag",
      label: "Tags",
      widget: "string",
    },
  ],
  pattern: /^!post-gallery (\S+)$/,
  fromBlock([, tag]) {
    return { tag };
  },
  toBlock({ tag }) {
    return `!post-gallery ${tag}`;
  },
  toPreview({ tag }) {
    return `<div style="color: red">${tag}<div>`;
  },
};
