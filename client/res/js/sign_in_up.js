
$(function() {

    var dom = '<div class="sign_container"> \
                    <div class="sign_container_cover"></div> \
                    <div class="sign_content"> \
                        <div class="sign_title">会员登录</div> \
                        <div class="sign_panel"> \
                                <div class="login_container"> \
                                    <form class="group"> \
                                        <ul class="first"><li>手机号：</li><li><input type="text" id="loginIDInput" class="" value="" required /></li></ul>\
                                        <ul class="last"><li>密　码：</li><li><input id="loginPWDInput" type="password" class="" value=""required></li></ul>\
                                        <!--<ol><li><input type="checkbox"></li><li>记住用户名及密码</li></ol>-->\
                                        <ul class="login_ul">\
                                            <li class="buttons">\
                                                <button id="loginBtn" class="btn btn-block" onclick="javascript:$signCtrl.doLogin()">登&nbsp;&nbsp;录</button>\
                                            </li>\
                                            <li><a href="request_get_password">忘记密码?　</a></li>\
                                            <li>|　<a href="reg">立即注册</a></li>\
                                        </ul>\
                                    </form> \
                                    <div class="msg"> \
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div>';

    $('body').append(dom);

    $('.register_container .group input').on('change', $signCtrl.checkInput);
    $('.register_container .group input').on('blur', $signCtrl.checkInput);
    $('.register_container .group input').on('focus', $signCtrl.checkRegisterEnable);
    $('.register_container .group input').bind('focus', function(evt) {
        var ele = $(evt.currentTarget);
        $signCtrl.cleanUpTip(ele);
    });
    $('.register_container .group input').on('keyup', $signCtrl.checkRegisterEnable);

    if (queryParams['login'] == 1) {
        $signCtrl.goLogin();
    }

    $('.sign_container').on('click', $signCtrl.closeSign);

    $('#loginPWDInput').bind('keypress',function(event){
        if(event.keyCode == "13") {
            $signCtrl.doLogin();
        }
    });

    $(window).resize($signCtrl.layout);

    if (window['$signCtrlReady'] != undefined && window['$signCtrlReady'] != null) {
        window.$signCtrlReady();
    }

});


var $signCtrl = {

    openning: false,

    showSignContent: function() {
        var ele = $('.sign_container');
        ele.show();

        var arrow = $('.sign_arrow');
        arrow.removeClass('sign_arrow_login');
        arrow.removeClass('sign_arrow_register');

        $signCtrl.openning = true;
        $signCtrl.layout();
    },

    layout: function() {
        if (!$signCtrl.openning) return;

        var ww = $(window).width();
        var wh = $(window).height();
        var dh = $(document).height();

        var sign = $('.sign_content');
        sign.css('left', (ww - sign.width()) / 2 + 'px');
        var st = $(document).scrollTop();
        sign.css('top', (st + (wh - sign.height()) / 2 - 80) + 'px');

        $('.sign_container_cover').height(dh);
    },

    goLogin: function(v) {
        if(v)  queryParams['from'] = v;
        else delete  queryParams['from'];
        $signCtrl.showSignContent();
        $('.sign_arrow').addClass('sign_arrow_login');
        $('.register_container').hide();
        $('.login_container').show();

        $('#loginIDInput').focus();
    },

    goRegister: function() {
        $signCtrl.showSignContent();
        $('.sign_arrow').addClass('sign_arrow_register');
        $('.login_container').hide();
        $('.register_container').show();

        $('#registerIDInput').focus();
    },

    closeSign: function(evt) {
        if (evt.target == $('.sign_container_cover')[0]) {
            $('.sign_container').hide();
            $signCtrl.openning = false;
        }
    },

    checkRegisterEnable: function() {
        var id = $('#registerIDInput').val().trim();
        var pwd1 = $('#registerPWDInput1').val().trim();
        var pwd2 = $('#registerPWDInput2').val().trim();
        var vc = $('#registerValidationCodeInput').val().trim();

        if (!id.hasValue() || !pwd1.hasValue() || !pwd2.hasValue() || !vc.hasValue() ||
            $('#registerIDInput').attr('hasError') == 'true' ||
            $('#registerPWDInput1').attr('hasError') == 'true' ||
            $('#registerPWDInput2').attr('hasError') == 'true' ||
            $('#registerValidationCodeInput').attr('hasError') == 'true') {

            $('#registerBtn').attr('disabled', 'true');
        } else {
            $('#registerBtn').removeAttr("disabled");
        }
    },

    checkInput: function(evt) {
        var ele = $(evt.currentTarget);
        if (ele.css('display') == 'none' && !String(ele.attr('id')).hasValue()) {
            var inputs = ele.parent().find('input');
            if (inputs.length > 0) {
                ele = $(inputs[0]);
            }
        }
        var eleType = ele.attr('type');
        var val = ele.val().trim();
        $signCtrl.cleanUpTip(ele);
        if (ele.attr('required') && !val.hasValue()) {
            $signCtrl.showInputError(ele, 'required');
        } else {
            if (ele.attr('fieldType') == 'email' && !$formValidator.emailCheck(val)) {
                $signCtrl.showInputError(ele, 'email_error');
            } else if (ele.attr('fieldType') == 'phone' && !$formValidator.phoneCheck(val)) {
                $signCtrl.showInputError(ele, 'phone_error');
            } else if (ele.attr('fieldType') == 'cn_cell_phone' && !$formValidator.cnCellPhoneCheck(val)) {
                $signCtrl.showInputError(ele, 'phone_error');
            } else if (eleType == 'password' && String(ele.attr('pwdGroup')).hasValue()) {
                var pwdGroup = String(ele.attr('pwdGroup'));
                var g = pwdGroup.split('_')[0];
                var i = parseInt(pwdGroup.split('_')[1]);
                if (i > 0) {
                    var pwd1 = $('input[pwdGroup=' + g + '_0]');
                    if (pwd1.length > 0) {
                        pwd1 = $(pwd1[0]);
                        if (pwd1.val() == val) {
                            $signCtrl.showInputOK(ele);
                        } else {
                            $signCtrl.showInputError(ele, 'pwd_error');
                        }
                    }
                } else {
                    var lr = String(ele.attr('lengthRequired')).split('-');
                    if (lr.length == 2 && (val.length < parseInt(lr[0]) || val.length > parseInt(lr[1]))) {
                        $signCtrl.showInputError(ele, 'pwd_invalidate');
                    } else {
                        $signCtrl.showInputOK(ele);
                    }
                }
            } else {
                $signCtrl.showInputOK(ele);
            }
        }
    },

    showInputOK: function(ele) {
        var w = ele.width();
        var h = ele.height();
        var parent = $(ele.parent()[0]);
        $signCtrl.cleanUpTip(ele);

        var tip = $('<img class="input_tip ok_tip" style="position: absolute; margin-left: ' + (w - 18) + 'px; margin-top: ' + parseInt((h - 18) /2) + 'px;" src="' + RES_CDN_DOMAIN + '/img/ok.png" width="18px" height="18px">');
        parent.prepend(tip);
    },

    showInputLoading: function(ele) {
        var w = ele.width();
        var h = ele.height();
        var parent = $(ele.parent()[0]);
        $signCtrl.cleanUpTip(ele);

        var tip = $('<img class="input_tip loading_tip" style="position: absolute; margin-left: ' + (w - 24) + 'px; margin-top: ' + parseInt((h - 24) /2) + 'px;" src="' + RES_CDN_DOMAIN + '/img/mid_loading.gif" width="24px" height="24px">');
        parent.prepend(tip);
    },

    showInputError: function(ele, type) {

        var MAP = {
            'required':{ w:55, h:25 },
            'pwd_error':{ w:81, h:25 },
            'pwd_invalidate':{ w:165, h:25 },
            'invite_code_over':{ w:154, h:25 },
            'invite_code_error':{ w:81, h:25 },
            'validation_code_error':{ w:100, h:25 },
            'email_error':{ w:124, h:25 },
            'phone_error':{ w:124, h:25 },
            'id_exist':{ w:140, h:25 }
        };

        var err = MAP[type];

        var w = ele.width();
        var h = ele.height();
        var parent = $(ele.parent()[0]);
        $signCtrl.cleanUpTip(ele);

        var tip = $('<img class="input_tip ' + type + '_tip" style="position: absolute; margin-top: ' + parseInt((h - err.h) /2) + 'px;" src="' + RES_CDN_DOMAIN + '/img/' + type + '_tip.png">');
        parent.prepend(tip);
        parent.prepend('<img class="input_tip field_error" style="position: absolute; margin-left: ' + (w - 18) + 'px; margin-top: ' + parseInt((h - 18) /2) + 'px;" src="' + RES_CDN_DOMAIN + '/img/field_error.png">');

        var pos = w - 22 - err.w;
        tip.css('margin-left', pos + 'px');
        $signCtrl.shakeAnimation(tip, pos, 3);

        ele.attr('hasError', true);
    },

    cleanUpTip: function(ele) {
        var parent = $(ele.parent()[0]);
        parent.find('.input_tip').remove();
        ele.removeAttr('hasError');
    },

    shakeAnimation: function(ele, pos, d, t, n, noCheck) {
        n = isNaN(n) ? 3 : parseInt(n);
        var docEle = ele[0];
        if (!noCheck && docEle.isAniming == true) return;
        if (docEle.animCount != undefined) {
            docEle.animCount --;
            if (docEle.animCount < 0) {
                delete docEle['animCount'];
                docEle.isAniming = false;
                return;
            }
        } else {
            docEle.animCount = n;
        }
        t = isNaN(t) ? 80 : Number(t);
        docEle.isAniming = true;
        ele.animate({'margin-left': pos + d}, t, function() {
            $signCtrl.shakeAnimation(ele, $elemntRect(ele, 'margin-left'), -d, t, n, true);
        });
    },

    checkAccountExist: function(ele) {

        var sendBtn = $('#getValidationCodeBtn');

        ele = $(ele);
        var val = ele.val().trim();
        if (!String(val).hasValue()) {
            sendBtn.attr('disabled', true);
            return;
        }

        clearTimeout(ele._checkTimer);

        ele._checkTimer = setTimeout(function() {
            if (ele.attr('hasError') == 'true') return;

            $signCtrl.showInputLoading(ele);

            $callAPI('user.checkIDExist', { id:val }, function(data) {
                if (data.result == 0) {
                    $signCtrl.showInputOK(ele);

                    if (sendBtn.cd == undefined) {
                        sendBtn.removeAttr('disabled');
                    }
                } else {
                    $signCtrl.showInputError(ele, 'id_exist');
                }
            });
        }, 100);
    },

    sendValidationCode: function() {
        var phone = $('#registerIDInput').val().trim();
        if (!String(phone).hasValue()) {
            $signCtrl.showInputError($('#registerIDInput'), 'phone_error');
            return;
        }

        var btn = $('#getValidationCodeBtn');

        btn.attr('disabled', true);

        var cdFunc = function() {
            btn.cd --;
            if (btn.cd > 0) {
                btn.html('已发送 (' + btn.cd + ')');
            } else {
                clearInterval(btn.cdTimer);
                delete btn['cd'];
                delete btn['cdTimer'];
                btn.removeAttr('disabled');
                btn.html('获取验证码');
            }
        }

        btn.cd = 60;
        btn.cdTimer = setInterval(cdFunc, 1000);

        $callAPI('system.sendValidationCode', { phone:phone, type:"register" }, function(data) {
            btn.cd = 60;
            btn.cdTimer = setInterval(cdFunc, 1000);
            $('.register_container .msg').html('');
        }, function(code, msg) {
            $('.register_container .msg').html('<p style="color: red; margin-top: 10px;">' + msg + '</p>');
            btn.removeAttribute('disabled');
        });
    },

    doRegister: function() {
        $('.register_container .msg').html('');

        var id = $('#registerIDInput').val().trim();
        var pwd = $('#registerPWDInput1').val().trim();
        var vc = $('#registerValidationCodeInput').val().trim();

        $('#registerBtn').button('loading');

        $callAPI('user.guestRegister', { id:id, pwd:$.md5(pwd), validationCode:vc }, function(data) {
            $('#registerBtn').button('reset');
            $user.$inviteCode = data.inviteCode;
            $('#loginIDInput').val(id);
            $('#loginPWDInput').val(pwd);
            $signCtrl.doLogin(true);

        }, function(code, msg) {
            if (code == 1007) {
                $signCtrl.showInputError($('#registerInviteCodeInput'), 'invite_code_error');
            } else if (code == 1008) {
                $signCtrl.showInputError($('#registerInviteCodeInput'), 'invite_code_over');
            } else if (code == 1009) {
                $signCtrl.showInputError($('#registerValidationCodeInput'), 'validation_code_error');
            } else {
                $('.register_container .msg').html('<p style="color: red; margin-top: 10px;">' + msg + '</p>');
            }
            $('#registerBtn').button('reset');
        });
    },

    doLogin: function(isNewRegister) {
        var phone = $('#loginIDInput').val().trim();
        var pwd = $('#loginPWDInput').val().trim();
        $signCtrl.showMessage('');

        if (!String(phone).hasValue() || !String(pwd).hasValue()) {
            $signCtrl.shakeAnimation($('.sign_content'), $elemntRect($('.sign_content'), 'margin-left'), 10, 50);
            $signCtrl.showMessage('请输入手机号码和密码.');
            return;
        }

        pwd = $.md5(pwd);

        $('#loginBtn').button('loading');

        $callAPI('user.login', { phone:phone, pwd:pwd,platform:"web" }, function(data) {
            $login(data);
            if (isNewRegister) {
                var url = 'index?isNew=1';
                if (String($user.$inviteCode).hasValue()) {
                    url += '&inviteCode=' + $user.$inviteCode;
                }
                goPage(url);
            } else {
                var from = queryParams['from'];
                if (String(from).hasValue() && from != "root") {
                    goPage(from);
                } else {
                    goPage('index');
                }
            }
        }, function(code, msg) {
            $('#loginBtn').button('reset');
            if (code == 1002) {
                msg = '用户不存在或密码不正确.';
            }
            $signCtrl.showMessage(msg);
            $signCtrl.shakeAnimation($('.sign_content'), $elemntRect($('.sign_content'), 'margin-left'), 10, 50);
        });
    },

    showMessage: function(msg) {
        $('.login_container .msg').html(msg);
    }

}


