<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'

  export let name: string
  export let slug: string
</script>

<a href={`/${$locale}/author/${slug}`}>{name}</a>
