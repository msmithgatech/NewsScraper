    //  INCLUDE REQUEST and CHEERIO TO MAKE SCRAPING POSSIBLE
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {

    request("http://www.washingtonpost.com", function(err, res, body){
        var $ = cheerio.load(body);

        var articles = [];

        $(".headline").each(function(i, element){

            var topic = $(element).children("a").text();
            var pix = $(element).children("a").attr("href");

            if(topic && pix) {
                var dataToAdd = {
                    topic: topic,
                    pix: pix
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;