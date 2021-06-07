import { SAXParser } from "https://deno.land/x/xmlp/mod.ts";
import { Machine, interpret, assign } from "https://cdn.pika.dev/xstate";
import { slugify } from "https://deno.land/x/slugify/mod.ts";
import { createRequire } from "https://deno.land/std/node/module.ts";
import * as path from "https://deno.land/x/std/path/mod.ts";
import { download } from "https://deno.land/x/download/mod.ts";

const shouldDownload = false;
const imageDir = "/assets/uploads";
const outputDir = "posts/en";

const [inputFile] = Deno.args;

function cleanAttribute(attribute) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
}

const require = createRequire(import.meta.url);
const TurndownService = require("turndown");
const turndownService = new TurndownService();
turndownService
  .remove("style")
  .remove("script")
  .remove("noscript")
  .remove((node) => node.classList.contains("v6-visually-hidden"))
  .addRule("imageLoader", {
    filter: "img",
    replacement: (_, node) => {
      const alt = cleanAttribute(node.getAttribute("alt"));
      const url = node.getAttribute("data-src") || node.getAttribute("src");
      const file = url.match(/[^\/]*$/gm)[0];
      if (shouldDownload) {
        download(url, { file, dir: imageDir });
      }
      return `![${alt}](${path.join(imageDir, file)})`;
    },
  });

async function writePost(post) {
  const {
    "content:encoded": content,
    "wp:post_date": date,
    link,
    post_tag = [],
    category = [],
    title,
  } = post;
  if (!title || !content) return;
  const slug = slugify(link.match(/[^\/]*$/g)[0]);
  const frontmatter = JSON.stringify({
    tags: [...post_tag, ...category],
    date: date.split(" ").join("T"),
    title,
  });
  const text = `---json\n${frontmatter}\n---\n\n${turndownService
    .turndown(content)
    .replaceAll("&nbsp;", " ")}`;
  await Deno.writeTextFile(path.resolve(outputDir, `${slug}.md`), text);
}

const machine = Machine({
  id: "xml",
  initial: "inactive",
  context: {
    items: [],
    currentItem: {},
    currentMeta: {},
  },
  states: {
    inactive: {
      on: {
        "start:item": "item",
        "end:channel": {
          actions: ({ items }) => {
            const posts = items.filter(
              (item) => item["wp:post_type"] === "post"
            );
            for (let post of posts) {
              if (post.passthrough_url) {
                const url = new URL(
                  post.passthrough_url,
                  "https://www.antievictionmap.com"
                );
                if (
                  url.hostname === "www.antievictionmap.com" ||
                  url.hostname === "antievictionmap.com"
                ) {
                  const page = items.find(
                    (item) =>
                      item["wp:post_type"] === "page" &&
                      slugify(item.link) === slugify(url.pathname)
                  );
                  if (page) {
                    Object.assign(post, {
                      "content:encoded": page["content:encoded"],
                    });
                  }
                }
              }
              writePost(post);
            }
          },
        },
      },
    },
    item: {
      on: {
        "start:wp:postmeta": "wp:postmeta",
        text: {
          target: "item",
          actions: assign({
            currentItem: (context, event) => {
              if (event.element.qName === "category") {
                const key = event.element.attributes.find(
                  ({ qName }) => qName === "domain"
                )?.value;
                if (key) {
                  return {
                    ...context.currentItem,
                    [key]: [...(context.currentItem[key] ?? []), event.text],
                  };
                } else {
                  return context.currentItem;
                }
              } else {
                return {
                  ...context.currentItem,
                  [event.element.qName]: event.text,
                };
              }
            },
          }),
        },
        "end:item": {
          target: "inactive",
          actions: assign({
            items: ({ items, currentItem }) => {
              return [...items, currentItem];
            },
            currentItem: () => ({}),
          }),
        },
      },
    },
    "wp:postmeta": {
      on: {
        text: {
          target: "wp:postmeta",
          actions: assign({
            currentMeta: ({ currentMeta }, event) => ({
              ...currentMeta,
              [event.element.qName]: event.text,
            }),
          }),
        },
        "end:wp:postmeta": {
          target: "item",
          actions: assign({
            currentItem: ({ currentItem, currentMeta }) => ({
              ...currentItem,
              [currentMeta["wp:meta_key"]]: currentMeta["wp:meta_value"],
            }),
            currentMeta: () => ({}),
          }),
        },
      },
    },
  },
});

const service = interpret(machine);
service.start();

const parser = new SAXParser();
parser
  .on("start_element", (element) => {
    service.send({ type: "start:" + element.qName, element });
  })
  .on("end_element", (element) => {
    service.send({ type: "end:" + element.qName, element });
  })
  .on("text", (text, element) => {
    service.send({ type: "text", element, text });
  });

const reader = await Deno.open(inputFile);
await parser.parse(reader);
reader.close();
