<template>
	<v-container>
		<v-layout row v-if='loading' id="loader">
			<v-flex xs12 class="text-md-center">
				<v-progress-circular indeterminate v-bind:size="110" v-bind:width="4" class="primary--text">Loading Article</v-progress-circular>
			</v-flex>
		</v-layout>
		<v-layout row>
			<v-flex xs12>
                    <adsense
                        ad-client="ca-pub-3558938080908087"
                        ad-slot="8130716944"
                        ad-style="display:block"
                        ad-format="auto">
                    </adsense>
			</v-flex>
		</v-layout>
        <v-layout>
            <v-flex md9>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card>
                            <v-card-title>
                                <h6 class="info--text">{{article.title}}</h6>
                            </v-card-title>
                            <v-card-media
                                    :src='article.imageUrl'
                                    height="400px"
                                    xs5 sm4 md4>
                            </v-card-media>
                            <v-card-text>
                                <div>{{article.description}}</div>
                            </v-card-text>
                            <v-card-actions>
                                <v-layout row wrap>
                                    <v-flex>
                                        <div class="info--text src-desc mt-2">
                                            {{article.source}}  -  {{article.publishedAt | filteredDate }}  -  {{article.author}}</div>
                                        <v-spacer></v-spacer>
                                    </v-flex>
                                    <v-flex>
                                        <a :href="article.articleUrl">
                                            <v-btn class="primary">Go To Full Article</v-btn>
                                        </a>
                                    </v-flex>
                                </v-layout>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex md3 class="hidden-md-and-down">
                    <adsense
                            ad-client="ca-pub-3558938080908087"
                            ad-slot="4659419370"
                            ad-style="display:inline-block;width:300px;height:600px"
                            ad-format="auto">
                    </adsense>
            </v-flex>
        </v-layout>

		<v-layout row wrap>
			<v-flex xs12>
				<v-card class="mt-3">
					<v-container>
						<h5 class="accent--text" style="border-bottom: 2px solid black;
						">Comments</h5>
						<div v-for="comment in article.comments" :key="comment._id" class="mb-2">
							<div class="ml-3 mb-0">
								<p class="mb-0 "><b>{{comment.username}}</b></p>
								<p class="mb-0 ml-4 comment">{{comment.comment}}</p>
								<p class="mb-0 ml-4 date">{{comment.date | filteredDate}}</p>
								<p class="reply info--text ml-4" @click='showReplyForm'>reply</p>
							</div>
							<div class="ml-5 mt-0" v-for="reply in comment.replies">
								<p class="mb-0"><b>{{reply.username}}</b></p>
								<p class="ml-4 mb-0 comment">{{reply.comment}}</p>
								<p class="ml-4 mb-0 date">{{reply.date | filteredDate}}</p>
							</div>
							<div v-show="reply">
								<form @submit.prevent="onAddReply($event)" class="ml-5" :id="comment._id">
									<v-layout row>
										<v-flex xs12 sm6>
											<v-text-field
											name="rep_name"
											label="Name"
											id="rep_name"
											v-model="rep_name"
											placeholder="Enter Your Name..."
											required>
										</v-text-field>
									</v-flex>
								</v-layout>
								<v-layout row>
									<v-flex xs12 sm6>
										<v-text-field
										name="rep_comment"
										label="Comment"
										id="rep_comment"
										v-model="rep_comment"
										placeholder="Add a Comment..."
										multi-line required>
									</v-text-field>
								</v-flex>
							</v-layout>
							<v-layout row>
								<v-flex xs12 sm6>
									<v-btn class="primary" :disabled="!replyFormIsValid" type="submit">Add Comment</v-btn>
								</v-flex>
							</v-layout>
						</form>
					</div>
				</div>
			</v-container>
			<v-container>
				<h5 class="accent--text" style="border-bottom: 2px solid black;
				">Add Comment</h5>
				<form @submit.prevent="onAddComment" class="ml-4">
					<v-layout row>
						<v-flex xs12 sm6>
							<v-text-field
							name="name"
							label="Name"
							id="name"
							v-model="name"
							placeholder="Enter Your Name..."
							required>
						</v-text-field>
					</v-flex>
				</v-layout>
				<v-layout row>
					<v-flex xs12 sm6>
						<v-text-field
						name="comment"
						label="Comment"
						id="comment"
						v-model="comment"
						placeholder="Add a Comment..."
						multi-line required>
					</v-text-field>
				</v-flex>
			</v-layout>
			<v-layout row>
				<v-flex xs12 sm6>
					<v-btn class="primary" id="butttton" :disabled="!commentFormIsValid" type="submit">Add Comment</v-btn>
				</v-flex>
			</v-layout>
		</form>
	</v-container>
</v-card>
</v-flex>
</v-layout>
</v-container>
</template>

<script>

	import axios from 'axios'

	export default {
		data() {
			return {
				article: {},
				loading: true,
				reply: false,

				name: '',
				comment: '',
				rep_name: '',
				rep_comment: '',
				commentId: '',
			}
		},

		asyncData({params, store}) {
			return axios.get(store.state.serverURL + '/get_articles/' + params.id).then(res => {
				return {
					article: res.data,
					loading: false
				}
			})
		},

		computed: {

			commentFormIsValid() {
				return (this.username !== '' && this.comment !== '')
			},

			replyFormIsValid() {
				return (this.rep_name !== '' && this.rep_comment !== '')
			},

			id() {
				return this.$route.params.id
			},

			pageTitle() {
				if (typeof this.article === 'object') {
					return this.article.title
				}
				return ''
			},

			serverURL() {
				return this.$store.state.serverURL
			}
 		},

		methods: {

			getArticle (id) {
				this.loading = true
				axios.get(this.serverURL + '/get_articles/' + id)
				.then(res => {
					this.article = res.data
					this.pageTitle = this.article.title
					this.loading = false
				})
			},

			showReplyForm(){
				this.reply = !this.reply;
			},
			onAddComment() {
				let comment = {
					id: this.id,
					username: this.name,
					comment: this.comment,
					date: new Date()
				}
				axios.put(this.serverURL + '/add_comment', comment)
				.then(data => {
					this.name=''
					this.comment=''
					this.getArticle(this.id)
				})
			},

			onAddReply(e){
				let reply = {
					articleId: this.id,
					commentId: e.target.id,
					username: this.rep_name,
					comment: this.rep_comment,
					date: new Date()
				}

				axios.put(this.serverURL + '/add_reply', reply)
				.then(data => {
					this.rep_name=''
					this.rep_comment=''
					this.reply = !this.reply
					this.getArticle(this.id)
				})
			}
		},


		head() {
			return {
				title: this.pageTitle,
			}
		},

		transition: 'page',
	}
</script>

<style>
	.src-desc{
		font-size: 11px;
	}
	
	.comment{
		font-size: 16px;
	}
	
	.date{
		font-size: 10px;
	}
	
	#loader{
		margin-top: 100px;
	}
	
	.reply:hover{
		text-decoration: underline;
		cursor: pointer;
	}

	.container {
		width: auto;
	}

	.page-enter-active, .page-leave-active {
		transition: all .25s ease-out;
	}
	.page-enter, .page-leave-active {
		opacity: 0;
		transform-origin: 50% 50%;
	}

</style>