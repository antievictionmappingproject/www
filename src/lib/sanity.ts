import PicoSanity from 'picosanity'
import imageUrlBuilder from '@sanity/image-url'
import type {
  SanityClientLike,
  SanityProjectDetails,
  SanityImageSource,
  SanityImageDimensions
} from '@sanity/image-url/lib/types/types'

export const client = new PicoSanity({
  projectId: 'x8jn2l2i',
  dataset: 'production',
  apiVersion: '2022-09-01',
  useCdn: true
})

export interface SanityImageMetadata {
  lqip: string
  dimensions: SanityImageDimensions
}

export function imageProps({
  image,
  metadata,
  client,
  widths,
  quality = 80
}: {
  image: SanityImageSource
  client: SanityClientLike | SanityProjectDetails | undefined
  widths: number[]
  metadata?: SanityImageMetadata
  quality?: number
}) {
  const sortedWidths = Array.from(widths).sort()

  const builder = imageUrlBuilder(client)
    .image(image)
    .quality(quality)
    .auto('format')

  return {
    src: builder
      .width(sortedWidths.slice(-1)[0])
      .url() as string,
    srcset: sortedWidths
      .map(
        (width) => `${builder.width(width).url()} ${width}w`
      )
      .join(','),
    placeholderSrc: metadata?.lqip,
    naturalWidth: metadata?.dimensions?.width,
    naturalHeight: metadata?.dimensions?.height
  }
}
