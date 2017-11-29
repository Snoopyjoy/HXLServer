$user.balance = -1;

$user.heartbeat = function(callBack) {
    $callAPI('user.heartbeat', {}, function(data) {
        $login(data);
        trace("I'm alive :)    ---> " + data.time + "->" + data.userid);
    });
};
//每4分-4分半钟时间触发一次心跳
setInterval($user.heartbeat, Math.round(4 * 60 * 1000 + (Math.random() * 30 * 1000)));
//setInterval($user.heartbeat, 1000);
$user.getBalance = function() {
    var instance = this;
    var callBack = arguments[0];
    $callAPI("user.getBalance", { }, function(data) {
        instance.balance = data.balance;
        instance.notify("getBalance", data);
        if (callBack) callBack(data.balance);
    });
};

$user.checkBonusNews = function(ids, callBack) {
    if (!this.isLogined) {
        callBack([]);
        return;
    }
    $callAPI("data.checkBonusNews", { ids:ids.join(",") }, function(data) {
        if (callBack) callBack(data);
    });
};

$user.checkBoomNewsVisible = function(ids, callBack) {
    if (!this.isLogined) {
        callBack({});
        return;
    }
    $callAPI("data.checkBoomNewsVisible", { ids:ids.join(",") }, function(data) {
        if (callBack) callBack(data);
    });
};

var $resizeHandlers = [];

$(function() {
    $(window).resize(function() {
        $forceResize();
    });
});

function $addResizeHandler(func) {
    $resizeHandlers.push(func);
}

function $forceResize() {
    var w = getStageWidth();
    var h = getStageHeight();
    if ($resizeHandlers) {
        $resizeHandlers.forEach(function(handler) {
            if (handler) handler(w, h);
        });
    }
}

function $sendSMSCode(btn, phone, type, callBack) {
    btn.button('loading');

    var docBtn = btn[0];
    clearInterval(docBtn.cdTimer);

    var cdFunc = function() {
        docBtn.cd --;
        if (docBtn.cd > 0) {
            btn.html('已发送 (' + docBtn.cd + ')');
        } else {
            clearInterval(docBtn.cdTimer);
            delete docBtn['cd'];
            delete docBtn['cdTimer'];
            btn.button('reset');
        }
    }

    $callAPI('system.sendValidationCode', { phone:phone, type:type }, function(data) {
        docBtn.cd = 60;
        docBtn.cdTimer = setInterval(cdFunc, 1000);
        if (callBack) callBack(true);
    }, function(code, msg) {
        PopupManager.message('<p style="color: red; margin-top: 10px;">' + msg + '</p>');
        btn.button('reset');
        if (callBack) callBack(false);
    });
}