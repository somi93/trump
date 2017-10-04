

let Helpers = {

	filterArticles: function (keyword, articles) {
		let filteredArticles = [];

		if(articles.length !== 0){

			for (let i=0; i<articles.length; i++){
				if(articles[i].title && articles[i].description){
					if(articles[i].title.includes(keyword) || articles[i].description.includes(keyword))

						filteredArticles.push(articles[i]);
				}
			}
		}
		return filteredArticles;
	}
}

module.exports = Helpers;