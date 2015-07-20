var phidget = require('phidgetapi').phidget;

var IK888=new phidget();

IK888.on(
    "error",
    function(data){
        console.log('error ',data);
    }
);

IK888.on(
    'phidgetReady',
    function(){
        console.log('phidget ready');
        console.log(phidget.data);

        IK888.set(
            {
                type:'Output',
                key:'0',
                value:'1'
            }
        );

        IK888.on(
            'changed',
            update
        );
    }
);

var update=function(data){
    console.log('phidget state changed');
    console.log('data ',data);

    if(data.type=='Sensor'){
        IK888.set(
            {
                type:'Output',
                key:'0',
                value:'1'
            }
        );
        setTimeout(
            function(){
                phidget.set(
                    {
                        type:'Output',
                        key:'0',
                        value:'0'
                    }
                );
            },
            200
        );
    }
}

/*
* Connect to Phidget
*/
IK888.connect(
    {
        type    : 'PhidgetInterfaceKit'
    }
);
