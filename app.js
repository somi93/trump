const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');

//require SSL on heroku
const sslRedirect = require('heroku-ssl-redirect');


const helpers = require('./utils/helpers/filter');
const controllers = require('./utils/helpers/controllers');
const ArticleModel = require('./models/article');
const config = require('./config/db');

// Connect To Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
	console.log('Connected to database ', config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
	console.log('Database error: ', err);
});

let articles = require('./routes/api');

let app = express();

//Heroku SSL forced redirection
app.use(sslRedirect(['production'], 301));

//Heroku 301 Redirect www.trumpnewsfeed.com to trumpnewsfeed.com
app.use(function forceLiveDomain(req, res, next) {
    // Don't allow user to hit Heroku now that we have a domain
    var host = req.get('Host');
    if (host === 'www.trumpnewsfeed.com') {
        return res.redirect(301, 'https://trumpnewsfeed.com' + req.originalUrl);
    }
    return next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//initiamizing middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//use cross origin resources
app.use(cors());

setInterval(function(){

//requesting articles from news_api for all sources
let sourcesList = config.sources;

console.log("Started fetching articles... " + new Date())

for (let j = 0; j < sourcesList.length; j++) {

	let url = config.endpoint + 'source='+ sourcesList[j].id + '&apiKey=' + config.accessKey;

	request(url, function (error, response, body) {

		if (error){
			console.log('error:', error);
		}
		// Trump is the keyword here!!
		let filteredArticles = helpers.filterArticles('Trump', JSON.parse(body).articles);

		for(let i = 0; i < filteredArticles.length; i++) {

			let article = {
				title: filteredArticles[i].title,
				description: filteredArticles[i].description,
				author: filteredArticles[i].author,
				source: sourcesList[j].name,
				source_id: sourcesList[j].id,
				url: filteredArticles[i].url,
				urlToImage: filteredArticles[i].urlToImage,
				publishedAt: filteredArticles[i].publishedAt,
			}

			controllers.saveArticle(article, function(err, article){
				if(err) console.log(err);
			})
		}

	});
}
}, 300 * 1000  /* Fetch articles from API every 300 secs */)

/*
	Nuxt 
 */
app.use('/', articles)

if (process.env.NODE_ENV === 'production') {
	const { Nuxt, Builder } = require('nuxt')
	
	const nuxtConfig = require('./nuxt.config.js')
	nuxtConfig.srcDir = 'nuxt_app/'
	const nuxt = new Nuxt(nuxtConfig)
	
	// Nuxt middleware should be the last one because it doesn't call next()
	app.use(nuxt.render)	
}

module.exports = app;
