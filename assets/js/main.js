// Initialize Firebase
var config = {
    apiKey: "AIzaSyA69XoF-OD4_jkWwTS3cOwNinWH7jtxSFM",
    authDomain: "congenial-umbrella.firebaseapp.com",
    databaseURL: "https://congenial-umbrella.firebaseio.com",
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
    //deactivate play buttons until start buttons
    disableButons();
}


function disableButons() {
    //deactivate play buttons until start buttons
    $(".rpsls").attr("disabled", true);
}

//Validate new or existing users
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
                // $("#registration").empty();
                $("#player-name").text("Welcome " + playerName + "!")
                nameExists = (playerName !== null && playerName > "");
            }

            //See if we need to set the name
            if (!nameExists || (playerName !== registeredName && registeredName > "")) {
                //New Name || Name Change
                playerRef.child("displayName").set(registeredName);
            }
        });

        // ...
    } else {
        // User is signed out.
        // ... show registration
    }
    // ...
});
// var playerCount = 0;
// push "child added"

// Whenever a user clicks the register button
$("#register").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    registeredName = $("#register-name").val();
    $("#register-name").val("");

    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

    });
    //this action triggers our player validation check...
    database.ref("players").child(userId).child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
});

var gameRef = database.ref("game");

// var playerJoins = gameRef.child("join");
// playerJoins.child("player-count").set(0);

// console.log(userId + "played");

gameRef.on('value', function(snapshot) {
    if (!snapshot.exists()) {
        return;
    }

    // Score player moves
    var p1, p2;
    var p1Choice, p2Choice;
    var p1wins, p2wins;

    if (snapshot.hasChild("playerOne")) {
        // debugger;
        p1 = snapshot.child("playerOne");
        if (p1.hasChild("choice")) {
            p1Choice = p1.child("choice").val();
        }
        if (p1.hasChild("wins")) {
            p1wins = p1.child("wins").val();
            // } else {
            //     p1wins = 0
        }
    }

    if (snapshot.hasChild("playerTwo")) {
        // debugger;
        p2 = snapshot.child("playerTwo");
        if (p2.hasChild("choice")) {
            p2Choice = p2.child("choice").val();
        }
        if (p2.hasChild("wins")) {
            p2wins = p2.child("wins").val();
            // } else {
            //     p2wins = 0
        }
    }

    if (typeof p1Choice != "undefined" && typeof p2Choice != "undefined") {
        // console.log(p1Choice)
        // console.log(p2Choice)
        // clear the players choices so we don't trigger a loops
        gameRef.child("playerOne").child("choice").remove();
        gameRef.child("playerTwo").child("choice").remove();

        if (p1Choice === p2Choice) {
            $("#action").text("Tie!  Play again...");
        }
        //Rock beats Scissors
        if (p1Choice === "rock" && p2Choice === "scissors") {
            $("#action").text("Rock beats Scissors... Player 1 wins");
            p1wins += 1;
        }
        //Scissors beats Paper
        if (p1Choice === "scissors" && p2Choice === "paper") {
            $("#action").text("Scissors beats Paper... Player 1 wins");
            p1wins += 1;
        }
        //Paper beats Rock
        if (p1Choice === "paper" && p2Choice === "rock") {
            $("#action").text("Paper beats Rock... Player 1 wins");
            p1wins += 1;
        }

        //Rock beats Scissors
        if (p2Choice === "rock" && p1Choice === "scissors") {
            $("#action").text("Rock beats Scissors... Player 2 wins");
            p2wins += 1;
        }
        //Scissors beats Paper
        if (p2Choice === "scissors" && p1Choice === "paper") {
            $("#action").text("Scissors beats Paper... Player 2 wins");
            p2wins += 1;
        }
        //Paper beats Rock
        if (p2Choice === "paper" && p1Choice === "rock") {
            $("#action").text("Paper beats Rock... Player 2 wins");
            p2wins += 1;
        }
        console.log(p1wins)
        console.log(p2wins)
        gameRef.child("playerOne").update({ wins: p1wins });
        gameRef.child("playerTwo").update({ wins: p2wins });

        //re-activate buttons
        $(".rpsls").attr("disabled", null);

    }

});

gameRef.child("join").on('value', function(snapshot) {
    // Player joins game
    if (!snapshot.exists()) {
        return;
    }
    var newPlayer = snapshot.child("userId").val();
    if (newPlayer === null || newPlayer !== userId) {
        // something other than player joining...
        // OR player joined is someone else - we don't both need to process
        return;
    }

    gameRef.once('value', function(snapshot) {
        if (!snapshot.hasChild("playerOne")) {
            // gameRef.child("playerOne").set(newPlayer);
            playerID = "playerOne";
        } else {
            // console.log(snapshot.child("playerOne").child("userId"))
            // console.log(newPlayer)
            if (snapshot.child("playerOne").child("userId").val() === newPlayer) {
                playerID = "playerOne";
            } else {

                // console.log("Player One already exists");

                if (!snapshot.hasChild("playerTwo")) {

                    // gameRef.child("playerTwo").set(newPlayer);
                    playerID = "playerTwo";
                } else {
                    if (snapshot.child("playerTwo").child("userId").val() === newPlayer) {
                        playerID = "playerTwo";
                    } else {
                        // console.log("Player Two already exists");
                        //player is a watcher
                        playerID = "Watcher";
                    }
                }
            }
        }
        var wins = 0
        gameRef.child(playerID).set({
            userId,
            wins
        });
        console.log("Player joined");
        // console.log("Ready " + playerName);
        if (playerID !== "Watcher") {
            //activate buttons
            $(".rpsls").attr("disabled", null);
        } else {
            //deactivate buttons
            $(".rpsls").attr("disabled", true);
        }
        gameRef.child("join").remove();
    });

});

// Whenever a user clicks the start button
$("#start").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    console.log("start");

    gameRef.child("join").child("userId").set(userId);

});


$(".rpsls").on("click", function(event) {
    disableButons();
    event.preventDefault();
    // disabe players buttons until both have played

    // console.log(playerID + " playeD");
    // $(this).val:
    //  rock
    //  paper
    //  scissors
    //  lizard - TBD
    //  spock - TBD
    // console.log(userId);
    // console.log(playerID);
    // console.log($(this).val());
    // gameRef.child(playerID).set({
    //     userId,

    //     choice: $(this).val()

    // });
    gameRef.child(playerID).update({ choice: $(this).val() });
    // gameRef.child("playerTwo").child("wins").update(p2wins);

    // console.log(gameRef.child("plays").val());
    // gameRef.child(playerID).child("choice").set($(this).val());
});