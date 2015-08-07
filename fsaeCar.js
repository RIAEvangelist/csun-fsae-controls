var phidget = require('phidgetapi').phidget;
var fs = require('fs');
var util = require('util');

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
        '\n'+data.key + '   ' + data.value+ '   ' +data.timeStamp);
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
    
    switch(data.key){
        case 'Position':
            var location=data.Position.split('/');
            data.Positionlat=Number(location[0]);
            data.Positionlon=Number(location[1]);
            data.Positionalt=Number(location[2]);
            break;
        case 'Velocity' :
            data.Velocity=Number(data.Velocity);
            break;
        case 'Heading' :
            data.Heading=Number(data.Heading);
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
            break;
    }
    data.boardType='PhidgetGPS';
    
    if(!data.timestamp){
        data.timestamp=new Date().getTime();
    }
    
    console.log(
        util.inspect(
            data, 
            { 
                depth: 5,
                colors:true
            }
        )
    );
    // Weird "undefined" messages are attached to output from GPS
    fs.appendFile(
        'GPSDATA.txt',
            ' \n'+ data.Positionlat+
            '   ' +  data.Positionlon +
            '   ' +  data.Positionalt +
            '   ' +  data.Velocity +
            '   ' + data.timestamp
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
