(function() {
	var timeLbl = document.querySelector('#timeDisplay');
	var playBtn = document.getElementById('play');
	var resetBtn = document.getElementById('reset');
	var exerciseLst = document.querySelectorAll('.player > .list li');
	var goAudio = document.getElementById('audioGo');
	var pauseAudio = document.getElementById('audioPause');
	var winAudio = document.getElementById('audioWin');
	
	var timeLeft = 0;
	var maxTimeLeft = 60*7+50;
	var interval = null;
	var position = 0;
	var next = 0;
	
	playBtn.addEventListener('click', function(e) {
		e.preventDefault();
		playPause();
	});

	resetBtn.addEventListener('click', function(e) {
		e.preventDefault();
		reset();
	});

	function playPause() {
		if(interval) {
			clearInterval(interval);
			interval = null;
		} else {
			if(timeLeft == maxTimeLeft) {
				exerciseLst[0].setAttribute('class', 'active');
				goAudio.play();
			}
			interval = setInterval(function() {
				timeLeft--;
				if(timeLeft == 0) {
					clearInterval(interval);
					winAudio.play();
					return reset();
				}
				if(timeLeft == next) {
					position++;
					var isPause = (position % 2 == 1);
					next = timeLeft - (isPause ? 10 : 30);
					if(isPause) {
						pauseAudio.play();
						exerciseLst[(position-1)/2].setAttribute('class', 'done');
						exerciseLst[exerciseLst.length-1].setAttribute('class', 'active');
					} else {
						goAudio.play();
						exerciseLst[exerciseLst.length-1].setAttribute('class', '');
						exerciseLst[position/2].setAttribute('class', 'active');
					}
				}
				displayTime();
			}, 1000);
		}
		playBtn.textContent = interval ? 'Pause' : 'Play';
	}

	function reset() {
		clearInterval(interval);
		interval = null;
		timeLeft = maxTimeLeft;
		position = 0;
		next = timeLeft-30;

		displayTime();
		playBtn.textContent = 'Play';
		for(var i=0; i<exerciseLst.length; i++) {
			exerciseLst[i].setAttribute('class', '');
		}
	}
	
	function displayTime() {
		var sec = timeLeft%60;
		if(sec < 10) sec = '0' + sec;
		timeLbl.textContent = '0' + Math.floor(timeLeft/60) + ':' + sec;
	}
	
	reset();
	displayTime();
	
	for(var i=0; i<exerciseLst.length; i++) {
		var m = exerciseLst[i].innerHTML.match(/([^<]*)/);
		exerciseLst[i].innerHTML = exerciseLst[i].innerHTML.replace(/([^<]*)/, '<a href="http://www.youtube.com/results?search_query='+m[0]+'" target="_blank">'+m[0]+'</a>');
		
	}
})();
