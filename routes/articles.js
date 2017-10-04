'use strict';

var ArticleApi = require('../utils/helpers/controllers');


var Article = {

    getArticle: function(req, res, next) {

        var options = { id: req.params.id };

        ArticleApi.getArticle(options, function(err, article) {

            if (err || !article) {
                err = err || new Error("Article Not Found");
                err.status = 417;
                return next(err);
            }
            req.data = article;
            next();
        });
    },

    getArticles: function(req, res, next) {
        var options = {
          page: req.query.page || 1,
          source: req.query.source,
        };

        ArticleApi.getArticles(req, options, function(err, articles) {
            if (err || !articles) {
                err = err || new Error('No Articles Available For Now');
                err.status = 417;
                return next(err);
            }
            req.data = articles;
            next();
        });
    },

    getSources: function(req, res, next) {
        var options = {};

        ArticleApi.getSources(req, options, function(err, sources) {
          req.data = sources;
          next();
        });
    },

    addComment: function(req, res, next) {
        let options = {
            id: req.body.id,
            username: req.body.username,
            comment: req.body.comment,
            date: req.body.date

        }

        ArticleApi.addComment(req, options, function(err, article) {
            if (err) console.log(err);
            req.data = article;
            next();
        })
    },

    addReply: function(req, res, next) {
        let options = {
            articleId: req.body.articleId,
            commentId: req.body.commentId,
            username: req.body.username,
            comment: req.body.comment,
            date: req.body.date
        }

        ArticleApi.addReply(req, options, function(err, article) {
            if (err) console.log(err);
            req.data = article;
            next();
        })
    },

    sendJSON: function(req, res, next) {
        res.json(req.data);
    }
};

module.exports = Article;

(function() {
    if (require.main == module) {}
}());