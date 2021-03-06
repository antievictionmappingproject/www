import { SAXParser } from "https://deno.land/x/xmlp/mod.ts";
import { Machine, interpret, assign } from "https://cdn.pika.dev/xstate";
import { slugify } from "https://deno.land/x/slugify/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

await Deno.mkdir("pages", { recursive: true });

async function writePost(post) {
  const { "content:encoded": content = "", link, ...data } = post;
  const slug = slugify(link.match(/[^\/]*$/g)[0]);
  const frontmatter = JSON.stringify({
    layout: "layouts/page.njk",
    ...data,
  });
  const document = new DOMParser().parseFromString(
    content.replaceAll("&nbsp;", ""),
    "text/html"
  );
  document.querySelectorAll("script").forEach((node) => void node.remove());
  document.querySelectorAll("style").forEach((node) => void node.remove());
  document.querySelectorAll("noscript").forEach((node) => {
    const child = document.createElement("div");
    child.innerHTML = node.textContent;
    node.parentElement.replaceChild(child, node);
  });
  [
    ...document.querySelectorAll("p"),
    ...document.querySelectorAll("span"),
    ...document.querySelectorAll("blockquote"),
  ].forEach((node) => {
    if (node.textContent.trim() === "") {
      node.remove();
    }
  });
  document.querySelectorAll("[style]").forEach((node) => {
    node.removeAttribute("style");
  });
  document.querySelectorAll("[data-html]").forEach((node) => {
    node.innerHTML = node.getAttribute("data-html");
    node.removeAttribute("data-html");
  });
  return Deno.writeTextFile(
    `pages/${slug}.html`,
    `---json\n${frontmatter}\n---\n\n${document.body.innerHTML}`
  );
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
                const url = new URL(post.passthrough_url);
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

const reader = await Deno.open(Deno.args[0]);
await parser.parse(reader);
reader.close();