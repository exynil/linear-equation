class SystemOfEquations {
	constructor(rows, cols, scale, x) {
		this.rows = rows;
		this.cols = cols;
		this.scale = scale;
		this.x = x / this.scale;
		this.coefficients = [];
		this.symbols = [];
		this.variables = [];
		this.scanScale = 3;
		this.exetrnalPoins = [];
	}
	initialization(coefficients, symbols) {
		// Конвертация одномерного массива в двумерный и извлечение значений из полей
		for (let i = 0; i < this.rows; i++) {
			this.coefficients.push([]);
			for (let j = 0; j < this.cols; j++) {
				this.coefficients[i][j] = parseInt(coefficients[i * this.cols + j]);
			}
		}
		this.symbols = symbols;
		this.variables = [];
	}
	calculate() {
		for (let i = 0; i < this.coefficients.length; i++) {
			this.variables.push([]);
			let y = (this.coefficients[i][2] + -this.coefficients[i][0] * this.x) / this.coefficients[i][1];
			// if (y == Infinity || y == -Infinity) {
			// 	// console.log('Ты был тут!');
			// 	// console.log('x: ' + this.x + ', y: ' + y);
			// 	y = 100;
			// 	this.x = 1;
			// }
			this.variables[i].push({
				x: this.x,
				y: y
			});
			y = (this.coefficients[i][2] + -this.coefficients[i][0] * -this.x) / this.coefficients[i][1];
			// if (y == Infinity || y == -Infinity) {
			// 	// console.log('Ты был тут!');
			// 	// console.log('x: ' + this.x + ', y: ' + y);
			// 	y = -100;
			// 	this.x = 1;
			// }
			this.variables[i].push({
				x: -this.x,
				y: y
			});
		}
		return this.variables;
	}
	scan(beginX, beginY, endX, endY) {
		let points = [];
		for (let i = beginX; i < endX; i += this.scanScale) {
			for (let j = beginY; j < endY; j += this.scanScale) {
				let access = true;
				for (let k = 0; k < this.coefficients.length; k++) {
					let x = Math.round((i - cs.x));
					let y = Math.round(-(j - cs.y));

					let result = this.coefficients[k][0] * x + this.coefficients[k][1] * y;
					switch (this.symbols[k]) {
						case '<=':
							if (result > this.coefficients[k][2] * this.scale) {
								access = false;
							}
							break;
						case '>=':
							if (result < this.coefficients[k][2] * this.scale) {
								access = false;
							}
							break;
						case '<':
							if (result >= this.coefficients[k][2] * this.scale) {
								access = false;
							}
							break;
						case '>':
							if (result <= this.coefficients[k][2] * this.scale) {
								access = false;
							}
							break;
					}
					if (access == false) {
						break;
					}
				}
				if (access) {
					points.push({
						x: i,
						y: j
					});
				}
			}
		}
		return points;
	}
	convert(points) {
		
		// for (let i = 0; i < points[i].length; i++) {
		// 	let min = points[0].;
		// 	for (let j = 0; j < points.length; j++) {
		// 		if
		// 	}
		// }
	}
	reduce() {
		if (this.rows > 1) {
			this.rows--;
		}
	}
	increase() {
		if (this.rows < 100) {
			this.rows++;
		}
	}
}