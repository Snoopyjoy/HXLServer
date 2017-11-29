/**
 * Created by Jay on 15-3-29.
 */

var queryParams = parseUrlQueryString();

var WEEK_DAY_CN = [ '周日', '周一', '周二', '周三', '周四', '周五', '周六' ];

try {
    var now = Date.now();
} catch (err) {
    Date.now = function() {
        return new Date().getTime();
    }
}

if (!Object.prototype.hasOwnProperty) {
    Object.prototype.hasOwnProperty = function(key) {
        return this[key] != null && this[key] != undefined;
    }
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError(" this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0; // Hack to convert O.length to a UInt32
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }
        if (thisArg) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt) return from;
        }
        return -1;
    };
}

if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+/g, "");
    }
}

String.prototype.fillData = function(key, value) {
    return this.replace(new RegExp("\\{" + key + "\\}", "g"), value);
}

String.prototype.hasValue = function() {
    return this != "undefined" && this != "null" && this != "";
}

String.prototype.getSize = function(fontSize) {
    var span = document.getElementById("__getwidth");
    if (span == null) {
        span = document.createElement("span");
        span.id = "__getwidth";
        //var div = document.createElement("div");
        //div.id = "__getwidthDiv";
        //span.style.overflow = "hidden";
        document.body.appendChild(span);
        //div = document.getElementById("__getwidthDiv");
        //div.appendChild(span);
        span.style.visibility = "hidden";
        span.style.whiteSpace = "nowrap";
    }
    span.innerText = this;
    span.style.fontSize = fontSize + "px";

    return { width: span.offsetWidth, height: span.offsetHeight };
}

function dec2bin(num){
    if(isNaN(num))return;
    return parseInt(num,10).toString(2);
}

function trace(str) {
    if (window.console && window.console.log) {
        window.console.log(str);
    }
}

function hashMapToArray(map, json, loopFunc) {
    var list = [];
    for (var key in map) {
        var obj = json ? JSON.parse(map[key]) : map[key];
        list.push(obj);
        if (loopFunc != null) {
            loopFunc(obj, key, map);
        }
    }
    return list;
}

var isIE = $checkIsIE();
var IE_VER = 0;
var isBelowIE10 = $checkIsBelowIE10();
var broswerType = $checkBroswer();
var isMobile = $checkIsMobile();

function $checkIsIE() {
    try {
        var temp = navigator.userAgent.split(";")[1].replace(/[ ]/g,"");
        if (temp.indexOf("MSIE") == 0) {
            return true;
        } else {
            if (navigator.userAgent.indexOf('Trident') > 0 && navigator.userAgent.indexOf('rv:11') > 0) {
                return true;
            }
            return false;
        }
    } catch (err) {
        return false;
    }
}

function $checkIsBelowIE10() {
    if (isIE) {
        var temp = navigator.userAgent.split(";")[1].replace(/[ ]/g,"");
        IE_VER = parseInt(temp.replace('MSIE', ''));
        return IE_VER < 10;
    }
    return false;
}

function $checkBroswer() {
    if(navigator.userAgent.indexOf('Trident') > 0 && navigator.userAgent.indexOf('rv:11') > 0) {
        return "IE";
    }
    if(navigator.userAgent.indexOf("MSIE")>0) {
        return "IE";
    }
    if(navigator.userAgent.indexOf("Firefox")>0){
        return "Firefox";
    }
    if(navigator.userAgent.indexOf("Chrome")>0){
        return "Chrome";
    }
    if(navigator.userAgent.indexOf("Safari")>0) {
        return "Safari";
    }
    return "未知浏览器";

}

function $checkIsMobile() {
    try {
        var u = navigator.userAgent.toLowerCase();
        trace('navigator.userAgent ==> ' + u);
        //var mobile = !!u.match(/AppleWebKit.*Mobile.*/i) || !!u.match(/AppleWebKit/i); //是否为移动终端
        var mobile = u.match(/Mobile/i) !== null ? true : false; //是否为移动终端
        trace('mobile ==> ' + mobile);
        var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i); //ios终端
        trace('ios ==> ' + ios);
        var android = u.indexOf('android') > -1 || u.indexOf('linux') > -1; //android终端或者uc浏览器
        trace('android ==> ' + android);
        var iPhone = u.indexOf('iphone') > -1 || u.indexOf('mac') > -1; //是否为iPhone或者QQHD浏览器
        trace('iphone ==> ' + iPhone);
        var iPad = u.indexOf('ipad') > -1; //是否iPad
        trace('ipad ==> ' + iPad);

        return mobile || ios || android || iPhone || iPad;
    } catch (err) {
        return false;
    }
}

var fpver = getFlashVersion();

function getFlashVersion(){
    try {
        try {
            // avoid fp6 minor version lookup issues
            // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
            var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
            try { axo.AllowScriptAccess = 'always'; }
            catch(e) { return '6,0,0'; }
        } catch(e) {}
        return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
        // other browsers
    } catch(e) {
        try {
            if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
                return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
            }
        } catch(e) {}
    }
    return '0,0,0';
}

function parseUrlQueryString(){
    var vars = {}, hash;
    var url = window.location.href;
    if (url.indexOf('#') > 0) {
        url = url.substring(0, url.lastIndexOf('#'));
    }
    var index = url.indexOf('?');
    if (index < 0) return vars;


    var hashes = url.slice(index + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        //vars.push(hash[0]);
        if (!hash[0] || hash[0] == "" || hash[0] == "null") continue;
        vars[hash[0]] = decodeURIComponent(hash[1]);
    }
    return vars;
}


function convertTimeToDate(time, toTime, lang, flag) {
    var date = new Date();
    date.setTime(time);
    if( !flag ){
    	flag = "-";
    }
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var str = lang == "en" ? date.getFullYear() + flag + (m >= 10 ? m : ('0' + m)) + flag + (d >= 10 ? d : ('0' + d)) : date.getFullYear() + "年" + (m >= 10 ? m : ('0' + m)) + "月" + (d >= 10 ? d : ('0' + d)) + "日";
    if (toTime) {
        str += " " + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    }
    return str;
}

function convertTimeToTime(time) {
    var date = new Date();
    date.setTime(time);
    var str = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    return str;
}

function convertStringToTime(str) {
    str = str.replace(/\./img, '-');
    var dt = new Date();
    var arr = str.trim().split(" ");
    var dateArr = arr[0].split("-");
    dt.setFullYear(Number(dateArr[0]));
    dt.setMonth(Number(dateArr[1]) - 1);
    dt.setDate(Number(dateArr[2]));

    if (arr.length > 1) {
        var timeArr = arr[1].split(":");
        dt.setHours(Number(timeArr[0]));
        if (timeArr.length > 1) {
            dt.setMinutes(Number(timeArr[1]));
        } else {
            dt.setMinutes(0);
        }
        if (timeArr.length > 2) {
            dt.setSeconds(Number(timeArr[2]));
        } else {
            dt.setSeconds(0);
        }
    } else {
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
    }

    dt.setMilliseconds(0);

    return dt;
}

function convertStringToTimeSec(str) {
    var dt = convertStringToTime(str);
    return dt.getTime() / 1000;
}

function getDateTimeFromNow(val) {
    var now = Date.now();
    var passed = (now - val) / 1000;
    if (passed <= 0) return '现在';

    if (passed < 60) return Math.round(passed) + '秒前';
    if (passed >= 60 && passed < 3600) return Math.floor(passed / 60) + '分钟前';
    if (passed >= 3600 && passed < 86400) return Math.floor(passed / 3600) + '小时前';
    if (passed >= 86400) return Math.floor(passed / 86400) + '天前';
    if (passed >= 604800) return convertTimeToDate(val, false);
}

function convertSecToTimeStr(val, lang, allShow) {
    var str = '';
    var min = Math.floor(val / 60);
    var sec = val - min * 60;
    if (sec > 0) {
        str = (sec >= 10 ? sec : ('0' + sec)) + (lang == 'en' ? '' : '秒');
    } else {
        str = '';
    }
    var hour = Math.floor(min / 60);
    min = min - hour * 60;
    if (min > 0 || allShow) str = (min >= 10 ? min : ('0' + min)) + (lang == 'en' ? ':' : '分') + str;
    if (hour > 0 || allShow) str = (hour >= 10 ? hour : ('0' + hour)) + (lang == 'en' ? ':' : '小时') + str;
    return str;

}

function sortArrayByNumber(arr, field, order) {
    if (isNaN(order)) order = 1;
    arr.sort(function(value1, value2){
        if(value1[field] > value2[field]){
            return order * -1;
        } else if(value1[field] < value2[field]){
            return order * 1;
        } else{
            return 0;
        }
    } );
}

function getStageWidth() {
    if (isIE && IE_VER <= 8) {
        return document.documentElement.clientWidth;
    }
    var w = window.innerWidth;
    if (isNaN(w)) w = document.documentElement.scrollWidth;
    return w;
}

function getStageHeight() {
    if (isIE && IE_VER <= 8) {
        return document.documentElement.clientHeight;
    }
    var h = window.innerHeight;
    if (isNaN(h)) h = document.documentElement.scrollHeight;
    return h;
}

function goPage(url) {
    if(queryParams["type"] == 'boom') {
        window.location.href = url + "?type=boom";
    }
    else{
        window.location.href = url;
    }
}

function goPageWithArgs(url, args) {
	/*if( url.indexOf(".html") < 0 ){
		url +=".html";
	}*/
    if (args) {
        var temp = [];
        for (var key in args) {
            temp.push(key + "=" + args[key]);
        }
        if (temp.length > 0) {
            url += (url.indexOf("?") > 0 ? "&" : "?") + temp.join('&');
        }
    }
    //url = wrapperUrl(url);
    window.location.href = url;
}

function wrapperUrl(url) {
    url = url || '/';
    if (url.indexOf("http") != 0 && window.SITE_DOMAIN) {
        var domain = window.SITE_DOMAIN;
        if (url.indexOf("/") == 0 && domain.substr(domain.length - 1, 1) == "/") {
            domain = domain.substr(0, domain.length - 1);
        }
        url = domain + url;
    }
    return url;
}

function newPage(url) {
    url = url || '/';
    window.open(url);
}

var LOGIN_STATE_EXPIRE_TIME = 1;  //day

function $login(sess) {
    $setCookie('userid', sess.userid, LOGIN_STATE_EXPIRE_TIME);
    $setCookie('token', sess.token, LOGIN_STATE_EXPIRE_TIME);
    $setCookie('tokentimestamp', sess.tokentimestamp, LOGIN_STATE_EXPIRE_TIME);
    $setCookie('platform', sess.platform, LOGIN_STATE_EXPIRE_TIME);
}

function $logout() {
    var logoutPage = arguments[0];
    if (!logoutPage) logoutPage = '/';
    $callAPI('user.logout', {}, function() {
        goPage(logoutPage);
        $cleanUserSession();
    }, function() {
        goPage(logoutPage);
        $cleanUserSession();
    });
}

function $cleanUserSession() {
    $delCookie('userid');
    $delCookie('token');
    $delCookie('tokentimestamp');
    $delCookie('platform');
}

function $getCookie(key) {
    var opt = { };
    if (window.COOKIE_PATH) opt.path = window.COOKIE_PATH;
    return $.cookie(key, undefined, opt);
}

function $setCookie(key, val, expire) {
    var opt = { };
    if (window.COOKIE_PATH) opt.path = window.COOKIE_PATH;
    if (Number(expire) > 0) {
        opt.expires = expire;
    }
    $.cookie(key, val, opt);
}

function $delCookie(key) {
    var opt = { };
    if (window.COOKIE_PATH) opt.path = window.COOKIE_PATH;
    $.removeCookie(key, opt);
}

function $callAPILazy(method, data, onSuccess, onError, showLoading) {
    if (showLoading && window.$callAPILoading) {
        window.$callAPILoading(true);
    }
    setTimeout(function() {
        $callAPI(method, data, onSuccess, onError, showLoading);
    }, 300 + Math.random() * 700);
}

function $callAPIStack(reqs, onSuccess, onError, showLoading) {
    var CODE;
    var MSG;

    if (showLoading && window.$callAPILoading) {
        window.$callAPILoading(true);
    }

    var doNext = function() {
        if (reqs.length == 0) {
            if (CODE > 1) {
                if (onError) onError(CODE, MSG);
            } else {
                if (onSuccess) onSuccess();
            }

            if (showLoading && window.$callAPILoading) {
                window.$callAPILoading(false);
            }
        } else {
            var workingReq = reqs.shift();
            if (!workingReq[1]) workingReq[1] = {};
            $callAPI(workingReq[0], workingReq[1], function(data) {
                if (workingReq[2]) workingReq[2](data);
                doNext();
            }, function(code, msg) {
                CODE = code;
                MSG = msg;
                if (workingReq[3]) workingReq[3](code, msg);
                doNext();
            });
        }
    }
    doNext();
}

function $callAPI(method, data, onSuccess, onError, showLoading) {
    trace('>> request send ==> ' + method);
    if (showLoading && window.$callAPILoading) {
        window.$callAPILoading(true);
    }

    if (!data) data = {};
    for (var key in data) {
        if (typeof data[key] == 'object') {
            data[key] = JSON.stringify(data[key]);
        }
    }

    var params = {};
    params.method = method;
    params.data = data;
    $.ajax({
        type: "post",
        url: API_GATEWAY,
        dataType: "json",
        data: params,
        success: function (data, status, xhr) {
            if (data.code == 1) {
                if (onSuccess) {
                    onSuccess(data.data);
                }
            } else {
                trace('API调用错误 ==> [' + data.code + '] - ' + data.msg);
                if (onError) {
                    onError(data.code, data.msg);
                }
            }

            if (showLoading && window.$callAPILoading) {
                window.$callAPILoading(false);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            trace('API调用错误 ==> status: ' + textStatus + '      error: ' + errorThrown);

            if (showLoading && window.$callAPILoading) {
                window.$callAPILoading(false);
            }
        }
    });
}

function $generateDownloadToken(key, callBack) {
    $callAPI('system.generateDownloadToken', { domain:OSS_PRIVATE_DOMAIN, key:key }, function(data) {
        callBack(data.url);
    });
}

function $elemntRect(ele, key) {
    return parseInt(ele.css(key).replace('px', ''));
}

var $formValidator = {

    //验证邮箱地址
    emailCheck: function(str) {
        if (!str || !String(str).hasValue()) return false;
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        return re.test(str);
    },

    //验证电话号码，手机或座机
    phoneCheck: function(str){
        if (!str || !String(str).hasValue()) return false;
        var re = /^1\d{10}$/;
        if (!re.test(str)) {
            re = /^0\d{2,3}-?\d{7,8}$/;
            return re.test(str);
        } else {
            return true;
        }
    },

    //验证中国大陆手机号码
    cnCellPhoneCheck: function(str){
        if (!str || !String(str).hasValue()) return false;
        var re = /^1\d{10}$/;
        return re.test(str);
    }

};

function showModal(eleID, opts, closeCallBack) {
    var params = opts;
    if (!params) {
        params = { backdrop: 'static', keyboard:false };
    }
    $('#' + eleID).modal(params);

    if (closeCallBack) {
        $('#' + eleID).on('hide.bs.modal', closeCallBack);
    }
}

function closeModal(eleID, destory) {
    if (destory) {
        $('#' + eleID).on('hidden.bs.modal', function(){
            $(this).data('modal', null);
        });
    }
    $('#' + eleID).modal('hide');
}

function showEmptyDialog(content, closeCallBack, option) {
    var template = '<div class="modal fade" id="dialog_{0}" tabindex="-1" role="dialog" aria-hidden="true">\
            <div class="modal-dialog" style="width: {1}px;">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <button {4} type="button" class="close" data-dismiss="modal" aria-hidden="true"> &times; </button> \
                        <h5 class="modal-title">{2}</h5>\
                    </div>\
                    <div class="row">\
                        <div class="col-sm-12 center_layout">\
                            <div class="col-sm-12">\
                                {3}\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>';

    if (!option) option = {};
    if (!option.hasOwnProperty('title')) option.title = '提示';
    if (!option.hasOwnProperty('width')) option.width = 500;
    if (!option.hasOwnProperty('showClose')) option.showClose = true;

    var cid = Date.now() + '' + parseInt(1000 * Math.random());
    cid = option.id ? option.id : cid;

    var ele = template;
    ele = ele.fillData(0, cid);
    ele = ele.fillData(1, option.width);
    ele = ele.fillData(2, option.title);
    ele = ele.fillData(3, content);
    ele = ele.fillData(4, option.showClose ? '' : 'style="display: none;"');
    $('body').append($(ele));

    showModal('dialog_' + cid, option.modalOption);

    ele = $('#dialog_' + cid);

    ele.on('hidden.bs.modal', function () {
        ele.remove();
        if (closeCallBack != null && closeCallBack != undefined) closeCallBack();
    });

    return ele;
}

function isDiffDate(time1, time2) {
    var dt1 = new Date();
    dt1.setTime(time1);

    var dt2 = new Date();
    dt2.setTime(time2);
    return dt1.getDate() != dt2.getDate();
}

function randomString(len) {
    var parts = [
        [ 48, 57 ], //0-9
        [ 65, 90 ], //A-Z
        [ 97, 122 ]  //a-z
    ];

    var pwd = "";
    for (var i = 0; i < len; i++)
    {
        var part = parts[Math.floor(Math.random() * parts.length)];
        //trace(part[0], part[1], Math.floor(Math.random() * (part[1] - part[0])));
        var code = part[0] + Math.floor(Math.random() * (part[1] - part[0]));
        var c = String.fromCharCode(code);
        pwd += c;
    }
    return pwd;
}


function showConfirm(content, yesCallBack, noCallBack, option) {
    var template = '<div class="modal fade" id="confirmModal_{0}" tabindex="-1" role="dialog" aria-hidden="true">\
            <div class="modal-dialog" style="width: {1}px;">\
                <div class="modal-content">\
                    <div class="modal-header">\
                        <h4 class="modal-title">{2}</h4>\
                    </div>\
                    <div class="row">\
                        <div class="col-sm-12 center_layout">\
                            <div class="col-sm-12 center_layout">\
                                <div class="confirm_modal_content">{3}</div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="modal-footer center_layout">\
                        <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>\
                        <button type="button" class="btn btn-danger" data-dismiss="modal">取消</button>\
                    </div>\
                </div>\
            </div>\
        </div>';

    if (!option) option = {};
    if (!option.hasOwnProperty('title')) option.title = '提示';
    if (!option.hasOwnProperty('width')) option.width = 480;
    if (!option.hasOwnProperty('showClose')) option.showClose = true;

    var cid = Date.now() + '' + parseInt(1000 * Math.random());
    cid = option.id ? option.id : cid;

    var ele = template;
    ele = ele.fillData(0, cid);
    ele = ele.fillData(1, option.width);
    ele = ele.fillData(2, option.title);
    ele = ele.fillData(3, content);
    $('body').append($(ele));

    showModal('confirmModal_' + cid, option.modalOption);

    ele = $('#confirmModal_' + cid);

    ele.on('hidden.bs.modal', function () {
        ele.remove();
    });
    if (option.hasOwnProperty('yesButtonLabel')) $(ele.find('.modal-footer .btn-primary')[0]).html(option.yesButtonLabel);
    if (option.hasOwnProperty('noButtonLabel')) $(ele.find('.modal-footer .btn-danger')[0]).html(option.noButtonLabel);

    if (yesCallBack != null && yesCallBack != undefined) $(ele.find('.modal-footer .btn-primary')[0]).click(yesCallBack);
    if (noCallBack != null && noCallBack != undefined) $(ele.find('.modal-footer .btn-danger')[0]).click(noCallBack);
    return ele;
}

function showMessage(type, text, opt) {
    switch (type) {
        case 1:
            type = "success";
            break;
        case 2:
            type = "info";
            break;
        case 3:
            type = "warning";
            break;
        case 4:
            type = "danger";
            break;
    }
    opt = opt ? opt : {
        align: 'center',
        ele: 'body', // which element to append to
        offset: {from: 'top', amount: 240}, // 'top', or 'bottom'
        delay: 4000,
        allow_dismiss: true
    };
    opt.type = type;
    opt.width = 'auto';
    $.bootstrapGrowl(text, opt);
}

var $preinitedCallBackStack = [];
var $initedCallBackStack = [];

$(function() {
    $preinitedCallBackStack.forEach(function(obj) {
        if (obj.func) {
            obj.func.apply(this, ( obj.args ? obj.args : [] ));
        }
    });
    if (window['$inited'] != null && window['$inited'] != undefined) {
        window['$inited']();
    }
    $initedCallBackStack.forEach(function(obj) {
        if (obj.func) {
            obj.func.apply(this, ( obj.args ? obj.args : [] ));
        }
    });
});