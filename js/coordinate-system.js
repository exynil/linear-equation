class CoordinateSystem {
	constructor(canvas, ctx, scale) {
		this.centerX = canvas.width / 2;
		this.centerY = canvas.height / 2;
		this.ctx = ctx;
		this.canvas = canvas;
		this.gridStatus = true;
		this.scale = scale;
		this.axisLineWidth = 1;
		this.axisLineColor = '#FF9000';
		this.gridLineWidth = 0.5;
		this.gridLineColor = 'gray';
		this.numberColor = 'gray';
		this.point = false;
		this.pointColor = '#B114FF';
		this.pointRadius = 5;
		this.coordinatesOfPoints = [];
		this.coordinatesOfLines = [];
		this.lineСolors = [];
		this.rulerPoints = [];
		this.rulerLineColor = '#14F8FF';
		this.rulerPointColor = '#FF9000';
		this.rulerAngleColor = '#14F8FF';
		this.rulerPointCoordinateColor = '#FF9000';
		this.rulerMainTextColor = '#27EBA4';
		this.rulerMouseTextColor = '#FF9000';
		this.ruler = false;
		this.rulerLength;
		this.theNumberOfPointsInTheLine;
		this.lineType = false;
		this.fillColorOfTheRangeOfValidValues = 'rgba(255, 69, 69, 0.4)';
		this.errorColor = '#F50338';
		this.numberingTextSize = 10;
	}
	initialization(coordinatesOfLines, colors) {
		this.coordinatesOfLines = coordinatesOfLines;
		this.lineСolors = colors;
	}
	update(mouseX, mouseY) {
		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;
		if (this.centerX - Math.round(this.centerX) == 0) {
			this.centerX += 0.5;
		}
		if (this.centerY - Math.round(this.centerY) == 0) {
			this.centerY += 0.5;
		}
		if (this.gridStatus) {
			this.drawGrid();
		}

		this.drawAxis();
		this.drawNumbering();
		this.drawAllPoints();
		this.drawLines();
		this.drawRulers(mouseX, mouseY);
	}
	drawAxis() {
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.moveTo(this.centerX, 0);
		this.ctx.lineTo(this.centerX, this.canvas.height);
		this.ctx.moveTo(0, this.centerY);
		this.ctx.lineTo(this.canvas.width, this.centerY);
		this.ctx.lineWidth = this.axisLineWidth;
		this.ctx.strokeStyle = this.axisLineColor;
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.lineWidth = this.axisLineWidth;
		this.ctx.strokeStyle = this.axisLineColor;
		for (let i = this.centerX % this.scale; i < this.canvas.width; i += this.scale) {
			this.ctx.moveTo(i, this.centerY - 3);
			this.ctx.lineTo(i, this.centerY + 3);
		}
		for (let i = this.centerY % this.scale; i < this.canvas.height; i += this.scale) {
			this.ctx.moveTo(this.centerX - 3, i);
			this.ctx.lineTo(this.centerX + 3, i);
		}
		this.ctx.stroke();
		this.ctx.restore();
		this.ctx.closePath();

	}
	drawNumbering() {
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.textAlign = 'right';
		this.ctx.textBaseline = "top";
		this.ctx.font = 'bold ' + this.numberingTextSize + 'pt Courier New';
		this.ctx.fillStyle = this.numberColor;
		// Прорисовка X положительных и X отрицательных
		for (let i = this.scale; i < this.centerX; i += this.scale) {
			this.ctx.fillText(i / this.scale, this.centerX + i, this.centerY);
			this.ctx.fillText(-i / this.scale, this.centerX - i, this.centerY);
		}
		// Прорисовка Y положительных и Y отрицательных
		for (let i = this.scale; i < this.centerY; i += this.scale) {
			this.ctx.fillText(i / this.scale, this.centerX, this.centerY - i);
			this.ctx.fillText(-i / this.scale, this.centerX, this.centerY + i);
		}
		this.ctx.restore();
		this.ctx.closePath();
	}
	drawGrid() {
		for (let i = this.centerX % this.scale; i < this.canvas.width; i += this.scale) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.moveTo(i, 0);
			this.ctx.lineTo(i, this.canvas.height);
			this.ctx.strokeStyle = this.gridLineColor;
			this.ctx.lineWidth = this.gridLineWidth;
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();
		}
		for (let i = this.centerY % this.scale; i < this.canvas.height; i += this.scale) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.moveTo(0, i);
			this.ctx.lineTo(this.canvas.width, i);
			this.ctx.strokeStyle = this.gridLineColor;
			this.ctx.lineWidth = this.gridLineWidth;
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
	drawLines() {
		for (let i = 0; i < this.coordinatesOfLines.length; i++) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.strokeStyle = this.lineСolors[i];
			this.ctx.lineWidth = 1;
			if (this.lineType) {
				this.ctx.setLineDash([5, 5]);
			}
			this.ctx.moveTo(this.centerX + this.coordinatesOfLines[i][0].x * this.scale, this.centerY - this.coordinatesOfLines[i][0].y * this.scale);
			this.ctx.lineTo(this.centerX + this.coordinatesOfLines[i][1].x * this.scale, this.centerY - this.coordinatesOfLines[i][1].y * this.scale);
			this.ctx.stroke();
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
	fillByPoints(points) {
		if (points.length == 0) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.textAlign = 'center';
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = this.errorColor;
			this.ctx.font = 'bold 30pt Courier New';
			this.ctx.fillStyle = this.errorColor;
			this.ctx.fillText('[Система не имеет решения]', this.canvas.width / 2, this.canvas.height - 30);
			this.ctx.restore();
			this.ctx.closePath();
		}
		for (let i = 0; i < points.length; i++) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.fillStyle = this.fillColorOfTheRangeOfValidValues;
			this.ctx.fillRect(points[i].x, points[i].y, 1, 1);
			this.ctx.restore();
			this.ctx.closePath();
		}
	}

	addAPointToTheRuler(x, y) {
		if (this.rulerPoints.length == 0) {
			this.rulerPoints.push([]);
		}
		this.rulerPoints[this.rulerPoints.length - 1].push({
			x: x,
			y: y
		});
	}
	drawRulers(mouseX, mouseY) {
		this.rulerLength = 0;
		// Прорисовка линий в линейке
		for (let i = 0; i < this.rulerPoints.length; i++) {
			for (let j = 0; j < this.rulerPoints[i].length - 1; j++) {
				let dist = this.getDistance(this.rulerPoints[i][j].x, this.rulerPoints[i][j].y, this.rulerPoints[i][j + 1].x, this.rulerPoints[i][j + 1].y).toFixed(2);
				if (i == this.rulerPoints.length - 1) {
					this.rulerLength += parseFloat(dist);
				}
				let textX = this.rulerPoints[i][j + 1].x * this.scale + this.centerX;
				let textY = this.centerY - this.rulerPoints[i][j + 1].y * this.scale;
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.moveTo(this.rulerPoints[i][j].x * this.scale + this.centerX, this.centerY - this.rulerPoints[i][j].y * this.scale);
				this.ctx.lineTo(this.rulerPoints[i][j + 1].x * this.scale + this.centerX, this.centerY - this.rulerPoints[i][j + 1].y * this.scale);
				this.ctx.strokeStyle = this.rulerLineColor;
				this.ctx.stroke();
				this.ctx.font = 'bold 11pt Courier New';
				this.ctx.textAlign = 'center';
				this.ctx.textBaseline = 'top';
				this.ctx.fillStyle = this.rulerPointCoordinateColor;
				this.ctx.fillText(dist, textX, textY + 10);
				this.ctx.restore();
				this.ctx.closePath();
			}
		}
		// Прорисовка точек в линейке
		for (let i = 0; i < this.rulerPoints.length; i++) {
			for (let j = 0; j < this.rulerPoints[i].length; j++) {
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.fillStyle = this.rulerPointColor;
				this.ctx.arc(this.rulerPoints[i][j].x * this.scale + this.centerX, this.centerY - this.rulerPoints[i][j].y * this.scale, 3, Math.PI * 2, false);
				this.ctx.fill();
				this.ctx.restore();
				this.ctx.closePath();

				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.strokeStyle = this.rulerLineColor;
				this.ctx.arc(this.rulerPoints[i][j].x * this.scale + this.centerX, this.centerY - this.rulerPoints[i][j].y * this.scale, 7, Math.PI * 2, false);
				this.ctx.stroke();
				this.ctx.restore();
				this.ctx.closePath();
			}
		}
		// Прорисовка линии от последней точки в линейке до курсора мыши
		// Прорисовка общей длины, кол-ва точек, кол-во сегментов и угол
		if (this.ruler && this.rulerPoints.length > 0) {
			if (this.rulerPoints[this.rulerPoints.length - 1].length > 0) {
				let x = this.rulerPoints[this.rulerPoints.length - 1][this.rulerPoints[this.rulerPoints.length - 1].length - 1].x;
				let y = this.rulerPoints[this.rulerPoints.length - 1][this.rulerPoints[this.rulerPoints.length - 1].length - 1].y;
				let dist = this.getDistance(x, y, (mouseX - this.centerX) / this.scale, (this.centerY - mouseY) / this.scale).toFixed(2);

				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.setLineDash([5, 5]);
				this.ctx.moveTo(x * this.scale + this.centerX, this.centerY - y * this.scale);
				this.ctx.lineTo(mouseX, mouseY);
				this.ctx.strokeStyle = this.rulerLineColor;
				this.ctx.stroke();
				this.ctx.font = 'bold 11pt Courier New';

				let length = 'Длина: ' + dist;
				let coordinates = '[x: ' + ((mouseX - this.centerX) / this.scale).toFixed(1) + ', y:' + ((this.centerY - mouseY) / this.scale).toFixed(1) + ']';
				let marginLeft = 20;
				let marginTop = 20;

				// Адаптация вывода надписи
				if (mouseX < this.ctx.measureText(coordinates).width + marginLeft) {
					this.ctx.textAlign = 'left';
				} else {
					this.ctx.textAlign = 'right';
					marginLeft = -marginLeft;
				}

				if (mouseY > this.canvas.height - 50) {
					this.ctx.textBaseline = 'bottom';
					marginTop = -marginTop;
				} else {
					this.ctx.textBaseline = 'top';
				}

				this.ctx.fillStyle = this.rulerMouseTextColor;
				this.ctx.fillText(length, mouseX + marginLeft, mouseY + marginTop);
				this.ctx.fillText(coordinates, mouseX + marginLeft, mouseY + marginTop + 20);
				this.ctx.restore();
				this.ctx.closePath();

				// Прорисовка длины линейки
				this.theNumberOfPointsInTheLine = this.rulerPoints[this.rulerPoints.length - 1].length;
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.shadowBlur = 5;
				this.ctx.shadowColor = this.rulerMainTextColor;
				this.ctx.font = '13pt Courier New';
				this.ctx.textAlign = 'left';
				this.ctx.fillStyle = this.rulerMainTextColor;
				this.ctx.fillText('Общая длина: ' + this.rulerLength.toFixed(2) + ' ед.', this.canvas.width - 300, this.canvas.height - 110);
				this.ctx.fillText('Кол-во точек: ' + this.theNumberOfPointsInTheLine, this.canvas.width - 300, this.canvas.height - 80);
				this.ctx.fillText('Кол-во сегментов: ' + (this.theNumberOfPointsInTheLine - 1), this.canvas.width - 300, this.canvas.height - 50);
				this.ctx.restore();
				this.ctx.closePath();
			}
			// Вычисление угла
			if (this.rulerPoints[this.rulerPoints.length - 1].length > 1) {
				let a = this.rulerPoints[this.rulerPoints.length - 1][this.rulerPoints[this.rulerPoints.length - 1].length - 1];
				let b = this.rulerPoints[this.rulerPoints.length - 1][this.rulerPoints[this.rulerPoints.length - 1].length - 2];
				let c = a;
				let d = {
					x: (mouseX - this.centerX) / this.scale,
					y: (this.centerY - mouseY) / this.scale
				};

				let alpha = this.getAngle(a, b, c, d);

				let alphaNull = this.getAngle(a, b, c, {
					x: a.x + 1,
					y: a.y
				});

				let radians = Math.acos(alpha);

				let radiansNull = Math.acos(alphaNull);

				// Прорисовка угла и окружности
				this.ctx.beginPath();
				this.ctx.save();
				this.ctx.strokeStyle = this.rulerLineColor;
				let anticlockwise;
				let startAngle;
				let endAngle;
				if (b.y >= a.y) {
					startAngle = -radiansNull;
					anticlockwise = false;
					endAngle = radians - radiansNull;
				} else if (b.y < a.y) {
					startAngle = radiansNull;
					anticlockwise = true;
					endAngle = radiansNull - radians;
				}

				this.ctx.arc(this.centerX + a.x * this.scale, this.centerY - a.y * this.scale, 50, startAngle, endAngle, anticlockwise);
				this.ctx.font = 'bold 11pt Courier New';
				this.ctx.textAlign = 'center';
				this.ctx.textBaseline = 'bottom';
				this.ctx.fillStyle = this.rulerAngleColor;
				this.ctx.fillText((Math.acos(alpha) * 180 / Math.PI).toFixed(2) + '°', this.centerX + a.x * this.scale, this.centerY - a.y * this.scale - 10);
				this.ctx.stroke();
				this.ctx.restore();
				this.ctx.closePath();
			}
		}
	}
	deleteLastPointInRuler() {
		this.rulerPoints[this.rulerPoints.length - 1].pop();
	}
	toggleRuler() {
		if (this.ruler) {
			this.ruler = false;
		} else {
			this.ruler = true;
			this.point = false;
			if (this.rulerPoints[this.rulerPoints.length - 1] != 0) {
				this.rulerPoints.push([]);
			}
		}
	}
	togglePoint() {
		if (this.point) {
			this.point = false;
		} else {
			this.point = true;
			this.ruler = false;
		}
	}
	addAndDrawPoint(x, y) {
		this.coordinatesOfPoints.push({
			x: x,
			y: y
		});
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.shadowBlur = 30;
		this.ctx.shadowColor = this.pointColor;
		this.ctx.arc(x * this.scale + this.centerX, this.centerY - y * this.scale, this.pointRadius, Math.PI * 2, false);
		this.ctx.fillStyle = this.pointColor;
		this.ctx.fill();
		this.ctx.restore();
		this.ctx.closePath();
	}
	drawAllPoints() {
		for (let i = 0; i < this.coordinatesOfPoints.length; i++) {
			this.ctx.beginPath();
			this.ctx.save();
			this.ctx.shadowBlur = 30;
			this.ctx.shadowColor = this.pointColor;
			this.ctx.fillStyle = this.pointColor;
			this.ctx.arc(this.coordinatesOfPoints[i].x * this.scale + this.centerX, this.centerY - this.coordinatesOfPoints[i].y * this.scale, this.pointRadius, Math.PI * 2, false);
			this.ctx.fill();
			this.ctx.restore();
			this.ctx.closePath();
		}
	}
	deletePoint(x, y) {
		for (let i = 0; i < this.coordinatesOfPoints.length; i++) {
			let point = {
				x: this.coordinatesOfPoints[i].x,
				y: this.coordinatesOfPoints[i].y
			}
			if (point.x >= x - this.pointRadius / this.scale && point.x <= x + this.pointRadius / this.scale && point.y >= y - this.pointRadius / this.scale && point.y <= y + this.pointRadius / this.scale) {
				this.coordinatesOfPoints.splice(i, 1);
			}
		}
		this.update();
	}
	deleteAllPoints() {
		this.coordinatesOfPoints = [];
	}
	deleteAllLines() {
		this.coordinatesOfLines = [];
	}
	deleteAllRulers() {
		this.rulerPoints = [];
	}
	// Включение и отключение сетки
	toggleGrid() {
		if (this.gridStatus) {
			this.gridStatus = false;
			return false;
		}
		else {
			this.gridStatus = true
			return true;
		}
	}
	reducingGrid() {
		if (this.scale > 10) {
			this.scale -= 5;
			this.numberingTextSize -= 2;
		}
	}
	increasingGrid() {
		if (this.scale < 150) {
			this.scale += 5;
			this.numberingTextSize += 2;
		}
	}
	toggleLineType() {
		if (this.lineType) {
			this.lineType = false;
		} else {
			this.lineType = true;
		}
	}
	getAngle(a, b, c, d) {
		let ab = {
			x: a.x - b.x,
			y: a.y - b.y
		};

		let cd = {
			x: c.x - d.x,
			y: c.y - d.y
		};

		let abcd = ab.x * cd.x + ab.y * cd.y;

		let abv = Math.pow(ab.x, 2) + Math.pow(ab.y, 2);

		let cdv = Math.pow(cd.x, 2) + Math.pow(cd.y, 2);

		return abcd / Math.sqrt(abv * cdv);
	}
	getDistance(x1, y1, x2, y2) {
		let xDistance = x2 - x1;
		let yDistance = y2 - y1;

		return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
	}
}