import fs from "fs";
import sax from "sax";
import { createMachine, interpret, assign } from "xstate";
import slugify from "slugify";
import Schema from "@sanity/schema";
import blockTools from "@sanity/block-tools";
import postSchema from "../schemas/post";
import { JSDOM } from "jsdom";

const compiledSchema = Schema.compile({
  name: "default",
  types: [postSchema],
});

const inputStream = fs.createReadStream("./export.xml");
const outputStream = fs.createWriteStream("./dataset.ndjson");

function writeLine(data) {
  outputStream.write(JSON.stringify(data) + "\n");
}

function writeItem(item) {
  const _type = item["wp:post_type"];
  if (_type === "post") {
    const tags = item.post_tag ?? [];
    const locations = item.category ?? [];
    const author = item["dc:creator"]?.split("@")[0];
    writeLine({
      _type,
      title: {
        en: item.title,
      },
      slug: slugify(item.title),
      excerpt: {
        en: item["excerpt:encoded"],
      },
      passthroughUrl: item.passthrough_url,
      locations: locations.map((location) => ({
        _type: "reference",
        _ref: `location-${location}`,
      })),
      tags: tags.map((tag) => ({
        _type: "reference",
        _ref: `tag-${tag}`,
      })),
      author: {
        _type: "reference",
        _ref: author,
      },
      datePublished: new Date(item["wp:post_date"]).toISOString(),
      dateUpdated: new Date(item["wp:post_date"]).toISOString(),
      body: blockTools.htmlToBlocks(
        item["content:encoded"],
        compiledSchema
          .get("post")
          .fields.find((field) => field.name === "body")
          .type.fields.find((field) => field.name === "en").type,
        { parseHtml: (html) => new JSDOM(html).window.document }
      ),
    });
    writeLine({
      _type: "author",
      _id: author,
    });
    for (let tag of tags) {
      writeLine({
        _type: "tag",
        _id: `tag-${tag}`,
        title: {
          en: tag,
        },
        slug: tag,
      });
    }
    for (let location of locations) {
      writeLine({
        _type: "location",
        _id: `location-${location}`,
        title: location,
        slug: location,
      });
    }
  }
}

function openCondition(_, event) {
  return event.type.startsWith("open:");
}

function closeCondition(_, event) {
  return event.type.startsWith("close:");
}

const machine = createMachine(
  {
    id: "xml",
    initial: "inactive",
    context: {
      currentText: null,
      currentItem: {},
      currentMeta: {},
    },
    states: {
      inactive: {
        on: {
          "open:item": "item",
        },
      },
      item: {
        on: {
          "open:wp:postmeta": "meta",
          "open:category": {
            target: "category",
            actions: "openAndCloseCategory",
          },
          "close:item": {
            target: "inactive",
            actions: "closeItem",
          },
          "*": [
            {
              target: "itemChild",
              cond: openCondition,
            },
          ],
        },
      },
      category: {
        on: {
          "close:category": "item",
        },
      },
      itemChild: {
        on: {
          text: { actions: "text" },
          "*": [
            {
              target: "item",
              cond: closeCondition,
              actions: "closeItemChild",
            },
          ],
        },
      },
      meta: {
        on: {
          "close:wp:postmeta": {
            target: "item",
            actions: "closeMeta",
          },
          "*": [
            {
              target: "metaChild",
              cond: openCondition,
            },
          ],
        },
      },
      metaChild: {
        on: {
          text: { actions: "text" },
          "*": [
            {
              target: "meta",
              actions: "closeMetaChild",
              cond: closeCondition,
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      openAndCloseCategory: assign({
        currentItem: (context, event) => {
          const { domain, nicename } = event.node.attributes;
          return {
            ...context.currentItem,
            [domain]: [...(context.currentItem[domain] ?? []), nicename],
          };
        },
      }),
      closeItemChild: assign({
        currentText: "",
        currentItem: (context, event) => {
          return {
            ...context.currentItem,
            [event.nodeName]: context.currentText,
          };
        },
      }),
      closeItem: assign({
        currentText: "",
        currentItem: (context) => {
          writeItem(context.currentItem);
          return {};
        },
      }),
      closeMetaChild: assign({
        currentText: "",
        currentMeta: (context, event) => {
          return {
            ...context.currentMeta,
            [event.nodeName]: context.currentText,
          };
        },
      }),
      closeMeta: assign({
        currentText: "",
        currentItem: ({ currentItem, currentMeta }) => ({
          ...currentItem,
          [currentMeta["wp:meta_key"]]: currentMeta["wp:meta_value"],
        }),
        currentMeta: () => ({}),
      }),
      text: assign({
        currentText: (_, event) => {
          return event.text;
        },
      }),
    },
  }
);

const machineService = interpret(machine);
machineService.start();

const saxStream = sax.createStream(true);

saxStream.on("opentag", (node) => {
  machineService.send({ type: "open:" + node.name, node });
});

saxStream.on("closetag", (nodeName) => {
  machineService.send({ type: "close:" + nodeName, nodeName });
});

saxStream.on("text", (text) => {
  machineService.send({ type: "text", text });
});

saxStream.on("cdata", (text) => {
  machineService.send({ type: "text", text });
});

inputStream.pipe(saxStream);
