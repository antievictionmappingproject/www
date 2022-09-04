import fsp from "fs/promises";
import fs from "fs";
import slugifyHelper from "slugify";
import blockTools from "@sanity/block-tools";
import { JSDOM } from "jsdom";
import { eachItem } from "../lib/sqsp.js";
import { getSchema } from "../lib/sanity.js";

const exportFile = new URL("../tmp/export.xml", import.meta.url);
const attachmentsFile = new URL("../tmp/attachments.json", import.meta.url);

const schema = getSchema();

function slugify(string) {
  return slugifyHelper(string, { strict: true });
}

function writeLine(object) {
  process.stdout.write(JSON.stringify(object) + "\n");
}

export async function run() {
  const authors = new Set(),
    locations = new Set(),
    tags = new Set();
  const attachments = new Map(JSON.parse(await fsp.readFile(attachmentsFile)));
  await eachItem(fs.createReadStream(exportFile), (item) => {
    if (item["wp:post_type"] === "post") {
      authors.add(item["dc:creator"]);
      for (let location of item.category ?? []) {
        locations.add(location);
      }
      for (let tag of item.post_tag ?? []) {
        tags.add(tag);
      }
      writeLine({
        _type: "post",
        title: {
          en: item.title,
        },
        slug: {
          current: slugify(item.title),
        },
        author: {
          _type: "reference",
          _ref: slugify("author-" + item["dc:creator"]),
        },
        mainImage: attachments.has(item._thumbnail_id)
          ? {
              _type: "image",
              asset: {
                _ref: attachments.get(item._thumbnail_id),
                _type: "reference",
              },
            }
          : undefined,
        locations: item.category?.map((location) => ({
          _type: "reference",
          _ref: slugify("location-" + location),
        })),
        tags: item.post_tag?.map((tag) => ({
          _type: "reference",
          _ref: slugify("tag-" + tag),
        })),
        datePublished: new Date(item["wp:post_date"]).toISOString(),
        dateUpdated: new Date(item["wp:post_date"]).toISOString(),
        body: {
          en: blockTools.htmlToBlocks(
            item["content:encoded"],
            schema
              .get("post")
              .fields.find((field) => field.name === "body")
              .type.fields.find((field) => field.name === "en").type,
            { parseHtml: (html) => new JSDOM(html).window.document }
          ),
        },
      });
    }
  });

  for (let author of authors) {
    writeLine({
      _type: "author",
      _id: slugify("author-" + author),
      name: author,
    });
  }

  for (let location of locations) {
    writeLine({
      _type: "location",
      _id: slugify("location-" + location),
      title: location,
    });
  }

  for (let tag of tags) {
    writeLine({
      _type: "tag",
      _id: slugify("tag-" + tag),
      title: {
        en: tag,
      },
    });
  }
}

run();
