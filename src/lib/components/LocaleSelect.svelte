<script lang="ts">
  import {page} from '$app/stores'
  import {goto} from '$app/navigation'
  import {LL, locale} from '$i18n/i18n-svelte'
  import Select from './Select.svelte'
  import {replaceLocale} from '$lib/url'

  $: value = $locale

  $: {
    if (value !== $locale) {
      goto(replaceLocale($page.url.pathname, value))
    }
  }

  $: options = [
    {value: 'en', label: 'English'},
    {value: 'es', label: 'Español'}
  ]
</script>

<Select
  label={$LL.localeSelect.label()}
  {options}
  bind:value
/>
