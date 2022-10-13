<script lang="ts">
  import {locale} from '$i18n/i18n-svelte'

  export let type: string
  export let title: string
  export let slug: string
  export let tabindex: number | undefined = undefined
</script>

<a href={`/${$locale}/search?${type}=${slug}`} {tabindex}
  >{title}</a
>
