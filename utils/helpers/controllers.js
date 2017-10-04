
const ArticleModel = require('../../models/article');

let Controllers = {

	saveArticle: function (options, cb) {

		let title = options.title;
		let description = options.description;
		let author = options.author;
		let publishedAt = options.publishedAt;
		let imageUrl = options.urlToImage;
		let source = options.source;
		let source_id = options.source_id;
		let articleUrl = options.url;

		let Options = {
			title: title,
			description: description,
			author: author,
			publishedAt: publishedAt,
			imageUrl: imageUrl,
			source: source,
			source_id: source_id,
			articleUrl: articleUrl
		};

		let article = new ArticleModel(Options);	

		ArticleModel.find({articleUrl : Options.articleUrl}, function (err, docs) {
			if (docs.length){
				return cb('Article exists already',null);
			}else{
				article.save(function (err, article) {
					if (err) return cb(err);
					return cb(null, article);

				})
			}
		});
	},

	getArticle: function (options, cb) {

		var articleId = options.id;

		if (articleId == undefined) {
			var err = new Error("Article Not Found");
			return cb(err);
		}

		var Options = { _id: articleId };

		ArticleModel.find(Options, function (err, article) {
			if (err || !article || !article.length) {
				err = err || new Error("Article No Longer Available");
				return cb(err);
			}
			article = article[0];
			return cb(null, article);
		});
	},

	getArticles: function (req, options, cb) {

		var query = {};
		if (options.source) {
			query.source = options.source
		}

		var paginateOptions = {
			sort: {
				publishedAt: -1,
			},
			limit: 10,
			page: options.page,
		};

		ArticleModel.paginate(query, paginateOptions)
		.then(result => {
			var articles = result.docs
			if (!Array.isArray(articles)) {
				var err = new Error("Ooops somthing went wrong, couldn't fetch articles");
				return cb(err);
			}
			return cb(null, articles);
		})
		.catch(err => {
			err = err || new Error("Ooops somthing went wrong, couldn't fetch articles");
			return cb(err);
		})
	},


	getSources: function(req, options, cb) {
		ArticleModel.find({})
		.distinct('source')
		.exec((err, sources) => {
			return cb(null, sources);
		})
	},


	addComment: function(req, options, cb) {
		let articleId = options.id;
		
		let comment = {
			username: options.username,
			comment: options.comment,
			date: options.date
		}

		ArticleModel.update({'_id': articleId}, 
			{$push:{'comments': comment}}, 
			function(err, article) {

				if(err) {

					cb(err);
				}

				return cb(null, article)
			});
	},

	addReply: function(req, options, cb) {
		let articleId = options.articleId;
		let commentId = options.commentId;
		let reply = {
			username: options.username,
			comment: options.comment,
			date: options.date
		}

		ArticleModel.findOne({_id: articleId}, function(err, article){

			article.comments.forEach(function(comment){
				if (comment._id == commentId) {
					comment.replies.push(reply);

					article.save(function(err, article){
						if(err) cb(err);
						cb(null, article);
					});
				};
		});
	})
}
}

module.exports = Controllers;