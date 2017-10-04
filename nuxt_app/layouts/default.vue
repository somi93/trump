<template>
  <v-app>

    <v-toolbar dark class="primary">
      <nuxt-link to="/" tag="span" style="cursor: pointer">
        <v-toolbar-title><h1>TRUMP NEWS FEED</h1></v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
    </v-toolbar>
  
    <main>
      <nuxt />
    </main>
  
    <footer id="footer" class="mb-1 pa-1 accent text-md-center white--text">
      <div class="mb-0"><b><a href="/" class="white--text">TRUMP NEWS FEED</a></b></div>
      <div class="mb-0 mt-0">All Rights Reserved© {{ new Date().getFullYear() }}</div>
      <div class="mb-0 mt-0"><a href="/general/Contact" class="white--text">Contact US</a> - <a href="/general/Terms"  class="white--text">Terms and Conditions</a> - <a href="/general/About"  class="white--text">About Us</a></div>
    </footer>
  
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
      }
    }
  }
</script>


<!-- Styles -->

<style>
  #footer {
    text-align: center;
  }

  .mySideDrawer {
    color: red;
  }

  h1 {
    font-size: 22px;
    font-weight: 400;
  }

</style>

<style lang="stylus">
  /*@import '../assets/style/app'*/
</style>