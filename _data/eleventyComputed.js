module.exports = {
  page: {
    internationalStem: (data) => data.page.url.replace(/^\/\w*\//g, "/"),
  },
};
