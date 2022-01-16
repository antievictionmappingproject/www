import sax from "sax";
import { createMachine, interpret, assign } from "xstate";

function openCondition(_, event) {
  return event.type.startsWith("open:");
}

function closeCondition(_, event) {
  return event.type.startsWith("close:");
}

export function eachItem(fn, input) {
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
            fn(context.currentItem);
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
    // Done
  });

  input.pipe(saxStream);
}

export function getAuthorId(item) {
  const name = item["dc:creator"]?.split("@")[0];
  return `author-${name}`;
}
