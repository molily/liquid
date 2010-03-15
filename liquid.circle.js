Liquid.Circle = new Function;

Liquid.Circle.prototype = {
	
	lineWidth : 1,
	twoPI : Math.PI * 2,
	
	draw : function f_Liquid_Circle_draw (context, x, y, radius, strokeStyle, fillStyle, shadow) {
		//console.log('Liquid.Circle.draw', x, y, radius, strokeStyle, fillStyle);
		
		if (!strokeStyle && !fillStyle) {
			return;
		}
		
		var circle = this;
		
		// Calculate key and get sprite from cache
		var cacheKey = 'circle-' + radius + '-' + strokeStyle + '-' + fillStyle + '-' + (shadow ? shadow.color + shadow.x + shadow.y + shadow.blur : '');
		//console.log('cacheKey', cacheKey);
		var spriteCache = Liquid.Sprite.cache;
		var sprite = spriteCache[cacheKey];
		
		if (!sprite) {
			var size = 2 * radius + (strokeStyle ? 2 * circle.lineWidth : 0) + 2;
			//console.log('cache miss for', cacheKey, 'size:', size);
			sprite = new Liquid.Sprite(size, size);
			spriteCache[cacheKey] = sprite;
			spriteCache.size++;
			circle.drawCircle(sprite.context, sprite.halfWidth, sprite.halfHeight, radius, strokeStyle, fillStyle, shadow);
		} else {
			//console.log('cache hit for', cacheKey);
		}
		
		//console.log('draw cached sprite', x, y);
		sprite.draw(context, x - sprite.halfWidth, y - sprite.halfHeight);
	},
	
	drawCircle : function f_Liquid_Circle_drawCircle (context, x, y, radius, strokeStyle, fillStyle, shadow) {
		//console.log('f_Liquid_Circle_drawCircle', arguments);
		
		if (strokeStyle) {
			context.lineWidth = this.lineWidth;
			context.strokeStyle = strokeStyle;
		}
		
		if (fillStyle) {
			context.fillStyle = fillStyle;
		}
		
		if (shadow && 'color' in shadow) {
			context.shadowColor = shadow.color;
			context.shadowOffsetX = 'x' in shadow ? shadow.x : 1;
			context.shadowOffsetY = 'y' in shadow ? shadow.y : 1;
			context.shadowBlur = 'blur' in shadow ? shadow.blur : 3;
		}
		
		context.beginPath();
		context.arc(x, y, radius, 0, this.twoPI, true);
		context.closePath();
		
		if (fillStyle) {
			context.fill();
		}
		if (strokeStyle) {
			context.stroke();
		}
		
	}
	
};
