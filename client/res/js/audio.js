
    var media = $('#bgMusic')[0];
    var audioCache = $.cookie("audioCache");
    if( audioCache ){
    	pause();
    	var time = audioCache.split("_")[1];
    	var autoPlay = audioCache.split("_")[0] == "1" ? true : false;
    	media.currentTime = time;
    	if(autoPlay){
    		play();
    	}else{
    		pause();
    	}
    }
	$('#mCtrl').bind('click', function() {  
	    playAudio();  
	});
	//播放暂停切换  
	function playAudio() {  
	    if(media.paused) {
	        play();
	    } else {  
	        pause();  
	    }
		var playFlag = media.paused ? 0 : 1;
		$.cookie("audioCache",playFlag + "_" +media.currentTime);
	}
	//播放  
	function play() {  
	    media.play();  
	    $('#mCtrl')&&$('#mCtrl').addClass("animated_rotate");
	}  
	  
	//暂停  
	function pause() {
	    media.pause();  
	    $('#mCtrl')&&$('#mCtrl').removeClass("animated_rotate")
	}