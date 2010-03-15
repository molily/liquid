Liquid.Sprite = function f_Liquid_Sprite (width, height) {
	//console.log('Liquid.Sprite', width, height);
	
	var sprite = this;
	
	var canvas = sprite.canvas = document.createElement('canvas');
	sprite.width = canvas.width = width;
	sprite.height = canvas.height = height;
	sprite.context = canvas.getContext('2d');
	
	sprite.halfWidth = width / 2;
	sprite.halfHeight = height / 2;
};

Liquid.Sprite.prototype = {
	draw : function f_Liquid_Sprite_draw (context, x, y) {
		context.drawImage(this.canvas, x, y);
	}
};

Liquid.Sprite.cache = {};
Liquid.Sprite.cache.size = 0;