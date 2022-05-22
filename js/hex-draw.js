const HEX_SIDE = 2 * Math.PI / 6;

/**
 *
 * @param {CanvasRenderingContext2D} context
 * @param {import('./hex-structures.js').HexGrid} matrix
 */
export function drawMatrix(context, matrix) {
	const xLength = getCellRadius(context, matrix);
	matrix.forEach((cell, [x, y]) => {
		drawHexagon(context, x, y, xLength);
		styleCell(context, cell);
		context.fill();
		context.stroke();
		context.closePath();
	})
}

export function drawCell(context, matrix, cell) {
	const xLength = getCellRadius(context, matrix);
	drawHexagon(context, cell.x, cell.y, xLength);
	styleCell(context, cell);
	context.fill();
	context.stroke();
	context.closePath();
}

function getCellRadius(context, matrix){
	return context.canvas.width / (matrix.i + matrix.i * Math.cos(HEX_SIDE) - Math.cos(HEX_SIDE)) / 2;
}

function styleCell(context, cell) {
	switch(true) {
		case cell.isStart:
			context.fillStyle = "green";
			break;
		case cell.isEnd:
			context.fillStyle = "purple";
			break;
		case cell.isObstacle:
			context.fillStyle = "black";
			break;
		case cell.isPath:
			context.fillStyle = "red";
			break;
		default:
			context.fillStyle = "lightgrey";
	}
}

function drawHexagon(context, xIndex, yIndex, r) {
	const x = xIndex * r * 2 * (1 + Math.cos(HEX_SIDE)) + r
	const y = (yIndex + 0.5) * r * 2 * Math.sin(HEX_SIDE)
	context.beginPath();
	for (var i = 0; i < 6; i++) {
		const rad = i * HEX_SIDE;
		context.lineTo(x + r * Math.cos(rad), y + r * Math.sin(rad));
	}
	context.closePath();
}