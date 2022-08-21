<script>
  export let columns = [],
    rows = [],
    caption = undefined;
</script>

<table>
  {#if caption}
    <caption>
      {caption}
    </caption>
  {/if}
  <thead>
    <tr>
      {#each columns as { title }}
        <th>{title}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        {#each columns as { key }}
          <td>
            {row[key]}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
