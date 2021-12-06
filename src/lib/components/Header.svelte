<script>
  import { page } from "$app/stores";
</script>

<header>
  <form action="/{$page.params.locale}/search">
    <label>
      <span>Search:</span>
      <input type="text" name="query" />
    </label>
    <button type="submit">Submit</button>
  </form>
</header>
