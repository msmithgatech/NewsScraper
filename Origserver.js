var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

var PORT = 3000;


     //  DATABASE CONFIG and COLLECTION (SCHEMA) DEFINITION

var databaseUrl = "washpost";
var collections = ["postData"];

var app = express();



    //  THE USERMODEL IS ACCESSED VIA THIS JAVASCRIPT FILE
var User = require("./userModel.js");

app.use(bodyParser.urlencoded({ extended: true }));

//  USING PUBLIC FOLDER AS AN EXPRESS STATIC DIRECTORY
app.use(express.static("public"));

    //  CONNECT TO THE MONGO DB
mongoose.connect("mongodb://localhost/userdb");



     // CONNECT MONGOJS CONFIG TO THE DB VARIABLE
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("washpost DB Error:", error);
});


    //  HOME PAGE
app.get("/", function(req, res) {
    res.send("Begin Washington Post scrape");
});


     // DISPLAY ALL DATA ALREADY IN THE DB
app.get("/all", function(req, res) {
    db.postData.find({}, function(error, found) {
        if (error) {
            console.log("washpost DATA ERROR:", error);
        }
        else {
            res.json(found);
        }
    });
});



app.get("/postData", function(req, res) {
   request("https://www.washingtonpost.com", function(error, response, html) {

       var $ = cheerio.load(html);
       var results = [];

       //  SELECT EACH DIV WITH CLASS HEADLINE,
       //  SAVE THE TOPIC AND ANY PICTURES
       var topic = $(element).children("a").text();
       var pix = $(element).children("a").attr("href");
       $(".headline").each(function (i, element) {


           if (topic && pix) {
              db.postData.insert({
                 topic: topic,
                 pix: pix
              },
              function(err, inserted) {
                 if (err) {
                    console.log(err);
                 } else {
                    console.log(inserted);
                 }
              });
           }
       });
   });
        //  ADVISE SCRAPE COMPLETED
   res.send("Washington Post scrape is completed");
});