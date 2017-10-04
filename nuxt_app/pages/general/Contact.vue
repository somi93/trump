<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs12><h1>Contact Us</h1></v-flex>
            <v-flex xs12>You can contact us at: contact@trumpnewsfeed.com</v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        data: function() {
            return {
                pageTitle: 'Contact Us - TrumpNewsFeed.com'
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