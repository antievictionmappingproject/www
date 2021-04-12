module.exports = [require("./post-gallery.js")];

if (typeof window !== "undefined" && window.CMS) {
  module.exports.forEach((component) => {
    window.CMS.registerEditorComponent(component);
  });
}
