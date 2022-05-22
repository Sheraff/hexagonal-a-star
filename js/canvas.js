import { HexGrid } from './hex-structures.js'
import { drawMatrix, drawCell } from './hex-draw.js'
import { setStartEnd, addObstacle } from './grid-utils.js'
import seededRandom from './seeded-ramdom.js'
import aStar from './a-star.js'

let context
let killCurrentAnimation

onmessage = async function({data}) {
	if (data.canvas) {
		context = data.canvas.getContext("2d");
	}
	if(context && data.seed) {
		killCurrentAnimation?.()
		const {matrix, start, end} = makeGrid(data.seed)
		await nextFrame()
		drawMatrix(context, matrix)
		await nextFrame()
		const path = aStar(matrix, start, end);
		await wait(400)
		if (path) {
			killCurrentAnimation = animatePath(context, matrix, path)
		}
	}
};

function makeGrid(seed) {
	const random = seed ? seededRandom(seed) : undefined
	const matrix = new HexGrid(50, 86);
	const { start, end } = setStartEnd(matrix, random)
	for (let i = 0; i < 50; i++) {
		addObstacle(matrix, [start, end], [10, 150], random)
	}
	return {matrix, start, end}
}

function animatePath(context, matrix, path) {
	let kill = false
	void async function () {
		for (const cell of path) {
			cell.isPath = true
			await wait(30)
			await nextFrame()
			if(kill)
				return
			drawCell(context, matrix, cell)
		}
	}()
	return () => {
		kill = true
	}
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function nextFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve))
}
