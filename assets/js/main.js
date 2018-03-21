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

var playerId = "";
var playerID = "";
var playerName = "";
var playerName = "";
var registeredName = "";

gameSetup();

function gameSetup() {
    //deactivate play buttons until start buttons
    $(".rpsls").attr("disabled", true);
}


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
    database.ref("players").child(playerId).child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
});

//Validate new or existing users
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        playerId = user.uid;

        var playerRef = database.ref("players").child(playerId);

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

var gameRef = database.ref("game");

// var playerJoins = gameRef.child("join");
// playerJoins.child("player-count").set(0);

gameRef.child("join").on('value', function(snapshot) {
    // Player joins game
    if (!snapshot.exists()) {
        return;
    }
    var newPlayer = snapshot.child("playerId").val();
    if (newPlayer === null || newPlayer !== playerId) {
        // something other than player joining...
        // OR player joined is someone else - we don't both need to process
        return;
    }

    gameRef.once('value', function(snapshot) {
        if (!snapshot.hasChild("playerOne")) {
            // gameRef.child("playerOne").set(newPlayer);
            playerID = "playerOne";
        } else {
            console.log(snapshot.child("playerOne").child("playerId"))
            console.log(newPlayer)
            if (snapshot.child("playerOne").child("playerId").val() === newPlayer) {
                playerID = "playerOne";
            } else {

                console.log("Player One already exists");

                if (!snapshot.hasChild("playerTwo")) {

                    // gameRef.child("playerTwo").set(newPlayer);
                    playerID = "playerTwo";
                } else {
                    if (snapshot.child("playerTwo").child("playerId").val() === newPlayer) {
                        playerID = "playerTwo";
                    } else {
                        console.log("Player Two already exists");
                        //player is a watcher
                        playerID = "Watcher";
                    }
                }
            }
        }
        gameRef.child(playerID).set({
            playerId
        });
        console.log("Ready " + playerName);
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

    gameRef.child("join").child("playerId").set(playerId);

});


$(".rpsls").on("click", function(event) {
    event.preventDefault();
    // $(this).val:
    //  rock
    //  paper
    //  scissors
    //  lizard - TBD
    //  spock - TBD
    // console.log(playerId);
    // console.log(playerID);
    // console.log($(this).val());
    gameRef.child(playerID).set({
        playerId,

        choice: $(this).val()

    });

    // gameRef.child(playerID).child("choice").set($(this).val());

});