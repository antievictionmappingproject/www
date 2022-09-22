import adapter from '@sveltejs/adapter-netlify'
import preprocess from 'svelte-preprocess'

const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({split: true}),
    alias: {
      $i18n: 'src/i18n'
    }
  }
}

export default config
