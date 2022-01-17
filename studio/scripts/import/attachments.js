import fs from "fs/promises";
import got from "got";
import { eachItem } from "./sqsp.js";

export function run({ exportFile, attachmentsFile, queue, client }) {
  const ids = new Map();

  await eachItem(exportFile, (item) => {
    const {
      "wp:attachment_url": url,
      "wp:post_type": type,
      "wp:post_id": id,
    } = item;
    if (type === "attachment" && url) {
      queue.add(async () => {
        try {
          const document = await client.assets.upload(
            "image",
            got.stream(url),
            {
              filename: item.title,
            }
          );
          ids.set(id, document._id);
        } catch (error) {
          console.log(`Attachment ${id}: ${error.message}`);
        }
      });
    }
  });

  queue.on("idle", () => {
    fs.writeFile(attachmentsFile, JSON.stringify(Array.from(ids)));
  });

  queue.start();
}
