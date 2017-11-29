
var Form = {

    _groups : {},

    registerCheck : function(group, inputs) {
        Form._groups[group] = inputs;
        inputs.on('blur', Form.checkInput);
        inputs.bind('focus', function(evt) {
            var ele = $(evt.currentTarget);
            Form.cleanUpTip(ele);
        });
    },

    check : function(group) {
        var inputs = Form._groups[group];
        if (!inputs) return true;
        for (var i = 0; i < inputs.length; i++) {
            var ele = $(inputs[i]);
            Form.checkInput(null, ele);
            if (ele.attr('hasError') == 'true') return false;
        }
        return true;
    },

    showInputLoading : function(ele) {
        this.cleanUpTip(ele);
        var parent = $(ele.parent()[0]);
        parent.append('<em class="loading"></em>');
    },

    showInputError : function(ele, msg) {
        this.cleanUpTip(ele);
        var parent = $(ele.parent()[0]);
        parent.append('<em class="wrong">' + msg + '</em>');
        ele.attr('hasError', 'true');
    },

    showInputOK : function(ele) {
        this.cleanUpTip(ele);
        var parent = $(ele.parent()[0]);
        parent.append('<em class="correct"></em>');
        ele.removeAttr('hasError');
    },

    cleanUpTip : function(ele) {
        var parent = $(ele.parent()[0]);
        parent.find('em').remove();
    },

    checkInput : function (evt, input) {
        var ele = input ? input : $(evt.currentTarget);
        var eleType = ele.attr('type');
        var val = ele.val().trim();

        if (ele.attr('required') && !val.hasValue()) {
            Form.showInputError(ele, '此处必填');
        } else {
            if (ele.attr('fieldType') == 'cn_cell_phone' && !$formValidator.cnCellPhoneCheck(val)) {
                Form.showInputError(ele, '手机号码无法识别');
            } else if (eleType == 'password' && String(ele.attr('pwdGroup')).hasValue()) {
                var pwdGroup = String(ele.attr('pwdGroup'));
                var g = pwdGroup.split('_')[0];
                var i = parseInt(pwdGroup.split('_')[1]);
                if (i > 0) {
                    var pwd1 = $('input[pwdGroup=' + g + '_0]');
                    if (pwd1.length > 0) {
                        pwd1 = $(pwd1[0]);
                        if (pwd1.val() == val) {
                            Form.showInputOK(ele);
                        } else {
                            Form.showInputError(ele, '两次填写的密码不一致');
                        }
                    }
                } else {
                    var lr = String(ele.attr('lengthRequired')).split('-');
                    if (lr.length == 2 && (val.length < parseInt(lr[0]) || val.length > parseInt(lr[1]))) {
                        Form.showInputError(ele, '密码长度应为6~16个字符');
                    } else {
                        Form.showInputOK(ele);
                    }
                }
            } else {
                Form.showInputOK(ele);
            }
        }

        var noChangeCheck = arguments[2];
        if (noChangeCheck != true) {
            if (ele.attr('changeCheck') && window[ele.attr('changeCheck')]) {
                window[ele.attr('changeCheck')](ele);
            }
        }

        return ele.attr('hasError') != 'true';
    }

};