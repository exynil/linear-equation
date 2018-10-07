class SystemOfEquations {
	constructor(rows, cols, scale, centerX, centerY) {
		this.rows = rows;
		this.cols = cols;
		this.scale = scale;
		this.centerX = centerX / this.scale;
		this.centerY = centerY / this.scale;
		this.coefficients = [];
		this.symbols = [];
		this.variables = [];
		this.scanScale = 1;
		this.exetrnalPoins = [];
	}
	// Инициализация данных
	initialization(coefficients, symbols) {
		this.coefficients = [];
		this.variables = [];
		this.symbols = symbols;
		// Конвертация одномерного массива в двумерный и извлечение значений из полей
		for (let i = 0; i < this.rows; i++) {
			this.coefficients.push([]);
			for (let j = 0; j < this.cols; j++) {
				this.coefficients[i][j] = parseInt(coefficients[i * this.cols + j]);
			}
		}
	}
	// Вычисление точек
	calculate() {
		for (let i = 0; i < this.coefficients.length; i++) {
			this.variables.push([]);
			let x = this.centerX;
			let y = (this.coefficients[i][2] + -this.coefficients[i][0] * x) / this.coefficients[i][1];

			if (y == Infinity || NaN || y == -Infinity) {
				x = this.coefficients[i][2] / this.coefficients[i][0];
				y = -100;
			}

			this.variables[i].push({
				x: x,
				y: y
			});

			x = -this.centerX;
			y = (this.coefficients[i][2] + -this.coefficients[i][0] * x) / this.coefficients[i][1];

			if (y == Infinity || NaN || y == -Infinity) {
				x = this.coefficients[i][2] / this.coefficients[i][0];;
				y = 100;
			}

			this.variables[i].push({
				x: x,
				y: y
			});
		}
		return this.variables;
	}
	// Сканирование и поиск области допустимых значений
	scan(beginX, beginY, endX, endY) {
		let points = [];
		for (let i = beginX; i < endX; i += this.scanScale) {
			for (let j = beginY; j < endY; j += this.scanScale) {
				let access = true;
				for (let k = 0; k < this.coefficients.length; k++) {
					let x = Math.round((i - this.centerX * this.scale));
					let y = Math.round(-(j - this.centerY * this.scale));

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
	update(scale, centerX, centerY) {
		this.scale = scale;
		this.centerX = centerX / this.scale;
		this.centerY = centerY / this.scale;
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