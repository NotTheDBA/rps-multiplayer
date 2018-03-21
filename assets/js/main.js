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
var registeredName = "";

// Whenever a user clicks the register button
$("#register").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    registeredName = $("#player-name").val();
    $("#player-name").val("");

    firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);

    });
    //this action triggers our player validation check...
    database.ref("players").child(userId).child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
});

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
var gamePlayerRef = gameRef.child("players");

var playerJoins = gameRef.child("join");
// playerJoins.child("player-count").set(0);


playerJoins.on('value', function(snapshot) {
    // Player joins game
    if (!snapshot.exists()) {
        return;
    }
    var newPlayer = snapshot.child("id").val();
    if (newPlayer === null) {
        return;
    }
    // var playerCount = snapshot.child("player-count").val();
    // console.log(gameRef.child("playerOne"));

    // console.log(playerCount);


    // var p1Ref = gameRef.child("playerOne");

    // p1Ref.once('value', function(snapshot) {
    //     if (!snapshot.hasChild("playerOne")) {
    //         gameRef.child("playerOne").set(newPlayer);
    //         gameRef.child("join").remove();
    //     } else {
    //         alert("Player One already exists");
    //     }
    // });

    gameRef.once('value', function(snapshot) {
        if (!snapshot.hasChild("playerOne")) {
            console.log("Player One already exists");
            gameRef.child("playerOne").set(newPlayer);
        } else {
            console.log("Player One already exists");
            if (!snapshot.hasChild("playerTwo") && snapshot.child("playerOne").val() !== newPlayer) {
                gameRef.child("playerTwo").set(newPlayer);
            } else {
                console.log("Player Two already exists");
            }
        }
        gameRef.child("join").remove();
    });

    // if (playerCount === 0) {

    // if (!gameRef.childexists().equalTo("playerOne")) {
    //     // if (!p1Ref.exists()) {

    //     //     // // gameRef.child("playerOne").push({
    //     gameRef.child("playerOne").set({
    //         id: newPlayer
    //     });
    //     //     // playerID = "playerOne";
    //     //     // if (snapshot.child("join").exists()) {
    //     //     gameRef.child("join").remove();
    //     //     // }
    //     console.log("Player One joined: " + newPlayer);
    //     //     return;
    // }
    //  else if (p1Ref.child("id") === newPlayer) {

    //     // playerID = "playerOne";
    //     if (snapshot.child("join").exists()) {
    //         gameRef.child("join").remove();
    //     }
    //     console.log("Ready Player One.");
    //     return;
    // }

});

// gamePlayerRef.on('value', function(snapshot) {
//     if (!snapshot.exists()) {
//         return;
//     }

//     playerCount = snapshot.val();
//     console.log(playerCount);

// });

// gameRef.on('value', function(snapshot) {
//     if (!snapshot.exists()) {
//         return;
//     }
//     var p1Ref = snapshot.child("playerOne");
//     var p2Ref = snapshot.child("playerTwo");
//     if (p1Ref.exists()) {
//         console.log("playerOne exists.")
//     }
//     if (snapshot.child("playerTwo").exists()) {
//         console.log("playerTwo exists.")
//     }

//     // Player joins game
//     var newPlayer = snapshot.child("join").val();
//     // debugger;
//     if (newPlayer === null) {
//         return;
//     }
//     // if (!gameRef.child("playerOne").exists()) {
//     if (!p1Ref.exists()) {

//         // // gameRef.child("playerOne").push({
//         // gameRef.child("playerOne").set({
//         //     id: newPlayer
//         // });
//         // playerID = "playerOne";
//         // if (snapshot.child("join").exists()) {
//         gameRef.child("join").remove();
//         // }
//         console.log("Player One joined: " + newPlayer);
//         return;
//     } else if (p1Ref.child("id") === newPlayer) {

//         // playerID = "playerOne";
//         if (snapshot.child("join").exists()) {
//             gameRef.child("join").remove();
//         }
//         console.log("Ready Player One.");
//         return;
//     }

//     // // if (!gameRef.child("playerTwo").exists()) {
//     // if (!p2Ref.exists()) {

//     //     gameRef.child("playerTwo").set({
//     //         id: newPlayer
//     //     });
//     //     playerID = "playerTwo";
//     //     if (snapshot.child("join").exists()) {
//     //         gameRef.child("join").remove();
//     //     }
//     //     console.log("Player Two joined: " + newPlayer);
//     //     return;
//     // } else if (p2Ref.child("id") === newPlayer) {

//     //     playerID = "playerTwo";
//     //     if (snapshot.child("join").exists()) {
//     //         gameRef.child("join").remove();
//     //     }
//     //     console.log("Ready Player Two.");
//     //     return;
//     // }

//     // console.log("New watcher joined: " + newPlayer);
//     // if (snapshot.child("join").exists()) {
//     //     gameRef.child("join").remove();
//     // }
//     // return;

// });

// Whenever a user clicks the start button
$("#start").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    // console.log(userId);
    // console.log(playerName);

    console.log("start");
    // debugger;
    playerJoins.child("id").set(userId);

});


$(".rpsls").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    // gameRef.child("choice").set($(this).val());
    console.log(userId);
    console.log(playerID);
    console.log($(this).val());
    gameRef.child(playerID).set({
        choice: $(this).val()
    });

    // gameRef.child(playerID).child("choice").set($(this).val());

});

// // Whenever a user clicks the submit-bid button
// $("#rock").on("click", function(event) {
//     // Prevent form from submitting
//     event.preventDefault();
//     console.log(userId);
//     console.log($(this).val());
// });

// // Whenever a user clicks the submit-bid button
// $("#paper").on("click", function(event) {
//     // Prevent form from submitting
//     event.preventDefault();
//     console.log($(this).val());
// });

// // Whenever a user clicks the submit-bid button
// $("#scissors").on("click", function(event) {
//     // Prevent form from submitting
//     event.preventDefault();
//     console.log($(this).val());
// });

// // Whenever a user clicks the submit-bid button
// $("#lizard").on("click", function(event) {
//     // Prevent form from submitting
//     event.preventDefault();
// console.log($(this).val());
// });

// // Whenever a user clicks the submit-bid button
// $("#spock").on("click", function(event) {
//     // Prevent form from submitting
//     event.preventDefault();
// console.log($(this).val());
// });