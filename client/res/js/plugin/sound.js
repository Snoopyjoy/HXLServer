/**
 * Created by Jay on 7/22/15.
 */
var Sound = {};
Sound.flashPlayeyStatus = 0;
Sound.pendingList = [];

Sound.flashReady = function() {
    Sound.flashPlayeyStatus = 1;
    if (Sound.pendingList && Sound.pendingList.length > 0) {
        for (var i = 0; i < Sound.pendingList.length; i++) {
            Sound.play(Sound.pendingList[i]);
        }
        Sound.pendingList.length = 0;
    }
}

Sound.play = function(url) {
    console.log(Sound.htmlSupportSound);
    if (Sound.htmlSupportSound) {
        var id = "sound_" + Date.now() + "" + parseInt(Math.random() * 10000);
        var audio = '<audio id="' + id + '" src="'+ url + '" style="width:1px;height:1px;visibility:hidden;" autoplay>';
        $('body').append(audio);
        audio = $('#' + id);
        audio[0].addEventListener('ended', function () {
            audio.remove();
        }, false);
    } else {
        if (Sound.flashPlayeyStatus != 1) {
            Sound.pendingList.push(url);
            return;
        }
        $($('.sound_player')[0]).flash(function() {
            this.playSound(url);
        });
    }
}

$(function() {

    var bower = window.navigator.userAgent.toLowerCase();
    Sound.htmlSupportSound = !(bower.indexOf("msie 6") !=-1 || bower.indexOf("msie 7")!=-1 || bower.indexOf("msie 8") !=-1);

    if (!Sound.htmlSupportSound){
        $($('.sound_player')[0]).flash({
            swf: RES_CDN_DOMAIN + '/flash/sound.swf',
            width:'1',
            height:'1',
            allowScriptAccess:'always',
            wmode:'Opaque',
            devicefont:'true',
            scale: 'noScale',
            flashvars: { }
        });
    }
});