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

// TODO:
// - User(s) sign in
// - Users choose to join a game
// - Users are matched up
// - Game begins
// - Each user presented RPS buttons
// - User selects RPS button
// - Response is sent back to server
// - Server waits until both responses received ("waiting" state can be sent)
// - Server compares responses
// - Winner declared
// - Score updated
// - Best of 3 wins
// - Winner board tracked