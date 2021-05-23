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
  pattern: /^{% postGallery "(.+)", collections, locale %}$/,
  fromBlock([, tag]) {
    return { tag };
  },
  toBlock({ tag }) {
    return `{% postGallery "${tag}", collections, locale %}`;
  },
  toPreview({ tag }) {
    return `<div class="component">Post Gallery: ${tag}<div>`;
  },
  render(tag, collections, locale) {
    console.log(locale);
    return `
      <div>
        <h2>${tag}</h2>
        <ol>
        ${collections[tag]
          .map((item) =>
            item.data.locale === locale
              ? `<li><a href="${item.url}">${item.data.title}</a></li>`
              : ""
          )
          .join("")}
        </ol>
      </div>
      `;
  },
};
