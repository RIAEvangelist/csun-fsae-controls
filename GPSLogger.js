//Modules thise are not libraries, but rather node.js modules they could include libraries, Classes, objects, native functionality etc.
var phidget = require('phidgetapi').phidget;
var fs = require('fs');

//Global Variables
var GPS=new phidget();

//Creating headers
var GPSData={
    header:['time','lat','lon','alt','heading','velocity'],
    data:{}
};

//Connecting GPS
GPS.connect(
    {
        type    :'PhidgetGPS'
    }
);

//On Calls
GPS.on(
    'phidgetReady',
    GPSReady
);

GPS.on(
    "error",
    errorHandler
);

//Initialization of GPS
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

function updateGPS(data){


    //console.log(data);
    switch(data.key){
        case 'Position':
            var location=data.Position.split('/');
            data.Position={
                lat:Number(location[0]),
                lon:Number(location[1]),
                alt:Number(location[2])
            }
            GPSData.lat = data.Position.lat;
            GPSData.lon = data.Position.lon;
            GPSData.alt = data.Position.alt;
            break;
        case 'Velocity' :
            data.Velocity=Number(data.Velocity);
            GPSData.velocity = data.Velocity;
            break;
        case 'Heading' :
            data.Heading=Number(data.Heading);
            GPSData.heading = data.Heading;
            break;
        case 'DateTime' :
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
                    milisec:Number(dateInfo[7]),
                    timestamp:date.getTime()
            };
            console.log(data.DateTime);
            break;
    };

}


function logGPS() {

//    fs.appendFile('/media/9016-4EF8/logs/GPSData.txt', GPSData.timeStamp + ' ', function (err) {
//        if (err) throw err;
//    }
//                 );
//
//        fs.appendFile('/media/9016-4EF8/logs/GPSData.txt', GPSData.lat + ' ', function (err) {
//        if (err) throw err;
//    }
//                 );
//
//        fs.appendFile('/media/9016-4EF8/logs/GPSData.txt', GPSData.lon + ' ', function (err) {
//        if (err) throw err;
//    }
//                 );
//
//        fs.appendFile('/media/9016-4EF8/logs/GPSData.txt', GPSData.alt + ' ', function (err) {
//        if (err) throw err;
//    }
//                 );
//
//        fs.appendFile('/media/9016-4EF8/logs/GPSData.txt', GPSData.velocity + '\n' , function (err) {
//        if (err) throw err;
//    }
//                 );

}

//Error Handler
function errorHandler(data){
    console.log('Somethings not right... ', data);
}
