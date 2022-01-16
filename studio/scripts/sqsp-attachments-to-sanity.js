import dotenv from "dotenv";
dotenv.config();

import sanityClient from "@sanity/client";
import got from "got";
import PQueue from "p-queue";
import { eachItem } from "./sqsp.js";

const dry = process.argv.includes("--dry");

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
  projectId: process.env.SANITY_TOKEN,
  dataset: "production",
  apiVersion: "2022-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

eachItem((item) => {
  if (item["wp:post_type"] === "attachment") {
    const url = item["wp:attachment_url"];
    if (url) {
      queue.add(async () => {
        try {
          if (dry) {
            await client.assets.upload("image", got.stream(url), {
              filename: item.title,
            });
          }
        } catch (error) {
          console.log(`Attachment ${item["wp:post_id"]}: ${error.message}`);
        }
      });
    }
  }
}, process.stdin);
