// Initialize Firebase
var config = {
    apiKey: "AIzaSyA69XoF-OD4_jkWwTS3cOwNinWH7jtxSFM",
    authDomain: "congenial-umbrella.firebaseapp.com",
    databaseURL: "https:// congenial-umbrella.firebaseio.com",
    projectId: "congenial-umbrella",
    storageBucket: "congenial-umbrella.appspot.com",
    messagingSenderId: "86042197262"
};
firebase.initializeApp(config);
var database = firebase.database();

var userId = "";
var playerID = "";
var playerName = "";
var playerName = "";
var registeredName = "";

gameSetup();

function gameSetup() {
    disableGameButtons();
}


function disableGameButtons() {
    // deactivate game play buttons until player joins a game
    $(".rpsls").attr("disabled", true);
}

// add chat tracking... some kind of push-pop most recent 5-10 comments
// any user can chat, not just players...


// Validate new or existing users
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        userId = user.uid;

        var playerRef = database.ref("players").child(userId);

        playerRef.on('value', function(snapshot) {

            var exists = (snapshot.child("started").val() !== null);
            var nameExists = false;

            if (!exists) {
                console.log("New User")
                    // Save the new player creation date in Firebase 
                playerRef.child('started').set(firebase.database.ServerValue.TIMESTAMP);
                playerRef.child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
            } else {
                console.log("User Exists")
                playerName = snapshot.child("displayName").val();

                $("#player-name").text("Welcome " + playerName + "!")
                nameExists = (playerName !== null && playerName > "");
            }

            // See if we need to set the name
            if (!nameExists || (playerName !== registeredName && registeredName > "")) {
                // New Name || Name Change
                playerRef.child("displayName").set(registeredName);
            }
        });

        // ...
    } else {
        // User is signed out.
        // if they were mid-game, declare the other player winner by forfeit
        // track forfeits to player stats
        // ... show registration
    }
    // ...
});

// Visitor registers to play
$("#register").on("click", function(event) {
    event.preventDefault();

    registeredName = $("#register-name").val();
    $("#register-name").val("");

    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

    });
    // this action triggers our player validation check...
    database.ref("players").child(userId).child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
});

var gameRef = database.ref("game");

// Player joins game
gameRef.child("join").on('value', function(snapshot) {
    if (!snapshot.exists()) {
        return;
    }

    var newPlayer = snapshot.child("userId").val();
    if (newPlayer === null || newPlayer !== userId) {
        // triggered by something other than the player joining
        // OR player joined is not us...
        // exit out, because both players don't need to run checks
        return;
    }

    gameRef.once('value', function(snapshot) {
        // Set first player
        if (!snapshot.hasChild("playerOne")) {
            playerID = "playerOne";
        } else {
            if (snapshot.child("playerOne").child("userId").val() === newPlayer) {
                playerID = "playerOne";
            } else {
                // Player One already exists
                // Set second player
                if (!snapshot.hasChild("playerTwo")) {
                    playerID = "playerTwo";
                } else {
                    if (snapshot.child("playerTwo").child("userId").val() === newPlayer) {
                        playerID = "playerTwo";
                    } else {
                        // Player Two already exists
                        // Player is a watcher
                        playerID = "Watcher";
                    }
                }
            }
        }

        if (playerID !== "Watcher") {
            // add our player to the game boards
            var wins = 0
            gameRef.child(playerID).set({
                userId,
                wins
            });
            console.log("Player joined");
        } else {
            // Add some code to cue watchers up for "Got Next..."
        }

        if (playerID !== "Watcher") {
            // activate buttons
            $(".rpsls").attr("disabled", null);
        } else {
            // deactivate buttons
            $(".rpsls").attr("disabled", true);
        }
        // Not sure if its better to remove this sooner...
        gameRef.child("join").remove();
    });

});

// Score player moves
gameRef.on('value', function(snapshot) {
    if (!snapshot.exists()) {
        return;
    }

    var p1, p2; // player references
    var p1Choice, p2Choice; // player choices
    var p1wins, p2wins; // player win counts

    if (snapshot.hasChild("playerOne")) {
        p1 = snapshot.child("playerOne");
        if (p1.hasChild("choice")) {
            p1Choice = p1.child("choice").val();
        }
        if (p1.hasChild("wins")) {
            p1wins = p1.child("wins").val();
        }
    }

    if (snapshot.hasChild("playerTwo")) {
        p2 = snapshot.child("playerTwo");
        if (p2.hasChild("choice")) {
            p2Choice = p2.child("choice").val();
        }
        if (p2.hasChild("wins")) {
            p2wins = p2.child("wins").val();
        }
    }

    // both players ready?
    if (typeof p1Choice != "undefined" && typeof p2Choice != "undefined") {

        // clear the player's choices so we don't trigger a scoring loop
        gameRef.child("playerOne").child("choice").remove();
        gameRef.child("playerTwo").child("choice").remove();

        if (p1Choice === p2Choice) {
            actionMessage("Tie!  Play again...");
        }

        // Player 1 winning scenarios
        // Rock beats Scissors
        if (p1Choice === "rock" && p2Choice === "scissors") {
            actionMessage("Rock beats Scissors... Player 1 wins");
            p1wins += 1;
        }
        // Scissors beats Paper
        if (p1Choice === "scissors" && p2Choice === "paper") {
            actionMessage("Scissors beats Paper... Player 1 wins");
            p1wins += 1;
        }
        // Paper beats Rock
        if (p1Choice === "paper" && p2Choice === "rock") {
            actionMessage("Paper beats Rock... Player 1 wins");
            p1wins += 1;
        }

        // Player 2 winning scenarios
        // Rock beats Scissors
        if (p2Choice === "rock" && p1Choice === "scissors") {
            actionMessage("Rock beats Scissors... Player 2 wins");
            p2wins += 1;
        }
        // Scissors beats Paper
        if (p2Choice === "scissors" && p1Choice === "paper") {
            actionMessage("Scissors beats Paper... Player 2 wins");
            p2wins += 1;
        }
        // Paper beats Rock
        if (p2Choice === "paper" && p1Choice === "rock") {
            actionMessage("Paper beats Rock... Player 2 wins");
            p2wins += 1;
        }

        gameRef.child("playerOne").update({ wins: p1wins });
        gameRef.child("playerTwo").update({ wins: p2wins });

        if (p1wins >= 3 || p2wins >= 3) {
            var message = "<strong>GAME OVER!</strong>";
            var winner = ""
            var p1wins = ""
            var p2wins = ""
                // Add winner to leader board
            if (p1wins > p2wins) {
                winner = "Player 1"
                p1wins = "<strong>" + p1wins + "</strong>"
            } else {
                winner = "Player 2"
                p2wins = "<strong>" + p2wins + "</strong>"
            }
            // Declare final winner
            message += "<br>" + winner + " is the final winner!";
            message += "<br>Player 1 wins: " + p1wins + ""
            message += "<br>Player 2 wins: " + p2wins + ""

            actionMessage(message);
            // Check who's got next!
        }

        // re-activate buttons
        $(".rpsls").attr("disabled", null);

    }

});

function actionMessage(message) {

    $("#action").text(message);
}

// Whenever a user clicks the "Fight" button
$("#start").on("click", function(event) {
    event.preventDefault();
    console.log("start");
    gameRef.child("join").child("userId").set(userId);
});

// Handle the player's game choices
$(".rpsls").on("click", function(event) {
    event.preventDefault();

    // disabe this player's buttons until both have played
    disableGameButtons();

    // $(this) values:
    // rock
    // paper
    // scissors
    // lizard - TBD
    // spock - TBD
    gameRef.child(playerID).update({ choice: $(this).val() });

});