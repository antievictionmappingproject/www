<script>
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import { replaceLocale } from "$lib/url";

  const locales = [
    { code: "es", label: "Español" },
    { code: "en", label: "English" },
  ];
</script>

<svelte:head>
  {#each locales as { code }}
    <link
      rel="alternate"
      hreflang={code}
      href={replaceLocale($page.path, code)}
    />
  {/each}
</svelte:head>

<Header />
<main>
  <slot />
</main>

<ul>
  {#each locales as { code, label }}
    <li>
      <a
        disabled={code === $page.params.locale}
        href={replaceLocale($page.path, code)}>{label}</a
      >
    </li>
  {/each}
</ul>
