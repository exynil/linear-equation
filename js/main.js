var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var mouse = {
	x: 0,
	y: 0
}

var cs; // Система координат
var soe; // Система уравнений
var form; // Форма

// Начальная инициализация и настройка объектов
function init() {
	let rows = 4;
	let cols = 3;
	let scale = 30;
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	cs = new CoordinateSystem(canvas, ctx, scale);
	soe = new SystemOfEquations(rows, cols, cs.scale, cs.centerX, cs.centerY);
	form = new Form(rows, cols);

	form.updateForm(rows, cols);
	tieButtons();

	initTestCoefficients(); // импорт тестовых данных

	cs.update(mouse.x, mouse.y);
}

init();

function tieButtons() {
	let fields = document.getElementsByClassName('field');

	for (let i = 0; i < fields.length; i++) {
		fields[i].oninput = function() {
			draw();
		}
	}

	let deleteFieldButtons = document.getElementsByClassName('delete-field-button');

	for (let i = 0; i < deleteFieldButtons.length; i++) {
		deleteFieldButtons[i].onclick = function() {
			this.parentElement.parentElement.parentElement.parentElement.remove();
			form.rows--;
			draw();
		}
	}

	let colorFieldButtons = document.getElementsByClassName('color');

	for (let i = 0; i < colorFieldButtons.length; i++) {
		colorFieldButtons[i].onchange = function(event) {
			draw();
		}
	}
}

// Уменьшение формы
function reducingForm() {
	form.reducingForm();
	tieButtons();
	soe.reducingSystemOfEquation();
}

// Увеличение формы
function increasingForm() {
	form.increasingForm();
	tieButtons();
	soe.increasingSystemOfEquation();
}

// Работает
function draw() {
	// Очистка холста
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Инициализация или обновление данных
	soe.initialization(form.readFields(), form.readSymbols());
	// Получение координат на прорисовку
	cs.initialization(soe.calculate(), form.readColors());
	// Прорисовка
	cs.update(mouse.x, mouse.y);
}

function drawWithoutInitialization() {
	// Очистка холста
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Прорисовка
	cs.update(mouse.x, mouse.y);
}

// Обработка события клик
function onclick(event) {
	if (cs.point && (event.target.localName == 'div' || event.target.localName == 'canvas')) {
		if (event.ctrlKey) {
			cs.deletePoint((event.x - cs.centerX) / cs.scale, (cs.centerY - event.y) / cs.scale);
			drawWithoutInitialization();
		} else if (cs.point) {
			cs.addAndDrawPoint((event.x - cs.centerX) / cs.scale, (cs.centerY - event.y) / cs.scale);
		}
	}
}

function togglePoint() {
	cs.togglePoint();
	if (cs.point) {
		this.className = 'btn btn-success material-icons font-weight-bold';
		drawWithoutInitialization();
		document.getElementById('ruler').className = 'btn btn-outline-success material-icons font-weight-bold';
	} else {
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
	}
}

function toggleLock() {
	if (this.className == 'btn btn-success material-icons font-weight-bold') {
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
		dragElement(document.getElementById('panel'));
		this.textContent = 'lock_open';
	} else {
		this.className = 'btn btn-success material-icons font-weight-bold';
		document.getElementById('panel').onmousedown = null;
		this.textContent = 'lock';
	}
}

function toggleBinding() {
	if (cs.toggleBinding()) {
		this.className = 'btn btn-success material-icons font-weight-bold';
		this.textContent = 'location_searching';
	} else {
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
		this.textContent = 'location_disabled';
	}
}

function togglePointMethod() {
	if (soe.scanScale == 1) {
		soe.scanScale = 3;
		this.className = 'btn btn-success material-icons font-weight-bold';
		this.textContent = 'blur_on';
		cs.fillColorOfTheRangeOfValidValues = 'rgba(255, 69, 69, 1)';
	} else {
		soe.scanScale = 1;
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
		this.textContent = 'blur_off';
		cs.fillColorOfTheRangeOfValidValues = 'rgba(255, 69, 69, 0.4)';
	}
}

// Включение и отключение прозрачности
function toggleOpacity() {
	let panel = document.getElementById('panel');
	if (getComputedStyle(document.getElementById('panel')).opacity == '1') {
		panel.style.opacity = 0.3;
		this.className = 'btn btn-success material-icons font-weight-bold';
		this.textContent = 'visibility';
	} else {
		panel.style.opacity = 1;
		this.textContent = 'visibility_off';
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
	}
}

// Включение и отключение линейки
function toggleRuler() {
	cs.toggleRuler();
	if (cs.ruler) {
		window.onmousemove = trace;
		this.className = 'btn btn-success material-icons font-weight-bold';
		document.getElementById('point').className = 'btn btn-outline-success material-icons font-weight-bold';
	} else {
		window.onmousemove = null;
		window.onmouseup = null;
		drawWithoutInitialization();
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
	}
}

// Отслеживание курсора во время включенной линейки
function trace(event) {
	mouse.x = event.x;
	mouse.y = event.y;
	drawWithoutInitialization();
	window.onmousedown = function(event) {
		if (event.ctrlKey && event.button == 0) {
			let mx = (mouse.x - cs.centerX) / cs.scale;
			let my = (cs.centerY - mouse.y) / cs.scale;
			let rowIndex, colIndex;
			for (let i = 0; i < cs.rulerPoints.length; i++) {
				for (let j = 0; j < cs.rulerPoints[i].length; j++) {
					if (mx > cs.rulerPoints[i][j].x - 10 / cs.scale && mx < cs.rulerPoints[i][j].x + 10 / cs.scale && my > cs.rulerPoints[i][j].y - 10 / cs.scale && my < cs.rulerPoints[i][j].y + 10 / cs.scale) {
						rowIndex = i;
						colIndex = j;
						break;
					}
				}
				if (rowIndex != undefined || colIndex != undefined) {
					window.onmousemove = function(event) {
						mouse.x = event.x;
						mouse.y = event.y;
						cs.rulerPoints[rowIndex][colIndex].x = (event.x - cs.centerX) / cs.scale;
						cs.rulerPoints[rowIndex][colIndex].y = (cs.centerY - event.y) / cs.scale;
						drawWithoutInitialization();
					}
					window.onmouseup = function(event) {
						if (rowIndex != undefined && colIndex != undefined && (event.target.localName == 'div' || event.target.localName == 'canvas')) {
							cs.changePointLocation(rowIndex, colIndex, (event.x - cs.centerX) / cs.scale, (cs.centerY - event.y) / cs.scale);
							rowIndex = colIndex = undefined;
						}
						window.onmousemove = trace;
					}
					break;
				}
			}
		} else if (cs.ruler && event.button == 0 && (event.target.localName == 'div' || event.target.localName == 'canvas')) {
			cs.addAPointToTheRuler((event.x - cs.centerX) / cs.scale, (cs.centerY - event.y) / cs.scale);
			drawWithoutInitialization();
		}
	}
}

// Заполнение области допустимых значений
function fill() {
	draw();
	cs.fillByPoints(soe.scan(0, 0, canvas.width, canvas.height));
}

// Очистка всех полей
function clearFields() {
	form.clearFields();
}

// Удаления всех графиков
function deleteAll() {
	cs.deleteAllLines();
	cs.deleteAllPoints();
	deleteAllRulers()
	drawWithoutInitialization();
}

// Удаление всех прямых
function deleteAllLines() {
	cs.deleteAllLines();
	drawWithoutInitialization();
}

// Удаление всех точек
function deleteAllPoints() {
	cs.deleteAllPoints();
	drawWithoutInitialization();
}

// Удаление всех линеек
function deleteAllRulers() {
	cs.deleteAllRulers();
	drawWithoutInitialization();
}

// Заполнение полей случайными коэффицентами
function randomCoefficients() {
	form.randomCoefficients();
	draw();
}

// Включение и отключение прозрачности
function toggleGrid() {
	if (cs.toggleGrid()) {
		this.textContent = 'grid_on';
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
	} else {
		this.textContent = 'grid_off';
		this.className = 'btn btn-success material-icons font-weight-bold';
	}
	drawWithoutInitialization();
}

// Уменьшения масштаба сетки
function reducingGrid() {
	cs.reducingGrid();
	soe.update(cs.scale, cs.centerX, cs.centerY);
	draw();
}

// Увеличение масштаба сетки
function increasingGrid() {
	cs.increasingGrid()
	soe.update(cs.scale, cs.centerX, cs.centerY);
	draw();
}

// Изменение вида прямых
function toggleLineType() {
	cs.toggleLineType();
	drawWithoutInitialization();
}

// Сворачивание и развовачивание панели
function minimizeControlPanel() {
	let panel = document.getElementById('panel');
	if (parseInt(getComputedStyle(document.getElementById('panel')).top) > -(parseInt(getComputedStyle(panel).height) - 260)) {
		panel.style.top = -(parseInt(getComputedStyle(panel).height) - 260) + 'px';
		this.textContent = 'expand_more';
	} else {
		panel.style.top = 20 + 'px';
		this.textContent = 'expand_less';
	}
}

function toggleFullscreen () {
	if (this.textContent == 'fullscreen') {
		openFullscreen();
		this.textContent = 'fullscreen_exit';
		this.className = 'btn btn-success material-icons font-weight-bold';
	} else {
		closeFullscreen();
		this.textContent = 'fullscreen';
		this.className = 'btn btn-outline-success material-icons font-weight-bold';
	}
}

// Вход в полноэкранный режим
function openFullscreen() {
	let html = document.querySelector('html');
	if (html.requestFullscreen) {
		html.requestFullscreen();
	} else if (html.mozRequestFullScreen) { /* Firefox */
		html.mozRequestFullScreen();
	} else if (html.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		html.webkitRequestFullscreen();
	} else if (html.msRequestFullscreen) { /* IE/Edge */
		html.msRequestFullscreen();
	}
}

// Выход из полноэкранного режима
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

// Импорт коэффицентов для тестирования
function initTestCoefficients() {
	let fields = document.getElementsByClassName('field');
	let symbols = document.getElementsByClassName('symbol');

	symbols[0].value = '>=';
	symbols[1].value = '<=';
	symbols[2].value = '<=';
	symbols[3].value = '<=';

	let fieldValues = [
		[1, 2, -13],
		[2, 1, 16],
		[0, 1, -2],
		[-16, 3, -3]
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