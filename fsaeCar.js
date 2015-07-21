var phidget = require('phidgetapi').phidget;

var IK888=new phidget();

IK888.on(
    "error",
    function(data){
        console.log('error ', data);
    }
);

IK888.on(
    'phidgetReady',
    function(){
        console.log('phidget ready');
        console.log(phidget.data);

        IK888.on(
            'changed',
            update
        );
    }
);

function update(data){
    console.log('phidget state changed');
    console.log('data ',data);
}

/*
* Connect to Phidget
*/
IK888.connect(
    {
        type    : 'PhidgetInterfaceKit'
    }
);
