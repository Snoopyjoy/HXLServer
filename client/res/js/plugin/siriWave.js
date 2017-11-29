function SiriWave(opt){
	this.opt = opt || {};

	this.K = 2;
	this.F = 3;
	this.speed = this.opt.speed || 0.1;
	this.noise = this.opt.noise || 0;
	this.phase = this.opt.phase || 0;
	
	this.color = this.opt.color || "rgba(255,255,255)";

	if( this.opt.canvas ){
		this.canvas = this.opt.canvas;
		canvas.width = canvas.parentNode.offsetWidth;
		canvas.height = canvas.parentNode.offsetHeight;
		this.height = this.canvas.height;
		this.width = this.canvas.width;
	}else{
		if (!devicePixelRatio) devicePixelRatio = 1;
		this.width = devicePixelRatio * (this.opt.width || 320);
		this.height = devicePixelRatio * (this.opt.height || 100);
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.width = (this.width/devicePixelRatio)+'px';
		this.canvas.style.height = (this.height/devicePixelRatio)+'px';
		(this.opt.container || document.body).appendChild(this.canvas);
	}
	
	if (!devicePixelRatio) devicePixelRatio = 1;
	this.width = devicePixelRatio * (this.opt.width || 320);
	this.height = devicePixelRatio * (this.opt.height || 100);
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.width = (this.width/devicePixelRatio)+'px';
	this.canvas.style.height = (this.height/devicePixelRatio)+'px';
		
	this.MAX = (this.height/2)-4;
	this.ctx = this.canvas.getContext('2d');

	this.run = false;
}

SiriWave.prototype = {

	_globalAttenuationFn: function(x){
		return Math.pow(this.K*4/(this.K*4+Math.pow(x,4)),this.K*2);
	},

	_drawLine: function(attenuation ,color , startY, phase ){

		this.ctx.moveTo( 0 ,this.height);
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		var x, y;
		for (var i=-this.K; i<=this.K; i+=0.01) {
			x = this.width*((i+this.K)/(this.K*2));
			y = startY + this.noise * this._globalAttenuationFn(i) * (1/attenuation) * Math.sin(this.F*i-phase);
			this.ctx.lineTo(x, y);
		}
		this.ctx.lineTo(this.width,this.height);
		this.ctx.lineTo(0,this.height);
		this.ctx.closePath();
		this.ctx.fill();
		//this.ctx.stroke();
	},

	_clear: function(){
		this.ctx.globalCompositeOperation = 'destination-out';
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.globalCompositeOperation = 'source-over';
	},

	_draw: function(){
		if (!this.run) return;
		var oldPhase = this.phase;
		this.phase = (this.phase+this.speed)%(Math.PI*64);
		var phase1 = (oldPhase + 2 +this.speed)%(Math.PI*64);
		var phase2 = (oldPhase + 4 +this.speed)%(Math.PI*64);
		var phase3 = (oldPhase + 6 +this.speed)%(Math.PI*64);
		var phase4 = (oldPhase + 8 +this.speed)%(Math.PI*64);
		var phase5 = (oldPhase + 10 +this.speed)%(Math.PI*64);
		this._clear();
		this._drawLine(-4, "#47acc2"  ,this.height/1.6 , phase1);
		this._drawLine(-4, "#1b8da7"  ,this.height/1.5 , phase2);
		this._drawLine(-2, "#06627c"  ,this.height/1.4 , phase3);
		this._drawLine(-2, "#024c66"  ,this.height/1.3 , phase4);
		this._drawLine(1, "#004660"  ,this.height/1.2 , phase5);

		requestAnimationFrame(this._draw.bind(this), 1000);
	},

	start: function(){
		this.phase = 0;
		this.run = true;
		this._draw();
	},

	stop: function(){
		this.run = false;
		this._clear();
	},

	setNoise: function(v){
		this.noise = Math.min(v, 1)*this.MAX;
	},

	setSpeed: function(v){
		this.speed = v;
	},

	set: function(noise, speed) {
		this.setNoise(noise);
		this.setSpeed(speed);
	}

};

