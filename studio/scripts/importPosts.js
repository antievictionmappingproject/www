import slugify from "slugify";
import Schema from "@sanity/schema";
import blockTools from "@sanity/block-tools";
import postSchema from "../schemas/post.js";
import { JSDOM } from "jsdom";
import { eachItem } from "./sqsp.js";

const compiledSchema = Schema.default.compile({
  name: "default",
  types: [postSchema],
});

export function run({}) {
  await eachItem((item) => {
    console.log({
      _type: "post",
      title: {
        en: item.title,
      },
      slug: {
        current: slugify(item.title),
      },
      excerpt: {
        en: item["excerpt:encoded"],
      },
      mainImage: {
        _type: "image",
        _id: item._thumbnail_id,
      },
      locations: item.category?.map((location) => ({
        _type: "reference",
        _ref: `location-${location}`,
      })),
      tags: item.post_tag?.map((tag) => ({
        _type: "reference",
        _ref: `tag-${tag}`,
      })),
      author: {
        _type: "reference",
        _ref: getAuthorId(item),
      },
      datePublished: new Date(item["wp:post_date"]).toISOString(),
      dateUpdated: new Date(item["wp:post_date"]).toISOString(),
      body: {
        en: blockTools.htmlToBlocks(
          item["content:encoded"],
          compiledSchema
            .get("post")
            .fields.find((field) => field.name === "body")
            .type.fields.find((field) => field.name === "en").type,
          { parseHtml: (html) => new JSDOM(html).window.document }
        ),
      },
    });
  });
}
