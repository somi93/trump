module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'TRUMP NEWS FEED',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'Trump News Feed' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script: [
      { async: true, src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', ssr: false }
    ],
  },

  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/adsense.js',
    '~/plugins/filters.js',
    { src: '~plugins/ga.js', ssr: false },
  ],

  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'yellow' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['vuetify', 'lodash', 'axios'],
    extractCSS: true,
  },

  srcDir: 'nuxt_app/',
  
  env: {
    baseURL: (process.env.NODE_ENV === 'production' ? 'https://trumpnewsfeed.com' : 'http://localhost:3030')
  },

}