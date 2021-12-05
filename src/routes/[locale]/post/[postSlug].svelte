<script context="module">
  import groq from "groq";
  import { getClient } from "$lib/sanity";

  export async function load({ page, fetch }) {
    const post = await getClient(fetch).fetch(
      groq`
        *[_type == "post" && slug.current == $postSlug][0] {
          "title": title[$locale],
          "body": body[$locale]
        }
      `,
      page.params
    );
    return {
      props: {
        post,
      },
    };
  }
</script>

<script>
  import { page } from "$app/stores";
  import PortableText from "@portabletext/svelte";

  export let post;
</script>

<article>
  <a href="/{$page.params.locale}">Back</a>
  <h1>{post.title}</h1>
  {#if post.body}
    <PortableText blocks={post.body} />
  {/if}
</article>
