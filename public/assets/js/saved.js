$(document).ready(function() {
    // Getting a reference to the article container div we will be rendering all articles inside of
    var articleContainer = $(".article-container");
    // Adding event listeners to any dynamically generated "save article"
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".scrape.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    // initPage kicks everything off when the page is loaded
    initPage();

    function initPage() {
        // Empty the article container, run an AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data) {
            // If we have headlines, render them to this page
            if (data && data.length) {
                renderArticles(data);
            } else {
                // Otherwise render a message explaining we have no articles
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        // this function handles appending HTML containing our article data to the page
        // We passed an array of JSON containing all available articles i our db
        var articlePanels = [];
        // We pass each article JSON object to the createPanel function which returns a bootstrap
        // panel with the article data inside
        for (var i= 0; i < articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
        // Once we have all the HTML for the articles stored in the articlesPanel array,
        // append them to the articlesPanel container
        articleContainer.append(articlePanels);
    }

    function createPanel(article) {
        // This function takes in a single JSON object for an article?headline
        // It constructs a jQuery element containing all of the formatted HTML for the
        // article panel
        var panel =
            $([
                "<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));
        // Attach the article's id to the jQuery element
        // We will use this when trying to figure out which article
        // the user wants to remove or open notes for
        panel.data("_id", article._id);
        // we return the constructed panel jQuery element
        return panel;
    }

    function renderEmpty() {
        // this function renders some HTML to the page explaining we don't have any new articles to view
        // using a joined array of HTML string data because
        // it's easier to read/change than a concatenated string
        var emptyAlert =
            $([
                "<div class='alert alert-warning text-center'>",
                "<h4>There are no new articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a class='scrape-new'>Try scraping new articles</a></h4>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        //   Appending this data to the page
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data) {
        // This function handles redering note list items to our notes module
        // Setting up an array of notes to render after finnished
        // Also setting up a current note variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (data.notes.length) {
            //If there is no notes, just display a message explaining this
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            // If there are notes, go throught each one
            for (var i = 0; i < data.notes.length; i++) {
                // constructs an li element to contain our noteText and a delete button
                currentNote =
                    $([
                        "<li class='list-group-item note'>",
                        data.notes[i].noteText,
                        "<button class='btn btn-danger note-delete'>X</button>",
                        "</li>"
                    ].join(""));
                //   store the note id on the dlete button for easy access when trying to delete
                currentNote.children("button").data("_id", data.notes[i]._id);
                // adding the currentNote to the notesToRender array
                notesToRender.push(currentNote);
            }
        }
        // now append the notesToRender to the note-container inside the note model
        $(".note-container").append(notesToRender);
    }

    function handleArticleDelete() {
        // This function handles deleting articles/headlines
        // We grab the id of the article to delete from the panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        // delete method for semantics since an article/headline is being deleted
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }). then(function(data) {
            // run initPage again if working. It will render the list of saved articles
            if(data.ok) {
                initPage();
            }
        });
    }

    function handleArticleNotes() {
        // this function handles opening the notes modal and displaying the notes
        // grab the id of the article to get notes form the panel element the delete button sits inside
        var currentArticle = $(this).parents(".panel").data();
        // grab notes with this headline/article id
        $.get("/api/notes" + currentArticle._id).then(function(data) {
            // constructing initial HTML to add to the notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                currentArticle._id,
                "</h4",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            // adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // adding some information about the article and aricle notes
            // to the save button for easy access
            // When trying to add new note
            $(".btn.save").data("article",noteData);
            // renderNoteList will populate the actual HTML inside of the modal
            // that was just created/append
            renderNotesList(noteData);
        });
    }

    function handleNoteSave() {
        // this funciton handles what happens when a user tries to save a new note for an article
        // setting a variable to hold some formatted data about our note.
        // grabbing the note typed into the input box
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        // if there is data typed into the note input field, format it
        // and post is to the "/api/notes" routes and send the formatted noteData as well
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function() {
                // close the modal when complete
                bootobox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        // this function handles the deletion of notes
        // first must grab the id of the note we want to delete
        // the data is stored on the delete button when it was created
        var NoteToDelete = $(this).data("_id");
        // perform an DELETE request to "/api/notes" with the id of the note
        // being deleted as a parameter
        $.ajax({
            url: "/api/notes/" + NoteToDelete,
            method: "DELETE"
        }).then(function() {
            //when done hide the model
            bootbox.hideAll();

        });
    }
});