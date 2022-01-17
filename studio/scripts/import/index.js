import dotenv from "dotenv";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import sanityClient from "@sanity/client";
import PQueue from "p-queue";

dotenv.config();

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

let count = 0;

queue.on("active", () => {
  console.log(
    `Working on item #${++count}.  Size: ${queue.size}  Pending: ${
      queue.pending
    }`
  );
});

yargs(hideBin(process.argv))
  .command(
    "attachments [exportFile]",
    "import attachments from export file",
    (yargs) => {
      return yargs.positional("exportFile", {
        describe: "Squarespace XML file to import from",
      });
    },
    (argv) => {
      attachments.run({ ...argv, queue, client });
    }
  )
  .command(
    "posts [exportFile] [attachmentsFile]",
    "import posts from export file",
    (yargs) => {
      return yargs
        .positional("exportFile", {
          describe: "Squarespace XML file to import from",
        })
        .positional("attachmentsFile", {
          describe: "File to read attachment ids from",
        });
    },
    (argv) => {
      posts.run({ ...argv, queue, client });
    }
  );
