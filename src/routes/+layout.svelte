<script lang="ts">
  import '@nonphoto/css/reset.css'
  import '$lib/global.css'
  import {setLocale} from '$i18n/i18n-svelte'
  import type {LayoutData} from './$types'

  export let data: LayoutData

  setLocale(data.locale)
</script>

<slot />
