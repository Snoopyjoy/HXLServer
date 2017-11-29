/**
 * Created by hxl on 2017/8/31.
 */

var weatherInfo = {};
var lastTime = 1800000;//保存时间（毫秒） 半个小时
exports.getWeather = function(callback) {

    if( weatherInfo.info && ( Date.now() - weatherInfo.timeStamp) < lastTime ){
        var lastDate = new Date( weatherInfo.timeStamp );
        var now = new Date();
        if( lastDate.getDate() == now.getDate() ){//当天
            return callback&&callback( null , weatherInfo.info);
        }
    }
    var appCode = "c42182f385a740bd9eead7ae0d3f5089";
    var reqAddr = "http://jisutianqi.market.alicloudapi.com/weather/query";
    var request = require('request');
    var querystring = require('querystring').stringify( {citycode:"101020100"} );//上海
    var options={
        url:reqAddr + "?" +querystring,
        headers: {"Authorization":"APPCODE " + appCode}
    }
    request( options, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            if( info.msg == "ok" ){
                var result = {
                    img:info.result.img,
                    temphigh:info.result.temphigh,
                    templow:info.result.templow
                }
                weatherInfo.info = result;
                weatherInfo.timeStamp = Date.now();
                callback&&callback( null , result);

            }else{
                callback&&callback( "获取天气失败");
            }
        }else{
            callback&&callback( "获取天气失败");
        }
    } );
}