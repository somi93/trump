var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');


const config = require('../config/db');

// Post Schema
const ArticleSchema = mongoose.Schema({

  title: { 
  	type: String 
  },
  description: { 
  	type: String 
  },
  author: { 
  	type: String 
  },
  publishedAt: { 
  	type: Date 
  },
  imageUrl: { 
  	type: String 
  },
  source: { 
  	type: String 
  },
  source_id: { 
    type: String 
  },
  articleUrl: { 
  	type: String 
  },
  comments: [{
    username: String, 
    comment: String, 
    date: Date,
    replies:[{
      username: String, 
      comment: String, 
      date: Date
    }]
  }]

});

ArticleSchema.plugin(mongoosePaginate);

const Article = module.exports = mongoose.model('Article', ArticleSchema);

module.exports.getArticleById = function(id, callback){
  Article.findById(id, callback);
}

module.exports.addArticle = function(newArticle, callback){
  newArticle.save(callback);
}
