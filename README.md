# NewsScraper
Scrape headlines from a popular News web site

A web app that lets users view and leave comments on the latest news.
News aarticles are scraped from a news website using Mongoose and Cheerio

1. Create a GitHub repo for this assignment and clone it to your computer.
   Any name will do -- just make sure it's related to this project in some fashion.

2. Run `npm init`. When that's finished, install and save these npm packages:

3. express

4. express-handlebars

5. mongoose

6. body-parser

7. cheerio

8. request


In order to deploy your project to Heroku, you must set up an
mLab provision. mLab is remote MongoDB database that Heroku supports natively.

Follow these steps to get it running:

1. Create a Heroku app in your project directory.

2. Run this command in your Terminal/Bash window:

    * `heroku addons:create mongolab`

    * This command will add the free mLab provision to your project.

3. When you go to connect your mongo database to mongoose, do so the following way:

```js
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
```

* This code should connect mongoose to your remote mongolab database if deployed,
  but otherwise will connect to the local mongoHeadlines database on your computer.

14. [Watch this demo of a possible submission](mongo-homework-demo.mov).
    See the deployed demo application [here](http://nyt-mongo-scraper.herokuapp.com/).

15. Your site doesn't need to match the demo's style, but feel free to attempt
    something similar if you'd like. Otherwise, just be creative!

### Submission on BCS

* Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

## Instructions

* Create an app that accomplishes the following:

  1. Whenever a user visits your site, the app should scrape stories
     from a news outlet of your choice and display them for the user.
     Each scraped article should be saved to your application database.
     At a minimum, the app should scrape and display the following information for each article:

     * Headline - the title of the article

     * Summary - a short summary of the article

     * URL - the url to the original article

     * Feel free to add more content to your database (photos, bylines, and so on).

  2. Users should also be able to leave comments on the articles displayed and revisit them later.
     The comments should be saved to the database as well and associated with their articles.
     Users should also be able to delete comments left on articles.
     All stored comments should be visible to every user.

* Beyond these requirements, be creative and have fun with this!

### Tips
* Whenever you scrape a site for stories, make sure an article isn't already represented
  in your database before saving it; we don't want duplicates.

* Don't just clear out your database and populate it with scraped articles whenever a user
  accesses your site.

  * If your app deletes stories every time someone visits, your users won't be able to see
    any comments except the ones that they post.

### Reminder: Submission on BCS

* Please submit both the deployed Github.io link to your homework AND the link to the Github Repository!

---

### Minimum Requirements

Attempt to complete homework assignment as described in instructions. If unable to complete certain portions, please pseudocode these portions to describe what remains to be completed. Hosting on Heroku and adding a README.md are required for this homework. In addition, add this homework to your portfolio, more information can be found below.

---

### Hosting on Heroku

### Create a README.md

### Add To Your Portfolio

