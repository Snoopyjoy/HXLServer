const rpio = require('rpio');
rpio.init({gpiomem:false});
rpio.init({mapping:'gpio'});

const LEFT_0 = 17;
const LEFT_1 = 27;
const LEFT_S = 22;
const RIGHT_0 = 23;
const RIGHT_1 = 24;
const RIGHT_S = 25;
const PWM_RATE = 64;    //19.2MHz 除以这个数就是刷新率 19.2MHz/64 = 300kHz; Set PWM refresh rate to 300kHz
const PULSE_WIDTH = 1024;
const LT = "left";
const RT = "right";
var speed = 1;

function TankController(){

}

proto  = TankController.prototype;

proto.init = function(){
    rpio.pwmSetClockDivider(PWM_RATE);
    rpio.open(LEFT_0, rpio.OUTPUT, rpio.LOW);
    rpio.open(LEFT_1, rpio.OUTPUT, rpio.LOW);
    rpio.open(LEFT_S, rpio.PWM);
    rpio.pwmSetRange(LEFT_S, PULSE_WIDTH);
    rpio.pwmSetData(LEFT_S, 0);

    rpio.open(RIGHT_0, rpio.OUTPUT, rpio.LOW);
    rpio.open(RIGHT_1, rpio.OUTPUT, rpio.LOW);
    rpio.open(RIGHT_S, rpio.PWM);
    rpio.pwmSetRange(RIGHT_S, PULSE_WIDTH);
    rpio.pwmSetData(RIGHT_S, 0);
}

proto.reset = function(){
    speed = 0;
}

proto.move = function( angle ){
    var _speed = 1;
    if( angle > -90 && angle <= -45 ){
        _speed = 1 - Math.abs( (angle + 90) / 45 );
        this.setPin( LT, 1, 1 );
        this.setPin( RT,1, speed);
    }else if( angle >= -45 && angle <=0 ){
        _speed = 1 + angle/ 45;
        this.setPin( LT, 1 ,1 );
        this.setPin( RT, 2 ,speed );
    }else if( angle > 0  && angle <=45 ){
        _speed = 1 - angle/45;
        this.setPin( LT, 2 ,1 );
        this.setPin( RT, 1 ,_speed );
    }else if( angle > 45 && angle <= 90 ){
        _speed = 1 + (angle - 90)/45;
        this.setPin( LT, 2 , 1 );
        this.setPin( RT, 2 , _speed );
    }else if(angle > 90 && angle < 135 ){
        _speed = (135 - angle)/45;
        this.setPin(LT,2,_speed);
        this.setPin(RT,2,1)
    }else if( angle >= 135 && angle < 180  ){
        _speed = 1 -  (180 - angle)/45;
        this.setPin(LT,1,_speed);
        this.setPin(RT,2,1)
    }else if( angle <= -90 && angle > -135){
        _speed = (angle + 135)/45;
        this.setPin( LT,1,_speed );
        this.setPin( RT,1,1 );
    }else if( angle >=-135 && angle <= -180 ){
        _speed = 1 - (angle + 180)/45 ;
        this.setPin( LT,2,_speed );
        this.setPin( RT,1,1 );
    }
}

proto.stop = function(){

}

proto.setData = function(){

}

proto.setPin = function( pin , value, speed ){
    if( pin == LT ){

    }else{

    }
}

proto.getHighWidth = function(){
    return
}

module.exports = TankController;