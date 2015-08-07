var phidget = require('phidgetapi').phidget;
var fs = require('fs');
var util = require('util');

var IK888 = new phidget();
var GPS = new phidget();

var GPSFile='logs/GPS'+new Date().getTime()+'.csv';
var sensorFile='logs/Sensor'+new Date().getTime()+'.csv';

var GPSData={
    header:['time','lat','lon','alt','heading','velocity'],
    data:{}
};

var sensorData={
    header:['time','Front Right','Front Left','Rear Right','Rear Left','throttle'],
    data:{}
};

IK888Map=[
    'frontLeft',    //0
    'frontRight',   //1
    'rearLeft',     //2
    'rearRight',    //3
    'throttle'      //4
];

fs.writeFile(
    GPSFile,
    GPSData.header+'\n',
    fileErr
);

fs.writeFile(
    sensorFile,
    sensorData.header+'\n',
    fileErr
);

function fileErr(err){
    if(!err){
        return;
    }

    try{
        fs.writeFile(
            'logs/err.txt',
            JSON.stringify(err)+'\n'
        );
    }catch(err){
        //damn... thats a bad err...
    }
}

function logGPS(){
    var csvData='';
    for(var i in GPSData.data){
        var data=GPSData.data[i];
        csvData+=
            [
                data.time,
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
        GPSFile,
        csvData
    );
}

function logSensor(){
    var csvData='';
    for(var i in sensorData.data){
        var data=sensorData.data[i];
        csvData+=
            [
                data.time,
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
        GPSFile,
        csvData
    );
}

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

/* Analog input function and handlers*/
function sensorReady() {
    console.log('phidget A ready');
    console.log(IK888.data);

    IK888.on(
        'changed',
        updateSensor
    );

    setInterval(
        logSensor,
        1000
    );
}

/* GPS handler and functions*/
function GPSReady() {
    GPS.on(
        'changed',
        updateGPS
    );
    setInterval(
        logGPS,
        1000
    );
}

function updateSensor(data) {
    data.boardType = 'IK888';
    data.timestamp = new Date().getTime();

    if(!sensorData.data[data.timestamp]){
        sensorData.data[data.timestamp]={};
    }

    var row=sensorData.data[data.timestamp];
    row.time=data.timestamp;

    row[
        IK888Map[
            data.key
        ]
    ]=Number(data.value);
}

function updateGPS(data){
    if(data.timestamp){
        data.GPSTime=data.timestamp;
    }

    data.timestamp=new Date().getTime();

    if(!GPSData.data[data.timestamp]){
        GPSData.data[data.timestamp]={};
    }

    var row=GPSData.data[data.timestamp];
    row.time=data.timestamp;
    if(data.GPSTime){
        row.time=data.GPSTime;
    }
    
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
                sec:Number(dateInfo[6])
            };
            row.time=data.GPSTime;
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
