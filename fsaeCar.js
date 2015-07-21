var phidget = require('phidgetapi').phidget;

var IK888a=new phidget();
var IK888b=new phidget();

IK888a.on(
    "error",
    errorHandler
);

IK888b.on(
    "error",
    errorHandler
);

IK888a.on(
    'phidgetReady',
    readyHandlerA
);

IK888b.on(
    'phidgetReady',
    readyHandlerB
);

function updateHandler(data){
    console.log('phidget state changed');
    console.log('data ',data);
}

function readyHandlerA(){
    console.log('phidget A ready');
    console.log(IK888a.data);

    IK888a.on(
        'changed',
        updateHandler
    );
}

function readyHandlerB(){
    console.log('phidget B ready');
    console.log(IK888b.data);
}

function errorHandler(data){
    console.log('error ', data);
}

/*
* Connect to Phidget
*/
IK888a.connect(
    {
        type    : 'PhidgetInterfaceKit',
        boardID : 115576
    }
);
