import { HexGrid } from './hex-structures.js'
import { drawMatrix, drawCell } from './hex-draw.js'
import { setStartEnd, addObstacle } from './grid-utils.js'
import seededRandom from './seeded-ramdom.js'
import aStar from './a-star.js'
import interrupt from './interruptable-async-generator-function.js'


{
	let context, side
	let killCurrentAnimation
	onmessage = async function({data}) {
		if (data.canvas) {
			context = data.canvas.getContext("2d");
		}
		if (data.side) {
			side = data.side
		}
		if(context && data.seed) {
			killCurrentAnimation?.()
			killCurrentAnimation = startWithSeed(context, data.seed, side)
		}
	};
}

function startWithSeed(context, seed, side) {
	let killChild
	const random = seed ? seededRandom(seed) : undefined
	const kill = interrupt(async function* () {
		let path, matrix
		do {
			const grid = makeGrid(random, side)
			matrix = grid.matrix
			const {start, end} = grid
			await nextFrame()
			yield
			drawMatrix(context, matrix)
			await nextFrame()
			path = aStar(matrix, start, end);
		} while(!path)
		yield
		await wait(400)
		yield
		killChild = animatePath(context, matrix, path)
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

// const GRID_SIZE = [50, 86]
// const DISTANCE = 90
// const OBSTACLE_COUNT = 50
// const OBSTACLE_SIZE = [10, 150]

// const GRID_SIZE = [20, 34]
// const DISTANCE = 10
// const OBSTACLE_COUNT = 10
// const OBSTACLE_SIZE = [3, 20]

function makeGrid(random, side) {
	const {
		GRID_SIZE,
		DISTANCE,
		OBSTACLE_COUNT,
		OBSTACLE_SIZE,
	} = makeParams(side)
	const matrix = new HexGrid(...GRID_SIZE);
	const { start, end } = setStartEnd(matrix, random, DISTANCE)
	for (let i = 0; i < OBSTACLE_COUNT; i++) {
		addObstacle(matrix, [start, end], OBSTACLE_SIZE, random)
	}
	return {matrix, start, end}
}

function makeParams(side){
	const x = Math.round(side / 20)
	const y = x + Math.round((x + x * Math.cos(2 * Math.PI / 6) - Math.cos(2 * Math.PI / 6)) / 2) - 2
	const distance = (x + y) * 0.5
	const obstacleCount = Math.round(x * y) / 90
	const obstacleSize = [
		Math.floor(x * y / 300),
		Math.ceil(x * y / 20),
	]
	return {
		GRID_SIZE: [x, y],
		DISTANCE: distance,
		OBSTACLE_COUNT: obstacleCount,
		OBSTACLE_SIZE: obstacleSize,
	}
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function nextFrame() {
	return new Promise(resolve => requestAnimationFrame(resolve))
}
