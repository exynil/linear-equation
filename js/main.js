var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var colors = ['#00FF7F', '#7B68EE', '#00FFFF'];

var mouse = {
	x: 400,
	y: 400
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
	soe = new SystemOfEquations(rows, cols, cs.scale, cs.x);
	cp = new ControlPanel(rows, cols);

	cp.updateForm(rows, cols);

	initTestCoefficients(); // импорт тестовых данных

	soe.initialization(cp.readFields(), cp.readSymbols());
	cs.update();
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
	cs.update();
}

function drawWithoutinItialization() {
	// Очистка холста
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Прорисовка
	cs.update(mouse.x, mouse.y);
}

// Работает
function onclick(event) {
	if (cs.ruler) {
		cs.addAPointToTheRuler((event.x - cs.x) / cs.scale, (event.y - cs.y) / cs.scale);
		drawWithoutinItialization();
	} else {
		// this.classList.add('btn-success');
		// this.classList.remove('btn-outline-success');
		if (event.ctrlKey) {
			cs.deletePoint((event.x - cs.x) / cs.scale, (event.y - cs.y) / cs.scale);
			drawWithoutinItialization();
		} else {
			cs.drawPoint((event.x - cs.x) / cs.scale, (event.y - cs.y) / cs.scale);
		}
	}
}

function toggleRuler() {
	cs.toggleRuler();
	if (cs.ruler) {
		canvas.onmousemove = function(event) {
			mouse.x = event.x;
			mouse.y = event.y;
			drawWithoutinItialization();
		}
	} else {
		canvas.onmousemove = null;
		drawWithoutinItialization();
	}
}

// Заполнение области допустимых значений
function fill() {
	draw();
	cs.fillByPoints(soe.scan(0, 0, canvas.width, canvas.height));
}

// Очистка всех полей [Работает 100%]
function clearFields() {
	cp.clearFields();
}

// Удаления прорисованного графика [Работает 100%]
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
	soe.scale = cs.reduceGrid();
	drawWithoutinItialization();
}

function increaseGrid() {
	soe.scale = cs.increaseGrid();
	drawWithoutinItialization();
}

function toggleLineType() {
	cs.toggleLineType();
	drawWithoutinItialization();
}

// Импорт коэффицентов для тестирования
function initTestCoefficients() {
	// Экспорт коэфицентов для тестирования
	let fields = document.getElementsByClassName('field');

	// let fieldValues = [
	// 	[1, 2, 6],
	// 	[2, 1, 8],
	// 	[0, 1, 2],
	// 	[-1, 1, 1],
	// 	[1, 0, 0],
	// 	[0, 1, 0]
	// ];
	let fieldValues = [
		[-9, 5, 9],
		[-1, 7, 4],
		[-6, -5, 4],
		[-4, -9, -8],
		[-1, 4, -10],
		[-7, -2, 8]
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