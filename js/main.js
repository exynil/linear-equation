var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var colors = ['#00FF7F', '#7B68EE', '#00FFFF'];

var mouse = {
	x: 0,
	y: 0
}

canvas.width = innerWidth;
canvas.height = innerHeight;

var cs; // Система координат
var soe; // Система уравнений
var cp; // Панель управления

// Начальная инициализация и настройка объектов
function init() {
	let rows = 6;
	let cols = 3;
	let scale = 30;
	cs = new CoordinateSystem(canvas, ctx, scale);
	soe = new SystemOfEquations(rows, cols, cs.scale, cs.centerX, cs.centerY);
	cp = new ControlPanel(rows, cols);

	cp.updateForm(rows, cols);

	initTestCoefficients(); // импорт тестовых данных

	cs.update(mouse.x, mouse.y);
}

init();

function reduce() {
	cp.reduce();
	soe.reduce();
}

function increase() {
	cp.increase();
	soe.increase();
}

// Работает
function draw() {
	// Очистка холста
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Инициализация или обновление данных
	soe.initialization(cp.readFields(), cp.readSymbols());
	// Получение координат на прорисовку
	cs.initialization(soe.calculate(), cp.readColors());
	// Прорисовка
	cs.update(mouse.x, mouse.y);
}

function drawWithoutinItialization() {
	// Очистка холста
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Прорисовка
	cs.update(mouse.x, mouse.y);
}

// Работает
function onclick(event) {
	if (event.target.localName == 'div' || event.target.localName == 'canvas') {
		if (cs.ruler) {
			cs.addAPointToTheRuler((event.x - cs.centerX) / cs.scale, (event.y - cs.centerY) / cs.scale);
			drawWithoutinItialization();
		} else {
			// this.classList.add('btn-success');
			// this.classList.remove('btn-outline-success');
			if (event.ctrlKey) {
				cs.deletePoint((event.x - cs.centerX) / cs.scale, (event.y - cs.centerY) / cs.scale);
				drawWithoutinItialization();
			} else {
				cs.drawPoint((event.x - cs.centerX) / cs.scale, (event.y - cs.centerY) / cs.scale);
			}
		}
	}

}

function toggleRuler() {
	cs.toggleRuler();
	if (cs.ruler) {
		window.onmousemove = function(event) {
			mouse.x = event.x;
			mouse.y = event.y;
			drawWithoutinItialization();
		}
	} else {
		window.onmousemove = null;
		drawWithoutinItialization();
	}
}

// Заполнение области допустимых значений
function fill() {
	draw();
	cs.fillByPoints(soe.scan(0, 0, canvas.width, canvas.height));
}

// Очистка всех полей
function clearFields() {
	cp.clearFields();
}

// Удаления всех графиков
function deleteAll() {
	cs.deleteAllLines();
	cs.deleteAllPoints();
	deleteAllRulers()
	drawWithoutinItialization();
}

// Удаление всех прямых
function deleteAllLines() {
	cs.deleteAllLines();
	drawWithoutinItialization();
}

// Удаление всех точек
function deleteAllPoints() {
	cs.deleteAllPoints();
	drawWithoutinItialization();
}

// Удаление всех линеек
function deleteAllRulers() {
	cs.deleteAllRulers();
	drawWithoutinItialization();
}
// Включение и отключение прозрачности
function changeOpacity() {
	cp.changeOpacity();
}

// Заполнение полей случайными коэффицентами
function random() {
	cp.random();
	draw();
}

// Включение и отключение прозрачности
function turnGridOnAndOff() {
	cs.turnGridOnAndOff();
	drawWithoutinItialization();
}

function reduceGrid() {
	cs.reduceGrid();
	soe.update(cs.scale, cs.centerX, cs.centerY);
	draw();
}

function increaseGrid() {
	cs.increaseGrid()
	soe.update(cs.scale, cs.centerX, cs.centerY);
	draw();
}

function toggleLineType() {
	cs.toggleLineType();
	drawWithoutinItialization();
}

function minimizeControlPanel() {
	// let panel = document.getElementById('panel');
	// panel.style.marginTop = -200; 
	console.log(getComputedStyle(this));
}

// Импорт коэффицентов для тестирования
function initTestCoefficients() {
	// Экспорт коэфицентов для тестирования
	let fields = document.getElementsByClassName('field');

	let symbols = document.getElementsByClassName('symbol');

	symbols[4].value = '>=';
	symbols[5].value = '>=';

	let fieldValues = [
		[1, 2, 6],
		[2, 1, 8],
		[0, 1, 2],
		[-1, 1, 1],
		[1, 0, 0],
		[0, 1, 0]
	];

	for (let i = 0; i < fieldValues.length; i++) {
		for (let j = 0; j < soe.cols; j++) {
			fields[i * soe.cols + j].value = fieldValues[i][j];
		}
	}
}

// Генерация слуйного числа из диапазона
function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

// Генерация случайного цвета
function randomColor() {
	let red = Math.floor(Math.random() * 255);
	let green = Math.floor(Math.random() * 255);
	let blue = Math.floor(Math.random() * 255);
	return 'rgb(' + red + ', ' + green + ',' + blue + ')';
}