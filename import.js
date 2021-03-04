import { SAXParser } from "https://deno.land/x/xmlp/mod.ts";
import { Machine, interpret, assign } from "https://cdn.pika.dev/xstate";

await Deno.mkdir("pages", { recursive: true });
await Deno.mkdir("posts", { recursive: true });

function writeItem(item) {
  if (item["wp:post_type"] === "page") {
    const { "content:encoded": initialContent, link, ...data } = item;
    const frontmatter = JSON.stringify({
      layout: "layouts/page.liquid",
      ...data,
    });
    const content = initialContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(
        /<noscript\b[^<]*((?:(?!<\/noscript>)<[^<]*)*)<\/noscript>/gi,
        (_, p1) => p1
      );
    Deno.writeTextFile(
      `pages${link}.html`,
      `---json\n${frontmatter}\n---\n\n${content}`
    );
  } else if (item["wp:post_type"] === "post") {
    const { "content:encoded": initialContent, link, ...data } = item;
    const frontmatter = JSON.stringify({
      layout: "layouts/page.liquid",
      ...data,
    });
    if (initialContent) {
      const content = initialContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(
          /<noscript\b[^<]*((?:(?!<\/noscript>)<[^<]*)*)<\/noscript>/gi,
          (_, p1) => p1
        );
      const shortLink = link.match(/[\w-]*$/gi)[0];
      Deno.writeTextFile(
        `posts/${shortLink}.html`,
        `---json\n${frontmatter}\n---\n\n${content}`
      );
    }
  }
}

const machine = Machine({
  id: "xml",
  initial: "inactive",
  context: {
    currentItem: {},
    currentMeta: {},
  },
  states: {
    inactive: { on: { "start:item": "item" } },
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
            currentItem: (context) => {
              writeItem(context.currentItem);
              return {};
            },
          }),
        },
      },
    },
    "wp:postmeta": {
      on: {
        text: {
          target: "wp:postmeta",
          actions: assign({
            currentMeta: (context, event) => ({
              ...context.currentMeta,
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
