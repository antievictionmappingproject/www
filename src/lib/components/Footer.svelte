<script>
  import classes from '$lib/text.module.css'
  import LocaleSelect from './LocaleSelect.svelte'
  import ThemeSelect from './ThemeSelect.svelte'
</script>

<footer>
  <div class="description">
    <p class={classes.titleSans}>
      The Anti-Eviction Mapping Project
    </p>
    <p class={classes.subtitle}>
      AEMP is a data-visualization, critical cartography, and
      multimedia storytelling collective documenting
      dispossession and resistance upon gentrifying landscapes.
    </p>
  </div>
  <nav>
    <LocaleSelect />
    <ThemeSelect />
  </nav>
</footer>

<style>
  footer {
    padding: var(--spacing-0);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-0);
  }

  .description {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-0);
  }

  nav {
    display: flex;
    gap: var(--spacing-2);
  }
</style>
