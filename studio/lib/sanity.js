import PQueue from "p-queue";
import dotenv from "dotenv";
import sanityClient from "@sanity/client";
import Schema from "@sanity/schema";
import postSchema from "../schemas/post.js";

dotenv.config();

export function getClient() {
  const client = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: "production",
    apiVersion: "2022-01-01",
    token: process.env.SANITY_TOKEN,
    useCdn: false,
  });

  const queue = new PQueue({
    concurrency: 10,
    interval: 1000 / 25,
    autoStart: false,
  });

  return { client, queue };
}

export function getSchema() {
  return Schema.default.compile({
    name: "default",
    types: [postSchema],
  });
}
