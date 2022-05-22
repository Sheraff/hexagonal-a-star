import { HexGrid } from './hex-structures.js'
import { drawMatrix, drawCell } from './hex-draw.js'
import { setStartEnd, addObstacle } from './grid-utils.js'
import seededRandom from './seeded-ramdom.js'
import aStar from './a-star.js'
import interrupt from './interruptable-async-generator-function.js'


{
	let context
	let killCurrentAnimation
	onmessage = async function({data}) {
		if (data.canvas) {
			context = data.canvas.getContext("2d");
		}
		if(context && data.seed) {
			killCurrentAnimation?.()
			killCurrentAnimation = startWithSeed(context, data.seed)
		}
	};
}

function startWithSeed(context, seed) {
	let killChild
	const kill = interrupt(async function* () {
		const {matrix, start, end} = makeGrid(seed)
		await nextFrame()
		yield
		drawMatrix(context, matrix)
		await nextFrame()
		const path = aStar(matrix, start, end);
		yield
		await wait(400)
		yield
		if (path) {
			killChild = animatePath(context, matrix, path)
		}
	})
	return () => {
		kill()
		killChild?.()
	}
}

function animatePath(context, matrix, path) {
	return interrupt(async function* () {
		for (const cell of path) {
			cell.isPath = true
			await wait(30)
			await nextFrame()
			yield
			drawCell(context, matrix, cell)
		}
	})
}

function makeGrid(seed) {
	const random = seed ? seededRandom(seed) : undefined
	const matrix = new HexGrid(50, 86);
	const { start, end } = setStartEnd(matrix, random)
	for (let i = 0; i < 50; i++) {
		addObstacle(matrix, [start, end], [10, 150], random)
	}
	return {matrix, start, end}
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function nextFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve))
}
