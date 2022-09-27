<script>
  import {onMount} from 'svelte'
  import {LL} from '$i18n/i18n-svelte'

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
</script>

<select bind:value>
  <option value="light">{$LL.themeSelect.light()}</option>
  <option value="dark">{$LL.themeSelect.dark()}</option>
  <option value="system">{$LL.themeSelect.system()}</option>
</select>
