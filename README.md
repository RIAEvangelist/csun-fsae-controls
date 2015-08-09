# Control and data acquisition for CSUN fsae race car
This is just a prototype to get things started.


This project is licensed with the [DBAD](https://github.com/RIAEvangelist/csun-fsae-controls/blob/master/license.md) Public license.

#Configs
###logs
`logConfig` is used to control `prod` and `dev` log storage paths.

|key|value|description|
|---|---|---|
|isDev|*bool* false|if set to true will use the dev paths instead of the prod paths.|
|prod|*object* production log file paths||
|dev|*object* development log file paths| used primarily if logging to BBB SD card in prod, this will allow storing of files locally on dev machine.|

*example :*

    var logConfig={
        isDev:false, //if true logs to dev paths instead of prod paths
        prod:{
            GPSFile     :'/media/9016-4EF8/logs/GPS'+new Date().getTime()+'.csv',
            sensorFile  :'/media/9016-4EF8/logs/Sensor'+new Date().getTime()+'.csv',
            error       :'/media/9016-4EF8/logs/err'+new Date().getTime()+'.txt'
        },
        dev:{
            GPSFile     :'./logs/GPS'+new Date().getTime()+'.csv',
            sensorFile  :'./logs/Sensor'+new Date().getTime()+'.csv',
            error       :'./logs/err'+new Date().getTime()+'.txt'
        }
    }

#Timing
The BBB does not have a real time clock to keep track of time while powered off. This leads to time shifts which could create issues in your data telemetry.

For this we have used the Phidgets GPS to capture time from the GPS satelites and determine the offset time from the local system. No logging will commense until a time differential has been determined.