import ProgressBar from 'progress'

import { start } from './importer'

let bar

console.log('Import has been started. Press Crtl+C to stop import')

start(
  total => {
    bar = new ProgressBar(
      'Data importing from news.ycombinator.com [:bar] :current/:total',
      { width: 20, total }
    )
  },
  () => bar.tick()
)
