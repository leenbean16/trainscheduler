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
    var frequency = $("#inputFrequency").val();
    var firstTrain = $("#firstTrain").val();
    var exists = true;
    $("#trainname").val("")
    $("#destination").val("")
    $("#inputFrequency").val("")
    $("#firstTrain").val("")

    
    var a = moment(firstTrain);
    var b = moment(frequency);
    console.log(a.from(b));
    
    var newTrain = {
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,
    }

    train.push().set(newTrain);
})

train.on("child_added", function(snapshot) {
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency
    var row = $('<tr>');
    var dataarea = $('<td>').text(trainName);
    var dataareab = $('<td>').text(destination);
    var dataaread = $('<td>').text(frequency);
    var dataareac = $('<td>').text(firstTrain);
    var body = $('tbody');
    
    var trainStartCnvrtd = moment(trainStartCnvrtd, "HH:mm").subtract(1, "years");
    var now = moment()
    var minutesAway = frequency - ((now.diff(trainStartCnvrtd, "minutes")) % frequency)
    console.log(minutesAway);
    var trainArrival = moment().add(minutesAway, "minutes").format("HH:mm");


    console.log("CHILD ADDED:", snapshot.val().trainName, destination, firstTrain, frequency);

    row.append(dataarea);
    row.append(dataareab);
    row.append(dataaread);
    row.append(dataareac);
    body.append(row);
});
