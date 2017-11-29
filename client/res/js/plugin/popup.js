/**
 * Created by Jay on 6/29/15.
 */

var PopupManager = {};

PopupManager._popup = {};
PopupManager._msg = {};

PopupManager._createdDiv = {};

PopupManager.ANIMATE_TIME = 400;

PopupManager._wrapperEventDispatcher = function(popup) {
    popup._listenerList = {};
    popup.notify = function(event, params) {
        if (!popup._listenerList[event]) return;
        var instance = this;
        popup._listenerList[event].forEach(function(handler) {
            if (handler) handler({ type:event, target:instance, params:params });
        })
    };
    popup.registerListener = function(event, handler) {
        if (!popup._listenerList[event]) popup._listenerList[event] = [];
        popup._listenerList[event].push(handler);
    };
    popup.disposeListener = function(event, handler) {
        if (!popup._listenerList[event]) return;
        popup._listenerList[event].splice(popup._listenerList[event].indexOf(handler), 1);
    };
}

PopupManager._customerLayout = function(popupID, customPos) {
    var ww = $(window).width();
    var wh = $(window).height();

    var doLayout = function(popupBody) {
        var pw = popupBody.offsetWidth;
        if (popupBody['offsetWidth'] == undefined) {
            pw = popupBody[0].offsetWidth;
        }
        var ph = popupBody.offsetHeight;
        if (popupBody['offsetHeight'] == undefined) {
            ph = popupBody[0].offsetHeight;
        }
        var top = (wh - ph) / 2;
        top = top > 100 ? (top - 100) : Math.max(0, top);
        if(customPos){
            top += customPos;
        }
        if (popupBody['css'] == undefined) {
            popupBody = $(popupBody);
        }
        popupBody.css('left', ((ww - pw) / 2) + 'px');
        var dh = $(document).scrollTop();
        popupBody.css('top', top + dh + 'px');
    }

    if (popupID) {
        var popup = PopupManager._popup[popupID];
        if (popup) {
            doLayout(popup);
        } else {
            popup = PopupManager._msg[popupID];
            if (popup) doLayout(popup[0]);
        }
        return;
    }

    for (var key in PopupManager._popup) {
        var popup = PopupManager._popup[key];
        if (!popup) continue;
        doLayout(popup);
    }
}

PopupManager._layout = function(popupID) {
    var ww = $(window).width();
    var wh = $(window).height();

    var doLayout = function(popupBody) {
        var pw = popupBody.offsetWidth;
        if (popupBody['offsetWidth'] == undefined) {
            pw = popupBody[0].offsetWidth;
        }
        var ph = popupBody.offsetHeight;
        if (popupBody['offsetHeight'] == undefined) {
            ph = popupBody[0].offsetHeight;
        }
        var top = (wh - ph) / 2;
        top = top > 100 ? (top - 100) : Math.max(0, top);
        if (popupBody['css'] == undefined) {
            popupBody = $(popupBody);
        }
        popupBody.css('left', ((ww - pw) / 2) + 'px');
        var dh = $(document).scrollTop();
        popupBody.css('top', top + dh + 'px');
    }

    if (popupID) {
        var popup = PopupManager._popup[popupID];
        if (popup) {
            doLayout(popup);
        } else {
            popup = PopupManager._msg[popupID];
            if (popup) doLayout(popup[0]);
        }
        return;
    }

    for (var key in PopupManager._popup) {
        var popup = PopupManager._popup[key];
        if (!popup) continue;
        doLayout(popup);
    }
}

$(function() {
    $(window).resize(PopupManager._layout);
    $('div[component=popup]').each(function(index, div) {
        $(div).addClass('popup');
        PopupManager._createdDiv[div.id] = div;
        $(div).remove();
    });
});


PopupManager.close = function(id) {
    var popup = PopupManager._popup[id];
    if (!popup) return;
    popup.close();
}


PopupManager.show = function(html) {
    var opt = arguments[1];
    if (opt && opt.id && PopupManager._popup[opt.id]) {
        return;
    }
    var closeCallBack = arguments[2];
    var id = (opt && opt.id) ? opt.id : 'popup_' + new Date().getTime();

    var popup;
    if (PopupManager._createdDiv[html]) {
        id = html;
        html = PopupManager._createdDiv[html].outerHTML;
        if (opt) opt.noClose = true;
        else opt = { noClose:true };

        popup = html;
    } else {
        popup = '<div id="' + id + '" class="popup" style="background-color: #cdcdcd;' + (opt && opt.autoHide ? 'display:none' : '') + '"> \
                    <div class="close">×</div> \
                    <div class="body">' + html + '</div> \
                </div>';
    }

    if (!opt || !opt.noCover) {
        var cover = $('<div id="' + id + '_cover" class="popup_cover"></div>');
        $('body').append(cover);
        if (!opt || !opt.noCoverClose) {
            cover.click(function(evt) {
                var pid = evt.target.id.replace('_cover', '');
                PopupManager.close(pid);
            });
        }
    }
    $('body').append(popup);
    popup = $('#' + id);

    if (opt && Number(opt['coverAlpha']) >= 0) {
        $('#' + id + '_cover').css('background-color', 'rgba(0,0,0,' + opt.coverAlpha + ')');
    }

    popup.popupID = id;
    popup.option = opt;
    popup.closeCallBack = closeCallBack;

    PopupManager._wrapperEventDispatcher(popup);

    popup.layout = function() {
        PopupManager._layout(this.popupID);
    }

    popup.close = function() {
        if (popup.closeCallBack) popup.closeCallBack();
        popup.notify('close');
        popup.remove();
        $('#' + popup.popupID + '_cover').remove();
        delete PopupManager._popup[popup.popupID];
    }

    if (opt && opt.noClose == true) {
        $(popup.find('.close')[0]).remove();
    } else {
        $(popup.find('.close')[0]).click(function() {
            popup.close();
        });
    }

    PopupManager._popup[id] = popup;
    PopupManager._layout(id);

    return popup;

}


PopupManager.showConfirm = function(content, yesCallBack, noCallBack, opt) {
    opt = opt ? opt : {};

    var btns = '<div class="confirm_content_block" style="color:#000000" >' + content + '</div><div class="button_block">';
    btns += '<a style="color:#000000" class="btn btn-yes">' + (opt.yesButtonLabel ? opt.yesButtonLabel : '确定') + '</a>';
    btns += '<a style="color:#000000" class="btn btn-no">' + (opt.noButtonLabel ? opt.noButtonLabel : '取消') + '</a>';
    btns += '</div>';

    var popup = PopupManager.show(btns);
    popup.find('.window > .close').remove();
    $(popup.find('.button_block > .btn-yes')[0]).click(function() {
        if (yesCallBack) {
            if (yesCallBack() != false) {
                popup.close();
            }
        }
        else {
            popup.close();
        }
    });
    $(popup.find('.button_block > .btn-no')[0]).click(function() {
        if (noCallBack) noCallBack();
        popup.close();
    });
    return popup;
}

PopupManager.showExternalPage = function(url, width, height) {
    var id = 'iframe_popup' + Date.now();
    if (url.indexOf('?') > 0) {
        url += '&iframeID=' + id;
    }
    var iframe = '<iframe src="' + url + '" width="' + width + '" height="' + height + '" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>';
    PopupManager.show(iframe, { id:id });
}

PopupManager.message = function(content) {

    var type = isNaN(parseInt(arguments[1])) ? 0 : parseInt(arguments[1]);
    var closeCallBack = arguments[2];
    var opt = arguments[3];

    var animateTime = PopupManager.ANIMATE_TIME;

    var id = 'popup_' + new Date().getTime();
    var html = '<div id="' + id + '" class="message"><div class="body">' + content + '</div></div>';
    var popup = $(html);
    if (opt) {
        popup.addClass('no_close');
    } else {
        popup.prepend('<div class="close">×</div>');
    }
    switch (type) {
        case 1:
            popup.addClass('success');
            break;
        case 2:
            popup.addClass('error');
            break;
    }
    $('body').append(popup);
    popup = $('#' + id);
    popup.popupID = id;
    popup.msgType = parseInt(type);
    popup.option = opt;
    popup.closeCallBack = closeCallBack;

    PopupManager._msg[id] = popup;
    PopupManager._layout(id);
    popup.hide();

    var topPos = popup.css('top');
    popup.css('top', parseInt(topPos.replace('px', '')) + 40);
    popup.fadeIn(animateTime, function() {
        if (!opt || !opt.stay) {
            popup._timer = setTimeout(popup.out, opt && opt.stayTime > 0 ? opt.stayTime : 4000);
        }
    });
    popup.animate({'top':topPos }, {speed:animateTime, queue:false});

    PopupManager._wrapperEventDispatcher(popup);

    popup.out = function() {
        trace('fadeOut');
        clearTimeout(popup._timer);
        popup.fadeOut(animateTime, popup.close);
        var topPos = popup.css('top');
        popup.animate({'top':parseInt(topPos.replace('px', '')) - 40 }, {speed:animateTime, queue:false});
    }

    popup.close = function() {
        clearTimeout(popup._timer);
        if (popup.closeCallBack) popup.closeCallBack();
        popup.notify('close');
        popup.remove();
        delete PopupManager._popup[popup.popupID];
    }

    if (popup.find('.close').length > 0) {
        $(popup.find('.close')[0]).click(function() {
            popup.close();
        });
    }

    return popup;
}


PopupManager.messageCustomer = function(content, customPos) {

    var type = isNaN(parseInt(arguments[1])) ? 0 : parseInt(arguments[1]);
    var closeCallBack = arguments[2];
    var opt = arguments[3];

    var animateTime = PopupManager.ANIMATE_TIME;

    var id = 'popup_' + new Date().getTime();
    var html = '<div id="' + id + '" class="message"><div class="body">' + content + '</div></div>';
    var popup = $(html);
    if (opt) {
        popup.addClass('no_close');
    } else {
        popup.prepend('<div class="close">×</div>');
    }
    switch (type) {
        case 1:
            popup.addClass('success');
            break;
        case 2:
            popup.addClass('error');
            break;
    }
    $('body').append(popup);
    popup = $('#' + id);
    popup.popupID = id;
    popup.msgType = parseInt(type);
    popup.option = opt;
    popup.closeCallBack = closeCallBack;

    PopupManager._msg[id] = popup;
    PopupManager._customerLayout(id, customPos);
    popup.hide();
    var topPos = popup.css('top');
    if(customPos){
        //topPos = parseInt(topPos.replace('px', ''))+ customPos + 'px';
    }

    popup.fadeIn(animateTime, function() {
        if (!opt || !opt.stay) {
            popup._timer = setTimeout(popup.out, opt && opt.stayTime > 0 ? opt.stayTime : 4000);
        }
    });
    popup.animate({'top':topPos }, {speed:animateTime, queue:false});

    PopupManager._wrapperEventDispatcher(popup);

    popup.out = function() {
        trace('fadeOut');
        clearTimeout(popup._timer);
        popup.fadeOut(animateTime, popup.close);
        var topPos = popup.css('top');
        if(customPos){
            //topPos = parseInt(topPos.replace('px', ''))+ customPos + 'px';
        }
        popup.animate({'top':parseInt(topPos.replace('px', '')) - 40 }, {speed:animateTime, queue:false});

    }

    popup.close = function() {
        clearTimeout(popup._timer);
        if (popup.closeCallBack) popup.closeCallBack();
        popup.notify('close');
        popup.remove();
        delete PopupManager._popup[popup.popupID];
    }

    if (popup.find('.close').length > 0) {
        $(popup.find('.close')[0]).click(function() {
            popup.close();
        });
    }

    return popup;
}