// Initialize Firebase
var config = {
    apiKey: "AIzaSyDFC1cC6KikOuwzuzewSx-_YTvt8NKRhZE",
    authDomain: "trainschedule-83bff.firebaseapp.com",
    databaseURL: "https://trainschedule-83bff.firebaseio.com",
    projectId: "trainschedule-83bff",
    storageBucket: "trainschedule-83bff.appspot.com",
    messagingSenderId: "684261256470"
};
firebase.initializeApp(config);

// var trainData = firebase.database();

var now = moment();
var database = firebase.database();
var train = database.ref("/train");
var trainList = database.ref("/trainList");

$("#submitButton").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainname").val().trim().toLowerCase();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#inputFrequency").val();
    var exists = true;
    $("#trainname").val("")
    $("#destination").val("")
    $("#firstTrain").val("")
    $("#inputFrequency").val("")

    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }
    console.log(newTrain);

    train.child('trains').set(newTrain);
})

train.on("child_added", function(snapshot) {
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency
    console.log(trainName, destination, firstTrain, frequency);


$("#submitButton").on("click", function htmlshit() {
    var dataarea = $('id', 'tn');
    var dataareab = $('id', 'd');
    var dataareac = $('id', 'ft');
    var dataaread = $('id', 'na');
    var dataareae = $('id', 'ma');
    dataarea.attr('<td>');
    dataareab.attr('<td>');
    dataareac.attr('<td>');
    dataaread.attr('<td>');
    dataareae.attr('<td>');
    $('#tn').val(trainName);
    $('#d').val(destination);
    $('#ft').val(firstTrain);
    $('#na').val(frequency);
    console.log(htmlshit);

  })
});
