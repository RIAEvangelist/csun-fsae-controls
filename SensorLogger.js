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


}


function sensors(changes){
    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }
}


function rawSensors(changes){

    var lbs;
    var area = 0.836; //in^2
    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }
        //lbs =  (0.13 * Math.pow( 2.718282, (0.0009 * IK.rawSensors[0]))  );  Exponential Curve fit, f(x) > 0.1 lbs
        lbs =  ((0.00000077912 * (IK.rawSensors[0] * IK.rawSensors[0] )) - (0.00247485588 * IK.rawSensors[0]) + 2.52329520725);  // Poly Curve fit
                                                                                                            // 0.5lbs < f(x) < 1.7 lbs
        //see updated IK data after all change
        console.log(lbs);

}

function outputs(changes){
    for(var i in changes){
        var change=changes[i];
    }

}

function inputs(changes){
    for(var i in changes){
        var change=changes[i];
        //see specific info about each change
        //console.log(change);
    }

    //see updated IK data after all changes
    //console.log('Inputs',IK.inputs);
}

