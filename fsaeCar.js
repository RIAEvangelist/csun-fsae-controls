var phidget = require('phidgetapi').phidget;
var fs = require('fs');

var IK888 = new phidget();
var GPS = new phidget();


IK888.on(
    "error",
    errorHandler
);

IK888.on(
    'phidgetReady',
    readyHandlerA
);

GPS.on(
    'phidgetReady',
    readyHandlerG
);

GPS.on(
    "error",
    errorHandler
);

/* Analog input function and handlers*/

function readyHandlerA() {
    console.log('phidget A ready');
    console.log(IK888.data);

    IK888.on(
        'changed',
        updateHandler
    );
}

function updateHandler(data) {
    console.log('phidget state changed');
    console.log('data', data.value, '\n');
    data.boardType = 'IK888';
    data.timeStamp = new Date().getTime();
    fs.appendFile(
        'message.txt',
        '\n'+data.key,
        function (err) {
            if (err)throw err;
            console.log('logged');
        }
    );
}

/* GPS handler and functions*/

function readyHandlerG() {
    console.log('GPS Online');
    console.log(GPS.data);

    GPS.on(
        'changed',
        updateHandlerGPS
    );
}

function updateHandlerGPS(data){
    console.log('phidget state changed');
    console.log('data',data);
    data.boardType='PhidgetGPS';
    data.timeStamp=new Date().getTime();
    fs.appendFile(
        'GPSDATA.txt',
        '\n'+JSON.stringify(GPS.data),
        function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        }
    );
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
