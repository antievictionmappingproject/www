<script lang="ts" context="module">
  interface Filter {
    type: string
    title: string
    slug: string
    checked: boolean
  }
</script>

<script lang="ts">
  import CheckboxInput from './CheckboxInput.svelte'
  import {locale} from '$i18n/i18n-svelte'

  export let title: string
  export let name: string
  export let filters: Filter[]
</script>

<fieldset>
  <div class="title">{title}</div>
  {#if filters.length > 0}
    <ul>
      {#each filters as filter}
        <li>
          <CheckboxInput
            name={filter.type}
            label={filter.title}
            value={filter.slug}
            checked={filter.checked}
          />
        </li>
      {/each}
    </ul>
  {/if}
  <a class="allLink" href={`/${$locale}/${name}`}
    >See all {name}</a
  >
</fieldset>

<style>
  .title {
    text-transform: uppercase;
    padding-block-end: var(--spacing-minus-1);
    border-block-end: var(--border-thin);
  }

  fieldset,
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-minus-1);
  }
</style>
