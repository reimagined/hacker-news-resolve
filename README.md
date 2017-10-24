# hacker-news-resolve &middot; [![Build Status](https://travis-ci.org/reimagined/hacker-news-resolve.svg?branch=master)](https://travis-ci.org/reimagined/hacker-news-resolve) [![Coverage Status](https://coveralls.io/repos/github/reimagined/hacker-news-resolve/badge.svg?branch=master)](https://coveralls.io/github/reimagined/hacker-news-resolve?branch=master)
A React & Redux & Resolve implementation of Hacker News 

[<img src="https://cdn.worldvectorlogo.com/logos/react.svg" height="110">](https://github.com/facebook/react)
[<img src="https://raw.githubusercontent.com/reactjs/redux/master/logo/logo.png" height="100">](https://github.com/reactjs/redux)
[<img src="https://avatars2.githubusercontent.com/u/27729046" height="100">](https://github.com/reimagined/resolve/)

# Get Started

``` bash
git clone https://github.com/reimagined/hacker-news-resolve.git
cd hacker-news-resolve
npm install
npm run import
npm run dev
``` 
or
``` bash
npm run build
npm run start
```
Access localhost:3000 then you can see the front page of Hacker News.

| `npm run <script>` | Description |
| ------------------ | ----------- |
|`build`             | Builds the application to ./dist |
|`dev`               | Serves your app at `localhost:3000` in development mode|
|`start`             | Serves your app at `localhost:3000` in production mode |
|`import`            | Imports data from [Original Hacker News](https://news.ycombinator.com/) |
|`test`              | Runs unit tests with Jest |
|`test:watch`        | Runs `test` in watch mode to re-run tests when changed |
|`prettier`          | Lints the project and fixes all correctable errors |
