var Phidget = require('phidgetapi').InterfaceKit;
var fs = require('fs');
var util = require('util');
var IK = new Phidget;

IK.observeOutputs(outputs);
IK.observeInputs(inputs);
IK.observeSensors(sensors);
IK.observeRawSensors(rawSensors);

IK.phidget.on(
    'phidgetReady',
    init
);

IK.phidget.connect();

function init(){
    //do some initial set up here... like blinking an led.
//    setInterval(
//        function(){
//            if(IK.outputs[0]==0){
//                IK.outputs[0]=1;
//            }else{
//                IK.outputs[0]=0;
//            }
//        },
//        1000
//    );
}


function sensors(changes){

    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }


    //see updated IK data after all changes
    //console.log(JSON.stringify(IK.sensors[0]));

//    do something with the sensor info like turn another LED on.
//    if(IK.sensors[7]>500){
//        IK.outputs[1]=1;
//    }else{
//        IK.outputs[1]=0;
//    }
}

function rawSensors(changes){

    var lbs;
    var area = 0.836; //in^2
    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }
        lbs =  (0.13 * Math.pow( 2.718282, (0.0009 * IK.rawSensors[0]))  );

        //see updated IK data after all change
        console.log(lbs);

}

function outputs(changes){
    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }

    //see updated IK data after all changes
   // console.log('Outputs',IK.outputs);
}

function inputs(changes){
//    for(var i in changes){
//        var change=changes[i];
//        //see specific info about each change
//        //console.log(change);
//    }
//
//    //see updated IK data after all changes
//    console.log('Inputs',IK.inputs[0]);
}
