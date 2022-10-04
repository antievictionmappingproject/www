<script>
  import {onMount} from 'svelte'
  import {LL} from '$i18n/i18n-svelte'
  import Select from './Select.svelte'

  let value = 'system'
  let isMounted = false

  $: {
    if (isMounted) {
      localStorage.setItem('theme', value)
      document.documentElement.dataset.theme = value
    }
  }

  onMount(() => {
    value = localStorage.getItem('theme') ?? 'system'
    isMounted = true
  })

  $: options = [
    {value: 'light', label: $LL.themeSelect.light()},
    {value: 'dark', label: $LL.themeSelect.dark()},
    {value: 'system', label: $LL.themeSelect.system()}
  ]
</script>

<Select label={$LL.themeSelect.label()} bind:value {options} />
