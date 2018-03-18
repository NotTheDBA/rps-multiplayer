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
    //this action triggers our player registration check...
    database.ref("players").child(userId).child('lastLogin').set(firebase.database.ServerValue.TIMESTAMP);
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var isAnonymous = user.isAnonymous;
        userId = user.uid;

        var playerRef = database.ref("players").child(userId);
        debugger;
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


// Whenever a user clicks the submit-bid button
$("#rock").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    console.log(userId);
    console.log($(this).val());
});

// Whenever a user clicks the submit-bid button
$("#paper").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    console.log($(this).val());
});

// Whenever a user clicks the submit-bid button
$("#scissors").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
    console.log($(this).val());
});

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