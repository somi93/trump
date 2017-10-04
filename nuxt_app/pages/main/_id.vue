<template>
	<v-container>
		<v-layout row wrap>
			<v-flex xs12 sm3>
				<div class="sources">
					<h5>Sources:</h5>
					<v-card class="elevation-0">
						<v-card-text>
							<v-flex xs12>
								<v-select
								label="Apply Filter"
								v-bind:items="sources"
								v-model="filteredSources"
								multiple
								max-height="400"
								hint="Pick your trusted sources"
								persistent-hint
								></v-select>
							</v-flex>
						</v-card-text>
					</v-card>
				</div>
			</v-flex>

			<v-flex xs12 sm9>
				<v-layout row>
					<v-flex xs12>
						<adsense
						ad-client="ca-pub-3558938080908087"
						ad-slot="8457996952"
						ad-style="display:inline-block;width:728px;height:90px"
						ad-format="auto">
						</adsense>
						<!-- Go to www.addthis.com/dashboard to customize your tools -->
						<!-- <div class="addthis_inline_share_toolbox" data-url="" data-title="a" data-description="Trump News Feed"></div> -->

					</v-flex>
				</v-layout>
			<v-layout row v-if='loading' id="loader">
				<v-flex xs12 class="text-md-center">
					<v-progress-circular indeterminate v-bind:size="110" v-bind:width="4" class="primary--text">Loading Articles</v-progress-circular>
				</v-flex>
			</v-layout>
			<v-card class="mb-3" v-for="(article, index) in myArticles" :key="article._id">
				<v-layout row-sm column child-flex-sm>
					<v-flex>
						<v-card-media class="mt-1 ml-1">
							<img :src="article.imageUrl">
						</v-card-media>
					</v-flex>
					<v-flex>
						<v-card-title primary-title>
							<div>
								<h5 class="info--text mb-0">{{article.title}}</h5>

								<p v-if="!article.trancated">{{article.description | trancateText}}</p>
								<p v-else>{{article.description}}</p>

								<div class="src-desc">{{article.source}} - {{article.publishedAt | filteredDate}} - {{article.author}}</div>
							</div>
						</v-card-title>
					</v-flex>
				</v-layout>
				<v-layout row>
					<v-flex xs12 sm12>
						
						<v-btn class="primary white--text btn" :to="'/articles/' + article.id">Share</v-btn>

						<v-btn class="primary white--text btn" :to="'/articles/' + article._id">Comments ({{article.comments.length}})</v-btn>
						
						<v-btn 
						class="primary white--text btn" 
						@click="article.trancated = !article.trancated">
						Full Description</v-btn>

						<a :href="article.articleUrl" target="_blank">
							<v-btn class="primary white--text btn">Read Article</v-btn>
						</a>
						</v-flex>
					</v-layout>
				</v-card>
				<v-card>
					<v-card-text @click='loadMore()'><v-btn flat>Load More...</v-btn><v-progress-circular v-if="loading" indeterminate v-bind:size="20" v-bind:width="2" class="primary--text"></v-progress-circular></v-card-text>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>

</template>

<script>

	import axios from 'axios'
	import _ from 'lodash'

	export default {
		data() {
			return {
				loading: false,

				articles: [],
				sources: [],
				filteredSources: [],

				currentPage: 2,
				currentFilteredPage: 1,
			}
		},

		async asyncData({params, store}) {

			const sortArticles = articles => {
				return articles.sort(function(a, b) {
					return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
				})
			}

			let {data} = await axios.get(store.state.serverURL + '/get_articles')

			var newArticles = data;
			newArticles = newArticles.map(function(el) {
				var o = Object.assign({}, el);
				o.trancated = false;
				return o;
			})

			return {
				articles: sortArticles(newArticles),
				pageTitle: 'Trump News Feed - Latest Trump News From 70+ Sources',
			}
		},


		computed: {
			myArticles() {

				let articles = []
				let e = this.filteredSources

				if (e.length > 0) {
					articles = this.articles.filter(function(a) {
						let valid = false
						if (a.source) {
							valid = e.includes(a.source)
						}
						return valid
					})
				}

				else {
					articles = this.articles
				}

				articles = this.sortArticles(articles)

				return articles
			},

			serverURL() {
				return this.$store.state.serverURL
			},
		},

		watch: {
			filteredSources(newSources, oldSources) {
				if (newSources.length > oldSources.length) {
					this.currentFilteredPage = 1
					this.loadMore(1)
				}
			}
		},

		methods: {

			loadMore(page = 0) {

				this.loading = true

				let requestPage = !page ? this.currentPage : page

				return axios.get(this.serverURL + '/get_articles', {
					params: {
						source: this.filteredSources,
						page: requestPage
					}
				})
				.then(res => {

					if (Array.isArray(res.data)) {

						if (!_.isEmpty(this.filteredSources)) {
							this.currentFilteredPage += 1
						}
						else {
							this.currentPage += 1
						}

						let newArticles = res.data || []

						newArticles = newArticles.map(function(el) {
							var o = Object.assign({}, el);
							o.trancated = false;
							return o;
						})
						
						let merged = _.concat(this.articles, newArticles)
						merged = _.uniqBy(merged, '_id')
						this.articles = merged

					}
					this.loading = false
				})
				.catch(error => {
					console.error('Could not fetch more articles..')
					this.loading = false
				})
			},

			showMore(index) {
				this.$set(this.trancated, index, true)
			},

			sortArticles (articles) {
				return articles.sort(function(a, b) {
					return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
				})
			},

			getSources() {
				axios.get(this.serverURL + '/sources').then(res => {
					this.sources = res.data
				})
			},

		},

		mounted() {
			this.getSources()
		},

		/*
			Use this to access head tag
		 */
		head() {
			return {
				title: this.pageTitle,
			}
		}
	}
</script>


<style>

	.btn {
		border-radius: 20px;
		font-weight: normal;
		font-size: 12px;
		line-height: 17px;
	}

	.src-desc {
		font-size: 10px;
	}
	
	#loader {
		margin-top: 80px;
	}

</style>
