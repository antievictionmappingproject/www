<script lang="ts">
  import {page} from '$app/stores'

  let value = ''
  const placeholder = 'Search and filter by topic or location'
</script>

<header>
  <div class="row">
    <a href="/" class="title">
      The Anti-Eviction Mapping Project
    </a>
    <form action="/{$page.params.locale}/search">
      <div class="input-container">
        <!-- .hidden-placeholder is needed to force a 
        minimum width on .input-container 
      -->
        <div class="hidden-placeholder" aria-hidden>
          {placeholder}
        </div>
        <input
          type="text"
          name="query"
          bind:value
          {placeholder}
          autocomplete="off"
        />
      </div>
      <button type="submit">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_302_27)">
            <path
              d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
              fill="white"
            />
          </g>
        </svg>
      </button>
    </form>
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

  form {
    flex: 1;
    min-width: min-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.3rem 1.5rem;
    border: solid 1px var(--faded-text);
    border-radius: 2rem;
    font-size: 0.8rem;
  }

  .input-container {
    width: fit-content;
  }

  .hidden-placeholder {
    height: 0;
    visibility: hidden;
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

  input {
    width: 100%;
    background: var(--faded-background);
  }
</style>
