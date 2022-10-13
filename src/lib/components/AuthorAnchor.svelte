<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'

  export let name: string
  export let slug: string
  export let tabindex: number | undefined = undefined
</script>

<a href={`/${$locale}/author/${slug}`} {tabindex}>{name}</a>
