Liquid.Sprite = function(width, height) {
	this.x				 = 0;
	this.y               = 0;
	this.width           = width;
	this.height          = height;
	this._canvas 		 = document.createElement('canvas');
	this._canvas.width   = width;
	this._canvas.height  = height;
	this.context         = this._canvas.getContext("2d");
}

Liquid.Sprite.prototype = {
	drawOnContext : function(context) {
		context.drawImage(this._canvas, this.x, this.y);
	}
}