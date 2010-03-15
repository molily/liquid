Liquid.Rectangle = new Function;

Liquid.Rectangle.prototype = {
	draw : function f_Liquid_Rectangle_draw (context, x, y, width, height, strokeStyle, fillStyle, shadow) {
		//console.log('Liquid.Rectangle.draw', x, y, radius, strokeStyle, fillStyle);
		
		if (!strokeStyle && !fillStyle) {
			return;
		}
		
		context.save();
		
		if (shadow && 'color' in shadow) {
			context.shadowColor = shadow.color;
			context.shadowOffsetX = 'x' in shadow ? shadow.x : 1;
			context.shadowOffsetY = 'y' in shadow ? shadow.y : 1;
			context.shadowBlur = 'blur' in shadow ? shadow.blur : 3;
		}
		
		if (strokeStyle) {
			context.lineWidth = 1;
			context.strokeStyle = strokeStyle;
			context.strokeRect(x, y, width, height);
		}
		
		if (fillStyle) {
			context.fillStyle = fillStyle;
			context.fillRect(x, y, width, height);
		}
		
		context.restore();
	}
};
