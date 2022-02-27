<script context="module">
  export const contextKey = Symbol();

  function* UniqueId(i = 0) {
    while (true) {
      yield i++;
    }
  }

  const idGen = UniqueId(0);
</script>

<script>
  import { setContext } from "svelte";

  export let id = idGen.next().value;

  let open = false;

  let classProp = undefined;
  export let style = undefined;
  export { classProp as class };

  setContext(contextKey, { id, open });
</script>

<div class={classProp} {style}>
  <slot />
</div>
