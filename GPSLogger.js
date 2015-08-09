//Libraries
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
    console.log('look here!!');

    switch(data.key){
        case 'Position':
            var location=data.Position.split('/');
            data.Position={
                lat:Number(location[0]),
                lon:Number(location[1]),
                alt:Number(location[2])
            }
            break;
        case 'Velocity' :
            data.Velocity=Number(data.Velocity);
            break;
        case 'Heading' :
            data.Heading=Number(data.Heading);
            break;
    };
}


function logGPS(data) {

    fs.appendFile('logs/GPSData.txt', 'lol hello :)', function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
    }
                 );

}

//Error Handler
function errorHandler(data){
    console.log('Somethings not right... ', data);
}
