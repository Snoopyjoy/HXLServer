/**
 * Created by Jay on 12/3/14.
 */

var Uploader = {};



Uploader.setup = function(prefix, container, fileTypeName, fileType, type, customFileName, picUpload, keepExt) {

    var con;

    var $getUploadToken = function(uploadfilename) {
        $callAPI('proxy.generateFileUploadToken', { type:type, filename:uploadfilename }, function(data) {
            var token = data.token;
            if (token) {
                con.flash(function() {
                    this.tokenReady(uploadfilename, token);
                });
            } else {
                alert("error->"+4+":"+"获取上传Token失败");
                //showMessage(4, '获取上传Token失败.');
            }
        }, function(code, msg) {
            alert("error->"+code+":"+msg);
            //showErrorMessage(code, msg);
        });
    };

    if (container.indexOf("parent.") == 0) {
        con = window.parent.document.getElementById(container.replace("parent.", ''));
        con = $(con);
        window.parent.$getUploadToken = $getUploadToken;
    } else {
        con = $("#" + container);
        window.$getUploadToken = $getUploadToken;
    }
    var fl = picUpload == true ? "pic_uploader" : "flashuploader";
    var flw = '590';
    var flh = picUpload == true ? '345' : '45';
    con.flash({
        swf: RES_CDN_DOMAIN + '/flash/' + fl + '.swf',
        width:flw,
        height:flh,
        allowScriptAccess:'always',
        allowFullScreen:'true',
        wmode:'Opaque',
        devicefont:'true',
        scale: 'noScale',
        flashvars: {
            prefix: prefix + "_",
            url: UPLOAD_GATEWAY,
            fileType: fileType,
            fileTypeName: fileTypeName,
            customFileName: customFileName,
            getUploadToken: '$getUploadToken',
            keepExt: keepExt ? 1 : 0
        }
    });
}
