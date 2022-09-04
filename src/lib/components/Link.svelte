<script lang="ts">
  // PortableText, _incredibly annoyingly_, does not actually render
  // many common elements, we have to provide those ourselves
  import type {MarkComponentProps} from '@portabletext/svelte'

  export let portableText: MarkComponentProps
  $: ({value, plainTextContent} = portableText)
</script>

<a href={value.href}>{plainTextContent}</a>

<style>
  a {
    text-decoration: underline;
  }
</style>
