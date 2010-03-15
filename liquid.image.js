Liquid.Image = function(src, opts) {
	if(!opts) opts = {};

	this.x				 = 0;
	this.y               = 0;
	this.zIndex          = 0;
	this.width 			 = undefined;
	this.height 		 = undefined;
	this.scale           = 1;
	this.mouseOver		 = false;
	this.mode			 = "normal";
	
	this.image = new Image();
	this.image.src = src;
	
	var onLoadHandler = function(e) {
		this.width = this.image.width;
		this.height = this.image.height;
		
		if(opts.onLoad) {
			opts.onLoad.call(this, e);
		}
	}.bind(this);


	this.image.addEventListener('load', onLoadHandler, false);		
}

Liquid.Image.prototype = {
	
	mousedown : function(e) {
		alert("sucki");
	},
	
	hitTest : function(x, y) {
		console.log("as");
		var w = this.width * this.scale;
		var h = this.height * this.scale;
		
		if(x > (this.x - w/2) && x < (this.x - w/2 + w) &&
		   y > (this.y - h/2) && y < (this.y - h/2 + h)) {
			return(true);
		} else {
			return(false);
		}
	
	},
	
	drawOnContext : function(context) {
		var w = this.width * this.scale;
		var h = this.height * this.scale;
		
		if(this.scale == 1) {
			context.drawImage(this.image, this.x - w/2, this.y - h/2);
		} else {
			context.drawImage(this.image, this.x - w/2, this.y - h/2, w, h);
		}
		if(this.mouseOver) {
			context.lineJoin = "miter";
			context.strokeStyle = "#00ffff";
			context.lineWidth = 5;
			context.beginPath();
			context.moveTo(this.x - w/2    , this.y - h/2);
		    context.lineTo(this.x - w/2 + w, this.y - h/2);
		    context.lineTo(this.x - w/2 + w, this.y + h - h/2);
		    context.lineTo(this.x - w/2    , this.y + h - h/2);
		    context.lineTo(this.x - w/2    , this.y - h/2);
		    context.lineTo(this.x - w/2 + w, this.y - h/2);
		    context.stroke();
		}
	}
}