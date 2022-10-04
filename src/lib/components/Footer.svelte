<script>
  import {locale, LL} from '$i18n/i18n-svelte'
  import classes from '$lib/text.module.css'
  import LocaleSelect from './LocaleSelect.svelte'
  import ThemeSelect from './ThemeSelect.svelte'

  $: year = new Intl.DateTimeFormat($locale, {
    year: 'numeric'
  }).format(new Date())
</script>

<footer>
  <div class="description">
    <p class={classes.titleSans}>
      {$LL.siteTitle()}
    </p>
    <p class={classes.subtitle}>
      AEMP is a data-visualization, critical cartography, and
      multimedia storytelling collective documenting
      dispossession and resistance upon gentrifying landscapes.
    </p>
  </div>
  <div class="bottom">
    <LocaleSelect />
    <ThemeSelect />
    <div class="copyright">
      © {year}
      {$LL.siteTitle()}
    </div>
  </div>
</footer>

<style>
  footer {
    padding: var(--spacing-0);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-2);
  }

  .description {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-0);
  }

  .bottom {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
  }

  .copyright {
    margin-inline-start: auto;
    font-size: var(--font-size-minus-1);
  }
</style>
