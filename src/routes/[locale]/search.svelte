<script context="module">
  import groq from "groq";
  import { getClient } from "$lib/sanity";

  export async function load({ params, url, fetch }) {
    const postStubs = await getClient(fetch).fetch(
      groq`
        *[_type == "post"]
        | score(title[$locale] match $search)
        | order(_score desc)
        [_score != 0][0...10] {
					_id,
          "title": title[$locale],
          "slug": slug.current
        }
      `,
      { locale: params.locale, search: url.searchParams.get("query") }
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
