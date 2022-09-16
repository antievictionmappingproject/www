<script>
  import {onMount} from 'svelte'

  let value = 'system'
  let isMounted = false

  $: {
    if (isMounted) {
      console.log('update')
      localStorage.setItem('theme', value)
      document.documentElement.dataset.theme = value
    }
  }

  onMount(() => {
    console.log('mount')
    const theme = window.localStorage.getItem('theme')
    value = theme === 'string' ? theme : 'system'
    isMounted = true
  })
</script>

<select bind:value>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
  <option value="system">System</option>
</select>
