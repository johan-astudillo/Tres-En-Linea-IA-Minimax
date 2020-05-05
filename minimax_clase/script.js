/*codigo WiMax por Johan Astudillo y Luis Pedraza*/

var tablero = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0],
];

var persona = -1;
var inteligenciaAr = +1;

/* evaluamos el estado */
function evaluar(estado) {
	var puntuacion = 0;

	if (terminoJuego(estado, inteligenciaAr)) {
		puntuacion = +1;
	}
	else if (terminoJuego(estado, persona)) {
		puntuacion = -1;
	} else {
		puntuacion = 0;
	}

	return puntuacion;
}

/* Jugador gano*/
function terminoJuego(estado, jugador) {
	var win_estado = [
		[estado[0][0], estado[0][1], estado[0][2]],
		[estado[1][0], estado[1][1], estado[1][2]],
		[estado[2][0], estado[2][1], estado[2][2]],
		[estado[0][0], estado[1][0], estado[2][0]],
		[estado[0][1], estado[1][1], estado[2][1]],
		[estado[0][2], estado[1][2], estado[2][2]],
		[estado[0][0], estado[1][1], estado[2][2]],
		[estado[2][0], estado[1][1], estado[0][2]],
	];

	for (var i = 0; i < 8; i++) {
		var line = win_estado[i];
		var filled = 0;
		for (var j = 0; j < 3; j++) {
			if (line[j] == jugador)
				filled++;
		}
		if (filled == 3)
			return true;
	}
	return false;
}

/* quien gano el juego se termino */
function quienGano(estado) {
	return terminoJuego(estado, persona) || terminoJuego(estado, inteligenciaAr);
}

function celdasVacias(estado) {
	var celdas = [];
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 3; y++) {
			if (estado[x][y] == 0)
				celdas.push([x, y]);
		}
	}

	return celdas;
}

/* mover es valido si la celda esta vacia */
function movimientoValido(x, y) {
	var empties = celdasVacias(tablero);
	try {
		if (tablero[x][y] == 0) {
			return true;
		}
		else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

/* SetMovimiento si las coordenadas son validas */
function setMovimiento(x, y, jugador) {
	if (movimientoValido(x, y)) {
		tablero[x][y] = jugador;
		return true;
	}
	else {
		return false;
	}
}

/* *** Algoritmo MiniMAX *** */

function minimax(estado, depth, jugador) {
	var mejor;

	if (jugador == inteligenciaAr) {
		mejor = [-1, -1, -1000];
	}
	else {
		mejor = [-1, -1, +1000];
	}

	if (depth == 0 || quienGano(estado)) {
		var puntuacion = evaluar(estado);
		return [-1, -1, puntuacion];
	}

	celdasVacias(estado).forEach(function (cell) {
		var x = cell[0];
		var y = cell[1];
		estado[x][y] = jugador;
		var puntuacion = minimax(estado, depth - 1, -jugador);
		estado[x][y] = 0;
		puntuacion[0] = x;
		puntuacion[1] = y;

		if (jugador == inteligenciaAr) {
			if (puntuacion[2] > mejor[2])
				mejor = puntuacion;
		}
		else {
			if (puntuacion[2] < mejor[2])
				mejor = puntuacion;
		}
	});

	return mejor;
}

/* llama a minimax */
function aiTurn() {
	var x, y;
	var move;
	var cell;

	if (celdasVacias(tablero).length == 9) {
		x = parseInt(Math.random() * 3);
		y = parseInt(Math.random() * 3);
	}
	else {
		move = minimax(tablero, celdasVacias(tablero).length, inteligenciaAr);
		x = move[0];
		y = move[1];
	}

	if (setMovimiento(x, y, inteligenciaAr)) {
		cell = document.getElementById(String(x) + String(y));
		cell.innerHTML = "O";
	}
}

/* main */
function clickedCell(cell) {
	var button = document.getElementById("bnt-Reiniciar");
	button.disabled = true;
	var conditionToContinue = quienGano(tablero) == false && celdasVacias(tablero).length > 0;

	if (conditionToContinue == true) {
		var x = cell.id.split("")[0];
		var y = cell.id.split("")[1];
		var move = setMovimiento(x, y, persona);
		if (move == true) {
			cell.innerHTML = "X";
			if (conditionToContinue)
				aiTurn();
		}
	}
	if (terminoJuego(tablero, inteligenciaAr)) {
		var lines;
		var cell;
		var msg;

		if (tablero[0][0] == 1 && tablero[0][1] == 1 && tablero[0][2] == 1)
			lines = [[0, 0], [0, 1], [0, 2]];
		else if (tablero[1][0] == 1 && tablero[1][1] == 1 && tablero[1][2] == 1)
			lines = [[1, 0], [1, 1], [1, 2]];
		else if (tablero[2][0] == 1 && tablero[2][1] == 1 && tablero[2][2] == 1)
			lines = [[2, 0], [2, 1], [2, 2]];
		else if (tablero[0][0] == 1 && tablero[1][0] == 1 && tablero[2][0] == 1)
			lines = [[0, 0], [1, 0], [2, 0]];
		else if (tablero[0][1] == 1 && tablero[1][1] == 1 && tablero[2][1] == 1)
			lines = [[0, 1], [1, 1], [2, 1]];
		else if (tablero[0][2] == 1 && tablero[1][2] == 1 && tablero[2][2] == 1)
			lines = [[0, 2], [1, 2], [2, 2]];
		else if (tablero[0][0] == 1 && tablero[1][1] == 1 && tablero[2][2] == 1)
			lines = [[0, 0], [1, 1], [2, 2]];
		else if (tablero[2][0] == 1 && tablero[1][1] == 1 && tablero[0][2] == 1)
			lines = [[2, 0], [1, 1], [0, 2]];

		for (var i = 0; i < lines.length; i++) {
			cell = document.getElementById(String(lines[i][0]) + String(lines[i][1]));
			cell.style.color = "red";
		}

		msg = document.getElementById("message");
		msg.innerHTML = "Perdiste jajjajaaj!";
	}
	if (celdasVacias(tablero).length == 0 && !quienGano(tablero)) {
		var msg = document.getElementById("message");
		msg.innerHTML = "Empate!";
	}
	if (quienGano(tablero) == true || celdasVacias(tablero).length == 0) {
		button.value = "Reiniciar";
		button.disabled = false;
	}
}

/* Reiniciar el juego*/
function ReiniciarBnt(button) {
	if (button.value == "IA Comienza") {
		aiTurn();
		button.disabled = true;
	}
	else if (button.value == "Reiniciar") {
		var htmltablero;
		var msg;

		for (var x = 0; x < 3; x++) {
			for (var y = 0; y < 3; y++) {
				tablero[x][y] = 0;
				htmltablero = document.getElementById(String(x) + String(y));
				htmltablero.style.color = "#444";
				htmltablero.innerHTML = "";
			}
		}
		button.value = "IA Comienza";
		msg = document.getElementById("message");
		msg.innerHTML = "";
	}
}
