/**
 * @typedef {object} Cell
 * @property {number} x
 * @property {number} y
 */

export class HexArray extends Array {
	constructor() {
		super();
		return new Proxy(this, {
			get: (array, key, receiver) => {
				const index = Number(key);
				if (!isNaN(index)) {
					return Reflect.get(array, index * 2, receiver);
				}
				return Reflect.get(array, key, receiver);
			},
			set: (array, key, value, receiver) => {
				const index =  Number(key);
				if (!isNaN(index)) {
					return Reflect.set(array, index * 2, value, receiver);
				}
				return Reflect.set(array, key, value, receiver);
			}
		});
	}

	*[Symbol.iterator]() {
		for (let i = 0; i < this.length; i += 0.5) {
			if (typeof this[i] !== "undefined") {
				yield this[i];
			}
		}
	}
}

export class HexGrid {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.length = i;
		this.X = new HexArray();
		for (let x = 0; x < i - 0.5; x += 0.5) {
			this.X[x] = new HexArray();
			const even = !(x % 1)
			const start = even ? 0 : 0.5;
			const max = even ? j : j - 1;
			for (let y = start; y < max; y += 1) {
				this.X[x][y] = { x, y };
			}
		}

		return new Proxy(this, {
			get: (object, key, receiver) => {
				if (!isNaN(Number(key))) {
					return Reflect.get(this.X, key, receiver);
				}
				return Reflect.get(object, key, receiver);
			},
			set: (object, key, value, receiver) => {
				if (!isNaN(Number(key))) {
					return Reflect.set(this.X, key, value, receiver);
				}
				return Reflect.set(object, key, value, receiver);
			}
		});
	}

	/** @param {(cell: Cell, index: [number, number], self: HexGrid) => void} callback */
	forEach(callback) {
		for (let x = 0; x < this.i - 0.5; x += 0.5) {
			const even = !(x % 1)
			const start = even ? 0 : 0.5;
			const max = even ? this.j : this.j - 1;
			for (let y = start; y < max; y += 1) {
				try {
					callback(this.X[x][y], [x, y], this);
				} catch (e) {
					throw new Error(`Error in callback: x=${x}, y=${y}, ${e.message}`);
				}
			}
		}
	}
}