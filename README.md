# TRUMP NEWS FEED (SSR with Nuxt)

## Setup

This site was built and tested with node `v7.9.0`

``` bash
# install dependencies
$ npm install
```
Open `nuxt.config.js` and edit `env.baseURL` to match your backend urls for dev and production modes.

## Development mode

``` bash
# First run the backend in dev mode
$ npm run dev

# In another terminal, run nuxt in dev mode
$ npn run nuxt
```

--------- Known Issues --------------

In Dev Mode, Adsense causes an error in Chrome browsers (due to responsive issue). Doesn't occur in production mode.

In dev mode, clicking on the side bar before the page has full rendered causes crash.



## Production mode

``` bash
# First build the app for production
$ npm run build

# Run the server
$ npn start
```
