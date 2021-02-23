import { SAXParser } from "https://deno.land/x/xmlp/mod.ts";
import { Machine, interpret, assign } from "https://cdn.pika.dev/xstate";

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
              console.log(context.currentItem);
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
