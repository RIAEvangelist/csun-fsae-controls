var phidget = require('../phidgetapi.js').phidget;
var Phidget = require('../phidgetapi.js').GPS;
var fs = require('fs');
var util = require('util');

var IK888 = new phidget();
var GPS = new phidget();

//Log path configurations
var logConfig={
    isDev:false, //if true logs to dev paths instead of prod paths
    prod:{
        GPSFile     :'/media/9016-4EF8/logs/GPS'+new Date().getTime()+'.csv',
        sensorFile  :'/media/9016-4EF8/logs/Sensor'+new Date().getTime()+'.csv',
        error       :'/media/9016-4EF8/logs/err'+new Date().getTime()+'.txt'
    },
    dev:{
        GPSFile     :'./logs/GPS'+new Date().getTime()+'.csv',
        sensorFile  :'./logs/Sensor'+new Date().getTime()+'.csv',
        error       :'./logs/err'+new Date().getTime()+'.txt'
    }
}

//Grab which log paths to use
var logs=logConfig[
    (logConfig.isDev)? 'dev' : 'prod' //grabs correct path object from config based on the isDev key:value
];

//Store GPS timing info here and don't log until we know the system timestamp offset from GPS timestamp.
var timing={
    offset:false,
    currentGPSTime:false
}

//CSV caching objects used to store data until next log write cycle is executed saves disk||SD IO

var GPSData={
    header:['timestamp','lat','lon','alt','heading','velocity'],//Creates headers for GPS CSV
    data:{}
};

var sensorData={
    header:['time','Front Right','Front Left','Rear Right','Rear Left','throttle'],//Creates headers for Sensor CSV
    data:{}
};

//Mapping of where analog inputs belong
IK888Map=[
    'frontLeft',    //0
    'frontRight',   //1
    'rearLeft',     //2
    'rearRight',    //3
    'throttle'      //4
];

//Prepping new CSVs with headers each time the script is run

fs.writeFile(
    logs.GPSFile,
    GPSData.header+'\n',
    fileErr
);

fs.writeFile(
    logs.sensorFile,
    sensorData.header+'\n',
    fileErr
);

//error handler, idk how this works -Mario
//if an error is triggered writing one of the other files, it gets logged here
function fileErr(err){
    if(!err){
        return;
    }


    fs.writeFile(
        logs.error,
        JSON.stringify(err)+'\n',
        fatalErr
    );
}

function fatalErr(err){
    if(!err){
        return;
    }


    console.log(err);
}


//Writing CSV files

function logGPS(){
    var csvData='';//cache variable
    for(var i in GPSData.data){
        var data=GPSData.data[i];
        csvData+=
            [
                data.timestamp,
                data.lat,
                data.lon,
                data.alt,
                data.heading,
                data.velocity
            ]+
            '\n'
        ;
    }

    GPSData.data={};

    fs.appendFile(
        logs.GPSFile,
        csvData
    );
}

function logSensor(){
    var csvData=''; //same cache variable, is it more efficent to do it this way?
    //its not same var different. the var is assigned inside the scope of the function.
    //when the function ends, the scope dies as does everything in it. the dead stuff is then garbage collected.
    for(var i in sensorData.data){
        var data=sensorData.data[i];
        csvData+=
            [
                data.timestamp,
                data.frontRight,
                data.frontLeft,
                data.rearRight,
                data.rearLeft,
                data.throttle
            ]+
            '\n'
        ;
    }

    GPSData.data={};

    fs.appendFile(
        logs.sensorFile,
        csvData
    );
}


//Binding Phidget event listeners

IK888.on(
    "error",
    errorHandler
);

IK888.on(
    'phidgetReady',
    sensorReady
);

GPS.on(
    'phidgetReady',
    GPSReady
);

GPS.on(
    "error",
    errorHandler
);

//Phidgets event handles

function sensorReady() {
    console.log('Sensors Ready');
    console.log(
        util.inspect(
            IK888.data,
            {
                depth:5,
                colors:true
            }
        )
    );

    IK888.on(
        'changed',
        updateSensor
    );

    setInterval(
        logSensor,
        1000
    );

    console.log('IK888 ready and running');
}

function GPSReady() {
    console.log('GPS Ready');
    console.log(
        util.inspect(
            GPS.data,
            {
                depth:5,
                colors:true
            }
        )
    );
    GPS.on(
        'changed',
        updateGPS
    );
    setInterval(
        logGPS,
        5000 //GPS can be slow causing empty lines in the CSV, so give it more time
    );
}

function updateSensor(data) {
    if(!timing.offset){
        return;
    }

    var timestamp = new Date().getTime()+timing.offset;


    if(!sensorData.data[timestamp]){
        sensorData.data[timestamp]={};
    }

    var row=sensorData.data[timestamp];
    row.timestamp=timestamp;

    row[
        IK888Map[
            data.key
        ]
    ]=Number(data.value);
}

//getting data form GPS, this function got really long.
//whart is row doing with the data?
/*

GPSData.data[data.timestamp] is:
GPSData:{
    14828blah:{
        ... gps stuff
    }

this all happens so fast the time stamp stays the same. so we use it as a "row" identifier for the csv

its just putting as much info into each timestamp key:value as possible so it can be converted to csv later.

*/

function updateGPS(data){
    if(!timing.currentGPSTime && data.key!='DateTime'){
        return;
    }
    
    var timestamp=new Date().getTime();
    if(!GPSData.data[timing.currentGPSTime]){
        GPSData.data[timing.currentGPSTime]={};
    }

    var row=GPSData.data[timing.currentGPSTime];

    switch(data.key){
        case 'Position':
            var location=data.Position.split('/');
            data.Position={
                lat:Number(location[0]),
                lon:Number(location[1]),
                alt:Number(location[2])
            }
            row.lat=data.Position.lat;
            row.lon=data.Position.lon;
            row.alt=data.Position.alt;
            break;
        case 'Velocity' :
            data.Velocity=Number(data.Velocity);
            row.velocity=data.Velocity;
            break;
        case 'Heading' :
            data.Heading=Number(data.Heading);
            row.heading=data.Heading;
            break;
            break;
        case "DateTime":
            var dateInfo = data.DateTime.split('/');
            date = new Date();
            date.setUTCFullYear(dateInfo[0], dateInfo[1]-1, dateInfo[2]);
            date.setUTCHours(dateInfo[3], dateInfo[4], dateInfo[5], dateInfo[6]);
            data.DateTime={
                full:date,
                year:Number(dateInfo[0]),
                month:Number(dateInfo[1]),
                day:Number(dateInfo[3]),
                hour:Number(dateInfo[4]),
                min:Number(dateInfo[5]),
                sec:Number(dateInfo[6]),
                timestamp:date.getTime()
            };
            timing.currentGPSTime=data.DateTime.timestamp;
            if(!timing.offset){
                timing.offset=data.DateTime.timestamp-timestamp;
            }

            if(!GPSData.data[timing.currentGPSTime]){
                GPSData.data[timing.currentGPSTime]={};
            }
            row=GPSData.data[timing.currentGPSTime];
            row.timestamp=data.DateTime.timestamp;

            break;
    }
}


function errorHandler(data){
    console.log('Somethings not right... ', data);
}

/*
* Connect to Phidget
*/
IK888.connect(
    {
        type    : 'PhidgetInterfaceKit'
    }
);

GPS.connect(
    {
        type    :'PhidgetGPS'
    }
);
