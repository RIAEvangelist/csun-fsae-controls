var phidget = require('phidgetapi').phidget;
var fs=require('fs');

var IK888=new phidget();


IK888.on(
    "error",
    errorHandler
);

IK888.on(
    'phidgetReady',
    readyHandlerA
);



function updateHandler(data){
    console.log('phidget state changed');
    console.log('data ',data);
    data.boardType='IK888';
    data.timeStamp=new Date().getTime();
    fs.appendFile(
        'message.txt',
        '\n'+JSON.stringify(data),
        function (err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        }
    );
}

function readyHandlerA(){
    console.log('phidget A ready');
    console.log(IK888.data);

    IK888.on(
        'changed',
        updateHandler
    );
}


function errorHandler(data){
    console.log('error ', data);
}

/*
* Connect to Phidget
*/
IK888.connect(
    {
        type    : 'PhidgetInterfaceKit'
    }
);
