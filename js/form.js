class Form {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.opacity = true;
		this.fieldsValues = [];
		this.symbolsValues = [];
		this.fieldColors = [];
	}
	// Чтение коэффицентов
	readFields() {
		// Получение всех полей
		let fields = document.getElementsByClassName('field');
		// Массив для хранения коэффициентов
		let fieldsValues = [];
		// Конвертация одномерного массива в двумерный и извлечение значений из полей
		for (let i = 0; i < fields.length; i++) {
			fieldsValues[i] = parseInt(fields[i].value);
		}
		return fieldsValues;
	}

	// Чтение знаков
	readSymbols() {
		// Получение всех полей со знаками
		let symbols = document.getElementsByClassName('symbol');
		// Массив для хранения знаков
		let symbolsValues = [];
		// Извлечение значений из полей
		for (let i = 0; i < symbols.length; i++) {
			symbolsValues[i] = symbols[i].value;
		}
		// Инициализация массива коэффицентов и знаков в систему уравнения
		return symbolsValues;
	}

	// Чтение цветов
	readColors() {
		// Получение всех полей с цветами
		let colors = document.getElementsByClassName('color');
		// Массив для хранения знаков
		let colorsValues = [];
		// Извлечение значений из полей
		for (let i = 0; i < colors.length; i++) {
			colorsValues[i] = colors[i].value;
		}
		// Инициализация массива коэффицентов и знаков в систему уравнения
		return colorsValues;
	}

	// Очистка всех полей
	clearFields() {
		let fields = document.getElementsByClassName('field');
		for (let i = 0; i < fields.length; i++) {
			fields[i].value = '';
		}
	}
	// Заполнение системы случайными коэфицентами
	randomCoefficients() {
		let fields = document.getElementsByClassName('field');

		for (let i = 0; i < fields.length; i++) {
			fields[i].value = randomIntFromRange(-10, 10);
		}
	}
	// Сохранение коэффицентов
	saveData() {
		this.fieldsValues = this.readFields();
		this.symbolsValues = this.readSymbols();
		this.colorsValues = this.readColors();
	}
	// Восстановление коэффицентов
	restoreData() {
		let fields = document.getElementsByClassName('field');
		for (let i = 0; i < fields.length - this.cols; i++) {
			fields[i].value = this.fieldsValues[i];
		}
		let symbols = document.getElementsByClassName('symbol');
		for (let i = 0; i < symbols.length - 1; i++) {
			symbols[i].value = this.symbolsValues[i];
		}
		let colors = document.getElementsByClassName('color');
		for (let i = 0; i < colors.length - 1; i++) {
			colors[i].value = this.colorsValues[i];
		}
	}
	// Уменьшение системы
	reducingForm() {
		if (this.rows > 1) {
			this.saveData();
			this.rows--;
			this.updateForm();
			this.restoreData();
		}
	}
	// Увеличение системы
	increasingForm() {
		if (this.rows < 100) {
			this.saveData();
			this.rows++;
			this.updateForm();
			this.restoreData();
		}
	}
	reducingRows() {
		this.rows--;
	}
	// Реконструкция формы
	updateForm() {
		// Пустая строка
		let code = '';
		// Генерируем форму на основе текущего размера матрицы
		for (let i = 0; i < this.rows; i++) {
			code += '<div class="row">';
			code += '<div class="col-2">';
			code += '<div class="form-group row">';
			code += '<div class="col-12">';
			code += '<input class="form-control color" tabindex="1" type="color" value="#27EBA4">';
			code += '</div>';
			code += '</div>';
			code += '</div>';
			code += '<div class="col-10">';
			code += '<div class="form-group row">';
			for (let j = 0; j < this.cols; j++) {
				code += '<div class="col-xs col-sm col-md col-lg">';
				code += '<input class="form-control field text-center" tabindex="2" type="number" placeholder="' + (i + 1) + ',' + (j + 1) + '">';
				code += '</div>';
				if (j == this.cols - 2) {
					code += '<div class="col-xs-auto col-sm-auto col-md-auto col-lg-auto">';
					code += '<select class="form-control symbol">';
					code += '<option><=</option>';
					code += '<option>>=</option>';
					code += '<option>></option>';
					code += '<option><</option>';
					code += '<option>=</option>';
					code += '</select>';
					code += '</div>';
				}
			}
			code += '<div class="col-xs-auto col-sm-auto col-md-auto col-lg-auto d-flex">';
			code += '<i class="delete-field-button material-icons font-weight-bold align-items-center">backspace</i>';
			code += '</div>';
			code += '</div>';
			code += '</div>';
			code += '</div>';
		}
		// Добавляем сгенерированный код формы в блок формы
		document.getElementById('form').innerHTML = code;

		// let fields = document.getElementsByClassName('field');

		// for (let i = 0; i < fields.length; i++) {
		// 	fields[i].oninput = function() {
		// 		draw(); // [внешняя функция]
		// 	}
		// }

		// let deleteFieldButtons = document.getElementsByClassName('delete-field-button');

		// for (let i = 0; i < deleteFieldButtons.length; i++) {
		// 	deleteFieldButtons[i].onclick = function() {
		// 		this.parentElement.parentElement.parentElement.parentElement.remove();
		// 		form.rows--;
		// 		draw(); // [внешняя функция]
		// 	}
		// }

		// let colorFieldButtons = document.getElementsByClassName('color');

		// for (let i = 0; i < colorFieldButtons.length; i++) {
		// 	colorFieldButtons[i].onchange = function(event) {
		// 		draw(); // [внешняя функция]
		// 	}
		// }
	}
	
}