<script>
  import {locale, LL} from '$i18n/i18n-svelte'
  import LocaleSelect from './LocaleSelect.svelte'
  import ThemeSelect from './ThemeSelect.svelte'

  $: year = new Intl.DateTimeFormat($locale, {
    year: 'numeric'
  }).format(new Date())
</script>

<footer>
  <LocaleSelect />
  <ThemeSelect />
  <div class="copyright">
    © {year}
    {$LL.siteTitle()}
  </div>
</footer>

<style>
  footer {
    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: yellow;
  }
</style>
