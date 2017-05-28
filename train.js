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

var now = moment().local;
var displayTime = moment().format('MMMM Do YYYY, h:mm:ss a');
var datetime;
var timeNow = moment().format('h:mm:ss');
var database = firebase.database();
var train = database.ref("/train");
var timesTables = [];
var trainCount = 0;
var nextTimeCheck = 0;

$(document).ready(function(){
    datetime = $("#rightnow");
    updateTime();
    setInterval(updateTime, 1000);
    //setInterval(updateNextTrain, 3000);//600000);
});

var updateTime = function () {
    date = moment(new Date());
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
    if(nextTimeCheck != 0){
        if(date.isSameOrAfter(nextTimeCheck)){
            updateNextTrain();
        }
    }
};

function updateNextTrain(){
    $("table.table").find("tr").each(function(i,v){
        var itsID = $(this).attr("id");
        if(!itsID){return true;}
        var idParts = itsID.split("-");
        if(idParts.length < 2){return true;}
        var num = parseInt(idParts[1], 10);
        if(timesTables[num] == undefined){return true;}
        var times = timesTables[num];
        var curr = moment().local().unix();
        var nxt = 0;
        for(var i=0;i<times.length;i++){
            //console.log("ITT: " + times[i] + " compared to " + curr);
            if(times[i] > curr){nxt = moment(times[i]*1000).local(); break;}
        }
        if(nxt == 0){
            nxt = moment(times[0]).local().add(1, 'days');
        }
        //console.log("NEXT TIME: " + nxt.format("LLL"));
        var now = moment().local();
        
        if(nextTimeCheck == 0){nextTimeCheck = nxt;}
        else if(nxt.isSameOrBefore(nextTimeCheck)){
            nextTimeCheck = nxt;
        }
        var diff = nxt.diff(now, 'minutes');
        $(this).find(".nextarrival").text(nxt.format('kk:mm'));
        $(this).find(".minstillarrive").text(diff);
    });
}

function getTimeTable(elem, setTime, duration, tc){
    var d = parseInt(duration, 10);
    //console.log("Duration: " + d);
    var duration = moment.duration({'minutes' : d});
    var res = setTime.split(":");
    var hour = 0;
    var timesTable = [];
    var minute = 0;
    if(res.length > 0){
        hour = res[0];
    }
    if(res.length > 1){
        minute = res[1];
    }
    var dayStart = moment().local().set({
           'hour' : parseInt(hour, 10),
           'minute'  : parseInt(minute, 10), 
           'second' : 0
        });
    var dayEnd = moment().local().set({
           'hour' : parseInt(hour, 10),
           'minute'  : parseInt(minute, 10), 
           'second' : 0
        });
    dayEnd.add(1, 'days');
    timesTable.push(dayStart.unix());
    console.log(dayStart.format('LLL') + " (" + dayStart.unix() + ")" + " : " + dayEnd.format('LLL') + " (" + dayEnd.unix() + ")");
    //var i;
    while(dayStart.unix() < dayEnd.unix()){
        dayStart.add(duration);
        timesTable.push(dayStart.unix());
        //i++;
    }
    console.log(timesTable);
    timesTables.push(timesTable);
}

$("#submitButton").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainname").val().trim().toLowerCase();
    var destination = $("#destination").val().trim();
    var frequency = $("#inputFrequency").val();
    var firstTrain = moment($("#firstTrain").val().trim(), "HH:mm").format("HH:mm");
    var exists = true;
    $("#trainname").val("")
    $("#destination").val("")
    $("#inputFrequency").val("")
    $("#firstTrain").val("")
    
    //var a = moment(firstTrain);
    //var b = moment(frequency);
    //console.log(a.from(b));

    var newTrain = {
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        firstTrain: firstTrain,
    }

    train.push().set(newTrain);
});

train.on("child_added", function(snapshot) {
    var trainName = snapshot.val().trainName;
    var destination = snapshot.val().destination;
    var firstTrain = snapshot.val().firstTrain;
    var frequency = snapshot.val().frequency;
    var nextTrain = snapshot.val().nextTrain;
    var row = $('<tr id="train- ' + trainCount + '">');
    var dataarea = $('<td>').text(trainName);
    var dataareab = $('<td>').text(destination);
    var dataareac = $('<td>').text(frequency);
    var dataaread = $('<td>').text(firstTrain);
    var dataareae = $('<td class="nextarrival">').text("");
    var mins = $('<td class="minstillarrive">').text("");
    var body = $('tbody');

    /*var trainStartCnvrtd = moment(trainStartCnvrtd, "HH:mm").subtract(1, "years");
    var now = moment()
    var minutesAway = frequency - ((now.diff(trainStartCnvrtd, "minutes")) % frequency)
    console.log(minutesAway);
    var trainArrival = moment().add(minutesAway, "minutes").format("HH:mm");*/

    console.log("CHILD ADDED:", snapshot.val().trainName, destination, firstTrain);
    
    row.append(dataarea);
    row.append(dataareab);
    row.append(dataareac);
    row.append(dataaread);
    row.append(dataareae);
    row.append(mins);
    body.append(row);
    getTimeTable(row, firstTrain, frequency, trainCount);
    trainCount++;
    updateNextTrain();
});
