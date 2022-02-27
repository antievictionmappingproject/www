<script>
  import { page } from "$app/stores";

  let value = "";
</script>

<header>
  <form action="/{$page.params.locale}/search">
    <label>
      <span>Search:</span>
      <input
        type="text"
        name="query"
        bind:value
        placeholder="Search"
        autocomplete="off"
      />
    </label>
    <button type="submit">Submit</button>
  </form>
</header>
