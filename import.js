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
  },
  states: {
    inactive: { on: { startItem: "item" } },
    item: {
      on: {
        text: {
          target: "item",
          actions: assign({
            currentItem: (context, event) => ({
              ...context.currentItem,
              [event.key]: event.value,
            }),
          }),
        },
        endItem: {
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
  },
});

const service = interpret(machine);
service.start();

const parser = new SAXParser();
parser
  .on("start_element", (element) => {
    if (element.qName === "item") {
      service.send("startItem");
    }
  })
  .on("end_element", (element) => {
    if (element.qName === "item") {
      service.send("endItem");
    }
  })
  .on("text", (text, element) => {
    service.send({ type: "text", key: element.qName, value: text });
  });

const reader = await Deno.open(Deno.args[0]);
await parser.parse(reader);
reader.close();
