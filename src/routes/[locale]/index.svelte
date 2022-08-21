<script context="module">
  import groq from "groq";
  import { getClient } from "$lib/sanity";

  export async function load({ params, fetch }) {
    const postStubs = await getClient(fetch).fetch(
      groq`
        *[_type == "post"] {
					_id,
          "author": author->name,
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
  import PostTable from "$lib/components/PostTable.svelte";
  export let postStubs;
</script>

<PostTable
  columns={[
    { key: "title", title: "Title" },
    { key: "author", title: "Author" },
  ]}
  rows={postStubs}
/>
