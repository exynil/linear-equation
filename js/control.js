// Отслеживание изменения размера окна
addEventListener('resize', function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	cs.x = canvas.width;
	soe = new SystemOfEquations(soe.rows, soe.cols, cs.scale, cs.x);
	drawWithoutinItialization();
})

// Отслеживание нажатия клавиш
addEventListener('keypress', function(event) {
	if (event.shiftKey) {
		switch (event.keyCode) {
			case 43:
				increase();
				break;
			case 45:
				reduce();
				break;
		}
	} else {
		switch (event.keyCode) {
			case 13:
				draw();
				break;
		}
	}
	console.log(event);
})

addEventListener('keydown', function(event) {
	switch (event.code) {
		case 'Delete':
			cs.deleteLastPointInRuler();
			drawWithoutinItialization();
			break;
	}
})

canvas.onclick = onclick;

function dragElement(elmnt) {
	let x, y, left, top;

	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		if (e.target.textContent == 'drag_indicator') {
			e = e || window.event;
			// e.preventDefault();
			x = e.pageX;
			y = e.pageY;
			left = this.offsetLeft;
			top = this.offsetTop;
			left = x - left;
			top = y - top;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}
	}

	function elementDrag(e) {
		console.log(e.path[0].locaName);
		console.log(e);
		e = e || window.event;
		// e.preventDefault();
		x = event.pageX - 20;
		y = event.pageY - 20;
		elmnt.style.left = x - left + 'px';
		elmnt.style.top = y - top + 'px';
	}

	function closeDragElement() {
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

dragElement(document.getElementById('panel'));

$(function() {
	$('[data-toggle="tooltip"]').tooltip({
		delay: {
			show: 400,
			hide: 100
		}
	});
})

document.getElementById('reduce').onclick = reduce;
document.getElementById('increase').onclick = increase;
document.getElementById('draw').onclick = draw;
document.getElementById('fill').onclick = fill;
document.getElementById('deleteLinesAndPoints').onclick = deleteAll;
document.getElementById('clear').onclick = clearFields;
document.getElementById('random').onclick = random;
document.getElementById('opacity').onclick = changeOpacity;
document.getElementById('grid').onclick = turnGridOnAndOff;
document.getElementById('delete-all-lines').onclick = deleteAllLines;
document.getElementById('delete-all-points').onclick = deleteAllPoints;
document.getElementById('reduce-grid').onclick = reduceGrid;
document.getElementById('increase-grid').onclick = increaseGrid;
document.getElementById('ruler').onclick = toggleRuler;
document.getElementById('delete-all-rulers').onclick = deleteAllRulers;
document.getElementById('line-type').onclick = toggleLineType;