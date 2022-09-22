import adapter from '@sveltejs/adapter-netlify'
import preprocess from 'svelte-preprocess'
import path from 'path'

const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({split: true}),
    vite: {
      resolve: {
        alias: {
          $i18n: path.resolve('./src/i18n')
        }
      }
    }
  }
}

export default config
