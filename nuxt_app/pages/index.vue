<template>
	<v-container fluid>
		<v-layout row>
			<v-flex xs12>
				<adsense
						ad-client="ca-pub-3558938080908087"
						ad-slot="8130716944"
						ad-style="display:block"
						ad-format="auto">
				</adsense>
				<!-- Go to www.addthis.com/dashboard to customize your tools -->
				<!-- <div class="addthis_inline_share_toolbox" data-url="" data-title="a" data-description="Trump News Feed"></div> -->

			</v-flex>
		</v-layout>


		<v-layout row wrap>
			<v-flex xs12 md3>
				<div class="sources">
					<v-card class="elevation-0">
						<v-card-title class="primary theme--dark white--text">
							<v-layout row wrap>
								<v-flex xs12>
									<span class="headline">Sources(s)</span>
								</v-flex>
								<v-flex xs12>
									<v-select
											label="Apply Filter"
											v-bind:items="sources"
											v-model="filteredSources"
											multiple
											dark
											chips
											max-height="400"
											hint="Pick your trusted sources"
											autocomplete
									></v-select>
								</v-flex>
							</v-layout>
							<v-btn small primary dark @click="clearFiltered" v-if="filteredSources.length >= 1" style="float: right;">Clear Sources</v-btn>
						</v-card-title>
					</v-card>
				</div>
				<div class="hidden-md-and-up">
					<!--<adsense-->
							<!--ad-client="ca-pub-3558938080908087"-->
							<!--ad-slot="8130716944"-->
							<!--ad-style="display:block"-->
							<!--ad-format="auto">-->
					<!--</adsense>-->
				</div>
			</v-flex>

			<v-flex xs12 md9>

				<v-layout row v-if='loading' id="loader">
					<v-flex lg8 xs12 class="text-md-center">
						<v-progress-circular indeterminate v-bind:size="110" v-bind:width="4" class="primary--text">Loading Articles</v-progress-circular>
					</v-flex>
				</v-layout>
			<v-container>
				<v-layout row wrap>
					<v-flex lg8>
						<v-card class="mb-3" v-for="(article, index) in myArticles" :key="article._id">
							<v-layout row wrap>
								<v-flex xs12 md4>
									<v-card-media class="mt-1 ml-1">
										<img :src="article.imageUrl" class="featureImg">
									</v-card-media>
								</v-flex>
								<v-flex xs12 md8>
									<v-card-title primary-title>
										<div>
											<h5 class="info--text mb-0">{{article.title}}</h5>

											<p>{{article.description}}</p>
											<!--<p v-if="!article.trancated">{{article.description | trancateText}}</p>-->
											<!--<p v-else>{{article.description}}</p>-->

											<div class="src-desc">{{article.source}} - {{article.publishedAt | filteredDate}} - {{article.author}}</div>
										</div>
									</v-card-title>
								</v-flex>
							</v-layout>
							<v-layout row>
								<v-flex xs12 sm12>


									<v-btn class="primary white--text btn" :to="'/articles/' + article._id">Comments ({{article.comments.length}})</v-btn>

									<!--<v-btn -->
									<!--class="primary white&#45;&#45;text btn" -->
									<!--@click="article.trancated = !article.trancated">-->
									<!--Full Description</v-btn>-->

									<a :href="article.articleUrl" target="_blank" rel="nofollow">
										<v-btn class="primary white--text btn">Read Article</v-btn>
									</a>
								</v-flex>
							</v-layout>
						</v-card>
					</v-flex>
					<v-flex lg4 class="hidden-md-and-down">
						<adsense
								ad-client="ca-pub-3558938080908087"
								ad-slot="4659419370"
								ad-style="display:inline-block;width:300px;height:600px"
								ad-format="auto">
						</adsense>
						<br>
						<adsense
								ad-client="ca-pub-3558938080908087"
								ad-slot="4659419370"
								ad-style="display:inline-block;width:300px;height:600px"
								ad-format="auto">
						</adsense>
					</v-flex>
				</v-layout>
			</v-container>

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

		    clearFiltered() {
                this.filteredSources = [];
			},
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
			//this.loadMore(1)
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
	.sources {
		margin-top: 5px;
	}

	.btn {
		border-radius: 20px;
		font-weight: normal;
		font-size: 12px;
		line-height: 17px;
	}
	.src-desc {
		font-size: 13px;
	}
	
	#loader {
		margin-top: 80px;
	}

</style>
