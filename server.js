var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

     // PORT WILL BE  THE HOST-DESIGNATED PORT OR PORT 3000
var PORT = process.env.PORT || 3000;

var app = express();

var router = express.Router();
require("./config/routes.js")(router)

    //  USE THE PUBLIC FOLDER AS THE EXPRESS STATIC DIRECTORY
app.use(express.static(__dirname + "/public"));


    //  THE EXPRESS HANDLEBARS CONNECTION
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));

    //  SETTING THE VIEW MECHANISM  TO HANDLEBARS
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));


    //  ALL REQUESTS GO THRU THE EXPRESS ROUTER MIDDLEWARE
app.use(router);

    //  USE DEPLOYED DB or LOCAL WASHPOST DB
var db = process.env.MONGODB_URI ||"mongodb://localhost/washpost";

    //  CONNECT DB WITH MONGOOSE
mongoose.connect(db, function(error) {
        //  LOG FOR MONGOOSE CONNECTION ERROR(s)
    if (error) {
        console.log(error);
    }
        //  SUCCESSFUL CONNECT  AND  LISTENING ON PORT xxxx
    else {
        console.log("MONGOOSE CONNECTION SUCCESSFUL");
        app.listen(PORT, function() {
            console.log("Listening on the port: " + PORT);
        });
    }
});