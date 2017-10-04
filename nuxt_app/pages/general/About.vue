<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12><h1>About Us</h1></v-flex>
            <v-flex xs12>TrumpNewsFeed.com allows you to find all the news related to President Trump from over 70 News Sites on the Internet</v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: function() {
            return {
                pageTitle: 'About - TrumpNewsFeed.com'
            }
        },
        head() {
            return {
                title: this.pageTitle
            }
        }
    }
</script>

<style scoped="">

</style>