const fs = require("fs");
const sax = require("sax");
const { createMachine, interpret, assign } = require("xstate");
// const slugify = require("slugify");

const inputStream = fs.createReadStream("./export.xml");
const outputStream = fs.createWriteStream("./dataset.ndjson");

const writeLine = (data) => {
  outputStream.write(data + "\n");
};

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
              cond: closeCondition,
            },
          ],
        },
      },
    },
  },
  {
    actions: {
      closeItemChild: assign({
        currentText: "",
        currentItem: (context, event) => {
          // if (event.node.name === "category") {
          //   const key = event.node.attributes.find(
          //     ({ name }) => name === "domain"
          //   )?.value;
          //   if (key) {
          //     return {
          //       ...context.currentItem,
          //       [key]: [...(context.currentItem[key] ?? []), context.currentText],
          //     };
          //   } else {
          //     return context.currentItem;
          //   }
          // } else {
          return {
            ...context.currentItem,
            [event.nodeName]: context.currentText,
          };
          // };
        },
      }),
      closeItem: assign({
        currentText: "",
        currentItem: (context) => {
          writeLine(JSON.stringify(context.currentItem));
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
