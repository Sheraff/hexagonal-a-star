import { HexGrid } from './hex-structures.js'
import { drawMatrix, drawCell } from './hex-draw.js'
import { setStartEnd, addObstacle } from './grid-utils.js'
import aStar from './a-star.js'

onmessage = async function({data}) {
	if (data.canvas) {
		const context = data.canvas.getContext("2d");
		const {matrix, start, end} = makeGrid()
		await nextFrame()
		drawMatrix(context, matrix)
		await nextFrame()
		const path = aStar(matrix, start, end);
		await wait(500)
		if (path) {
			animatePath(context, matrix, path)
		}
	}
};

function makeGrid() {
	const matrix = new HexGrid(50, 86);
	const { start, end } = setStartEnd(matrix)
	for (let i = 0; i < 50; i++) {
		addObstacle(matrix, [start, end], [10, 150])
	}
	return {matrix, start, end}
}

async function animatePath(context, matrix, path) {
	for (const cell of path) {
		cell.isPath = true
		await wait(20)
		await nextFrame()
		drawCell(context, matrix, cell)
	}
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function nextFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve))
}
