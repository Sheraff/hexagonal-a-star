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
			context.fillStyle = "limegreen";
			context.strokeStyle = "darkgrey"
			break;
		case cell.isEnd:
			context.fillStyle = "deeppink";
			context.strokeStyle = "darkgrey"
			break;
		case cell.isObstacle:
			context.fillStyle = "black";
			context.strokeStyle = "black"
			break;
		case cell.isPath:
			context.fillStyle = "red";
			context.strokeStyle = "red"
			break;
		default:
			context.fillStyle = "lightgrey";
			context.strokeStyle = "darkgrey"
	}
}

const xOffset = 1 + Math.cos(HEX_SIDE)
const yOffset = Math.sin(HEX_SIDE)

function drawHexagon(context, xIndex, yIndex, r) {
	const x = r * (1 + xIndex * 2 * xOffset)
	const y = r * (1 + yIndex * 2 * yOffset)
	context.beginPath();
	for (let i = 0; i < 6; i++) {
		const rad = i * HEX_SIDE;
		context.lineTo(x + r * Math.cos(rad), y + r * Math.sin(rad));
	}
	context.closePath();
}