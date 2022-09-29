<script lang="ts">
  import type {SanityImageMetadata} from '$lib/sanity'
  import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
  import SanityPicture from './SanityPicture.svelte'

  interface PostStub {
    image: SanityImageSource & {metadata: SanityImageMetadata}
    title: string
  }

  export let posts: PostStub[]
</script>

<section>
  {#each posts as post}
    <div class="post">
      <SanityPicture
        image={post.image}
        metadata={post.image.metadata}
        alt="Picture"
      />
      <div>{post.title}</div>
    </div>
  {/each}
</section>

<style>
  section {
    display: flex;
  }

  .post {
    display: flex;
    flex-direction: column;
  }
</style>
