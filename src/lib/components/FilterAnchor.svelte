<script lang="ts" context="module">
  import groq from 'groq'

  export const query = groq`{
    "type": _type,
    "title": title[$locale],
    "slug": slug.current
  }`
</script>

<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'

  export let type: string
  export let title: string
  export let slug: string
</script>

<a href={`/${$locale}/${type}/${slug}`}>{title}</a>
