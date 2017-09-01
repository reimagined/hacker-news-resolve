import ProgressBar from 'progress';

import { start, stop } from './importer';

let bar;
start(
  total => {
    bar = new ProgressBar(
      'Import stories from news.ycombinator.com [:bar] :current/:total',
      { width: 20, total }
    );
  },
  () => bar.tick()
);
