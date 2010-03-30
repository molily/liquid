Liquid.Line = new Function;

Liquid.Line.prototype = {
	draw : function f_Liquid_Line_draw (context, x1, y1, x2, y2, lineWidth, strokeStyle) {
		context.save();
		
		context.lineWidth = lineWidth;
		context.strokeStyle = strokeStyle;
		
		context.beginPath();
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.closePath();
		
		context.stroke();
		
		context.restore();
	}
};