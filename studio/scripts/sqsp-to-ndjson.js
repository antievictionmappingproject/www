import fs from "fs";
import path from "path";
import sax from "sax";
import { createMachine, interpret, assign } from "xstate";
import slugify from "slugify";
import Schema from "@sanity/schema";
import sanityClient from "@sanity/client";
import blockTools from "@sanity/block-tools";
import postSchema from "../schemas/post.js";
import { JSDOM } from "jsdom";
import got from "got";
import PQueue from "p-queue";

const queue = new PQueue({
  concurrency: 10,
  interval: 1000 / 25,
});

let count = 0;

queue.on("active", () => {
  console.log(
    `Working on item #${++count}.  Size: ${queue.size}  Pending: ${
      queue.pending
    }`
  );
});

const client = sanityClient({
  projectId: "x8jn2l2i",
  dataset: "production",
  apiVersion: "2022-01-01",
  token:
    "skdZqX7xz6VLYl8ioLti1ej51GB7Y9g4QkP3HAy1xkzIWfD9LEARwDBH4ioOJMmTJiEzlUiXtHpZKbCXEA9AoRgryW1p3tRdLG1Vi9NdBEdVJjV4ObVbcZ86Y7HKVPGKNMkw601qVTdRwVoc5KYDWbOj4m6SAZ5eP9p9To7MKVYU3le9p3mA",
  useCdn: false,
});

const compiledSchema = Schema.default.compile({
  name: "default",
  types: [postSchema],
});

const inputStream = fs.createReadStream("./export.xml");
const outputStream = fs.createWriteStream("./dataset.ndjson");

function getAuthorId(item) {
  const name = item["dc:creator"]?.split("@")[0];
  return `author-${name}`;
}

function writeLine(data) {
  outputStream.write(JSON.stringify(data) + "\n");
}

function writePost(item) {
  writeLine({
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
}

async function writeAttachment(item) {
  console.log(item["wp:post_id"]);
  const url = item["wp:attachment_url"];
  if (url) {
    queue.add(async () => {
      try {
        await client.assets.upload("image", got.stream(url), {
          filename: path.basename(url),
        });
      } catch (error) {
        console.log(`Attachment ${item["wp:post_id"]}: ${error.message}`);
      }
    });
  }
}

function writePage() {}

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
          const item = context.currentItem;
          const _type = item["wp:post_type"];
          if (_type === "post") {
            writePost(item);
          } else if (_type === "attachment") {
            writeAttachment(item);
          } else if (_type === "page") {
            writePage(item);
          }
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

saxStream.on("end", () => {
  console.log("Done");
});

inputStream.pipe(saxStream);
