<script lang="ts">
  import {contextKey as localeContextKey} from '$lib/locale'
  import {getContext} from 'svelte'
  import SearchForm from './SearchForm.svelte'

  const locale = getContext(localeContextKey) as string
</script>

<header>
  <div class="row">
    <a href="/" class="title">
      The Anti-Eviction Mapping Project
    </a>
    <SearchForm {locale} />
  </div>
  <div class="nav-container">
    <nav>
      <a href="/about">About</a>
      <a href="/take-action">Take Action</a>
      <a href="/search">Our work</a>
      <a href="/resources">Resources</a>
      <a href="/reports">Reports & Writings</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>
</header>
<hr />

<style>
  .row {
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0 20rem;
    font-size: 0.8rem;
    background: var(--faded-background);
    width: 100%;
  }

  .title {
    color: var(--faded-text);
  }

  .nav-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  nav {
    text-transform: uppercase;
    font-size: 0.8rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: row;
    gap: 3rem;
    font-weight: bold;
  }
</style>
