
export function addObstacle(matrix, exclusions, [min, max] = [1, 100], random) {
	const start = {}
	const end = {}
	do {
		start.x = randomIndexX(random, matrix.i + 2) - 1
		start.y = randomIndexY(random, matrix.j + 2, start.x) - 1
		end.x = randomIndexX(random, matrix.i + 2) - 1
		end.y = randomIndexY(random, matrix.j + 2, end.x) - 1
	} while (
		areaAsCell(start, end) < min
		|| areaAsCell(start, end) > max
		|| Math.abs(start.y - end.y) <= 1
		|| Math.abs(start.x - end.x) <= 0.5
		|| Math.abs(start.y - end.y) / Math.abs(start.x - end.x) < 0.3
		|| Math.abs(start.x - end.x) / Math.abs(start.y - end.y) < 0.3
		|| exclusions.find(cell => 
			cell.x >= Math.min(start.x, end.x)
			&& cell.x <= Math.max(start.x, end.x)
			&& cell.y >= Math.min(start.y, end.y)
			&& cell.y <= Math.max(start.y, end.y)
		)
	)

	for(let x = Math.min(start.x, end.x); x < Math.max(start.x, end.x); x += 0.5) {
		for(let y = Math.min(start.y, end.y); y < Math.max(start.y, end.y); y += 0.5) {
			if(matrix[x] && matrix[x][y]) {
				matrix[x][y].isObstacle = true
			}
		}
	}
}

/** @param {import('./hex-structures.js').HexGrid} matrix */
export function setStartEnd(matrix, random, spacing) {
	const start = {}
	const end = {}
	do {
		start.x = randomIndexX(random, matrix.i)
		start.y = randomIndexY(random, matrix.j, start.x)
		end.x = randomIndexX(random, matrix.i)
		end.y = randomIndexY(random, matrix.j, end.x)
	} while (
		distance(start, end) < spacing
		|| Math.abs(start.y - end.y) <= matrix.j / 3
		|| Math.abs(start.x - end.x) <= matrix.i / 3
		// conditions below are a coping mechanism, it'd be better to check my math
		|| !matrix[start.x]
		|| !matrix[start.x][start.y]
		|| !matrix[end.x]
		|| !matrix[end.x][end.y]
	)

	const startCell = matrix[start.x][start.y]
	startCell.isStart = true
	const endCell = matrix[end.x][end.y]
	endCell.isEnd = true

	return {
		start: startCell,
		end: endCell,
	}
}

/** @param {number} max */
function randomIndexX(random = Math.random, max) {
	return Math.floor(random() * max * 2) / 2;
}

function randomIndexY(random = Math.random, _max, x) {
	const even = !(x % 1)
	const max = even ? _max : _max - 1;
	return Math.floor(random() * max) + (even ? 0 : 0.5);
}

function xDistance(a, b) {
	const xDelta = Math.abs(a.x - b.x);
	return xDelta * 2 * Math.sin(2 * Math.PI / 6)
}

function yDistance(a, b) {
	const yDelta = Math.abs(a.y - b.y);
	return yDelta * (1.5 + Math.cos(2 * Math.PI / 6)) / 2
}

function distance(a, b) {
	const xDelta = xDistance(a, b);
	const yDelta = yDistance(a, b);
	return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}

function area(a, b) {
	const xDelta = xDistance(a, b);
	const yDelta = yDistance(a, b);
	return xDelta * yDelta
}

function areaAsCell(a, b) {
	const xDelta = Math.abs(a.x - b.x) * 2;
	const yDelta = Math.abs(a.y - b.y) * 2;
	return xDelta * yDelta
}