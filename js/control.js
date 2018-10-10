// Отслеживание изменения размера окна
addEventListener('resize', function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	cs.centerX = canvas.width / 2;
	cs.centerY = canvas.height / 2;
	soe.update(cs.scale, cs.centerX, cs.centerY);
	draw();
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
})

addEventListener('keydown', function(event) {
	switch (event.code) {
		case 'Delete':
			cs.deleteLastPointInRuler();
			drawWithoutInitialization();
			break;
	}
})



function dragElement(elmnt) {
	let x, y, left, top;

	elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		if (e.target.textContent == 'drag_indicator') {
			document.getElementById('panel').style.transition = 'top 0s';
			e = e || window.event;
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
		e = e || window.event;

		x = event.pageX;
		y = event.pageY;
		elmnt.style.left = x - left + 'px';
		elmnt.style.top = y - top + 'px';
		if (parseInt(getComputedStyle(document.getElementById('panel')).top) > -(parseInt(getComputedStyle(panel).height) - 200)) {
			document.getElementById('minimize').textContent = 'expand_less';
		} else {
			document.getElementById('minimize').textContent = 'expand_more';
		}
	}

	function closeDragElement() {
		document.getElementById('panel').style.transition = 'top 0.4s';
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

document.onclick = onclick;
document.getElementById('reduce').onclick = reducingForm;
document.getElementById('increase').onclick = increasingForm;
document.getElementById('draw').onclick = draw;
document.getElementById('fill').onclick = fill;
document.getElementById('deleteAll').onclick = deleteAll;
document.getElementById('clear').onclick = clearFields;
document.getElementById('random').onclick = randomCoefficients;
document.getElementById('opacity').onclick = toggleOpacity;
document.getElementById('grid').onclick = toggleGrid;
document.getElementById('point').onclick = togglePoint;
document.getElementById('delete-all-lines').onclick = deleteAllLines;
document.getElementById('delete-all-points').onclick = deleteAllPoints;
document.getElementById('reduce-grid').onclick = reducingGrid;
document.getElementById('increase-grid').onclick = increasingGrid;
document.getElementById('ruler').onclick = toggleRuler;
document.getElementById('delete-all-rulers').onclick = deleteAllRulers;
document.getElementById('line-type').onclick = toggleLineType;
document.getElementById('minimize').onclick = minimizeControlPanel;
document.getElementById('lock').onclick = toggleLock;
document.getElementById('point-method').onclick = togglePointMethod;