<script context="module">
  import groq from "groq";
  import { getClient } from "$lib/sanity";

  export async function load({ params, fetch }) {
    const postStubs = await getClient(fetch).fetch(
      groq`
        *[_type == "post"] {
					_id,
          "title": title[$locale],
          "slug": slug.current
        }
      `,
      { locale: params.locale }
    );
    return {
      props: {
        postStubs,
      },
    };
  }
</script>

<script>
  import { page } from "$app/stores";
  export let postStubs;
</script>

<ol>
  {#each postStubs as { _id, title, slug } (_id)}
    <li>
      <a href="/{$page.params.locale}/post/{slug}">{title}</a>
    </li>
  {/each}
</ol>
