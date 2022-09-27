import fs from 'fs'
import fsp from 'fs/promises'
import got from 'got'
import {getClient} from '../lib/sanity.js'
import {eachItem} from '../lib/sqsp.js'

const exportFile = new URL(
  '../tmp/export.xml',
  import.meta.url
)
const attachmentsFile = new URL(
  '../tmp/attachments.json',
  import.meta.url
)

const {client, queue} = getClient()

async function run() {
  const ids = new Map()

  await eachItem(fs.createReadStream(exportFile), (item) => {
    const {
      'wp:attachment_url': url,
      'wp:post_type': type,
      'wp:post_id': id
    } = item
    if (type === 'attachment' && url) {
      queue.add(async () => {
        console.log(`Attachment ${id}: Started`)
        try {
          const readStream = got
            .stream(url, {timeout: {request: 10000}})
            .on('error', () => {
              readStream.destroy(
                `Attachment ${id}: Failed to get`
              )
            })
          const document = await client.assets.upload(
            'image',
            readStream,
            {
              filename: item.title
            }
          )
          ids.set(id, document._id)
        } catch (error) {
          console.log(`Attachment ${id}: ${error.message}`)
        } finally {
          console.log(`Attachment ${id}: Completed`)
        }
      })
    }
  })

  queue.on('idle', () => {
    console.log('Idle')
    fsp.writeFile(
      attachmentsFile,
      JSON.stringify(Array.from(ids))
    )
  })

  queue.start()
}

run()
