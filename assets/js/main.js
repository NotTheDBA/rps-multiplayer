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

// Whenever a user clicks the submit-bid button
$("#register").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    // // Get the input values
    // employeeRate = parseInt($("#employee-rate").val());
    playerName = $("#player-name").val();
    console.log(playerName);
    // if (employeeRate > highrate) {
    // Save the new employee in Firebase
    database.ref().push({
        name: playerName,
        started: firebase.database.ServerValue.TIMESTAMP

    })

    //     // Store the new high rate and employee name as a local variable
    //     highrate = employeeRate
    //     highemployee = playerName


    //     // Change the HTML to reflect the new high rate and employee
    //     $("#recent-employee").text(highemployee);
    //     $("#recent-rate").text(highrate);

    // } else {
    //     // Alert
    //     alert("Sorry that bid is too low. Try again.");
    // }

});

// Whenever a user clicks the submit-bid button
$("#rock").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();
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