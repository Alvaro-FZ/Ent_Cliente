// Variables globales
let victoriasJugador = 0;
let victoriasBanca = 0;

const contadorVictoriasDisplay = document.createElement('div');
contadorVictoriasDisplay.id = 'contador-puntaje'; // Asigna un ID para aplicarle estilos
document.body.appendChild(contadorVictoriasDisplay); // Añádelo al cuerpo del documento
contadorVictoriasDisplay.innerText = `Victorias Jugador: ${victoriasJugador} | Victorias Banca: ${victoriasBanca}`;



let baraja = [];
let puntosJugador = 0; // Puntos del jugador
let puntosBanca = 0; // Puntos de la banca
let cartasJugador = [];
let cartasBanca = [];
const puntosDisplay = document.createElement('p');
document.body.appendChild(puntosDisplay); // Muestra los puntos del jugador
puntosDisplay.innerText = `Puntos Jugador: ${puntosJugador}`;
let bancaPuntosDisplay = document.createElement('p');
document.body.appendChild(bancaPuntosDisplay); // Muestra los puntos de la banca
bancaPuntosDisplay.innerText = `Puntos Banca: ${puntosBanca}`;
let mensajeDisplay = document.createElement('p');
mensajeDisplay.classList = "mensajeDisplay";
document.body.appendChild(mensajeDisplay); // Mensaje de estado del juego

const cartasJugadorDiv = document.querySelector('.jugador-cartas');
const cartasBancaDiv = document.querySelector('.banca-cartas');
const pedirCartaBtn = document.getElementById('pedirCartaBtn');
const plantarseBtn = document.getElementById('plantarseBtn');
const nuevaPartidaBtn = document.getElementById('nuevaPartidaBtn'); // Botón "Nueva Partida"

// Función para reiniciar el estado del juego
function nuevaPartida() {
    // Reiniciar variables globales
    baraja = [];
    puntosJugador = 0;
    puntosBanca = 0;
    cartasJugador = [];
    cartasBanca = [];

    // Limpiar la interfaz
    puntosDisplay.style.fontWeight="normal";
    bancaPuntosDisplay.style.fontWeight="normal";
    cartasJugadorDiv.innerHTML = ''; // Eliminar cartas del jugador
    cartasBancaDiv.innerHTML = '';  // Eliminar cartas de la banca
    puntosDisplay.textContent = `Puntos Jugador: ${puntosJugador}`;
    bancaPuntosDisplay.textContent = `Puntos Banca: ${puntosBanca}`;
    mensajeDisplay.style.color = "white";
    mensajeDisplay.innerText = "";
    mensajeDisplay.style.fontSize = "1em";
    mensajeDisplay.style.webkitTextFillColor = "white";
    mensajeDisplay.style.webkitTextStroke = "";

    // Habilitar botones
    pedirCartaBtn.disabled = false;
    plantarseBtn.disabled = false;

    // Crear una nueva baraja automáticamente
    crearBaraja();
}

// Función para crear la baraja
function crearBaraja() {
    const palos = ['S', 'H', 'D', 'C']; // Los 4 palos
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; // Los valores de las cartas
    baraja = []; // Vaciar la baraja existente

    // Crear las 52 cartas
    for (let palo of palos) {
        for (let valor of valores) {
            baraja.push(valor + palo); // Crear las combinaciones de cartas
        }
    }

    baraja = _.shuffle(baraja); // Mezclar las cartas
    console.log("Nueva baraja creada:", baraja); // Verificar en consola
}

// Función para obtener el valor de la carta
function obtenerValorCarta(carta) {
    const valor = carta.slice(0, -1); // Quitar el palo
    if (valor === 'A') {
        return 1; // As vale 1 por defecto
    } else if (valor === 'J' || valor === 'Q' || valor === 'K') {
        return 10; // Las figuras (J, Q, K) valen 10
    } else {
        return parseInt(valor); // Las cartas numéricas tienen su valor directamente
    }
}

// Función para pedir una carta
function pedirCarta() {
    if (baraja.length === 0) {
        mensajeDisplay.innerText = `No quedan más cartas en la baraja`;
        return;
    }

    const carta = baraja.pop(); // Sacar la carta de la baraja
    const valorCarta = obtenerValorCarta(carta);

    // Si la carta es un As, preguntar al jugador si vale 1 o 11
    let valorFinalCarta = valorCarta;
    if (carta[0] === 'A') {
        const valorAs = prompt("¿El As vale 1 o 11?");
        valorFinalCarta = (valorAs === "11") ? 11 : 1; // Validar el valor ingresado por el jugador
    }

    // Sumar el valor de la carta a los puntos del jugador
    puntosJugador += valorFinalCarta;
    puntosDisplay.textContent = `Puntos Jugador: ${puntosJugador}`;

    // Crear la imagen de la carta y agregarla al contenedor
    const imgCarta = document.createElement('img');
    imgCarta.src = `./cartas/${carta}.png`;
    imgCarta.alt = carta;
    imgCarta.classList = 'carta';
    cartasJugadorDiv.appendChild(imgCarta); // Añadir la carta al contenedor

    // Verificar si el jugador ha perdido o alcanzado 21
    setTimeout(() => {
        if (puntosJugador > 21) {
            nuevaPartidaBtn.disabled = true;
            pedirCartaBtn.disabled = true;
            plantarseBtn.disabled = true;
            turnoBanca();
        } else if (puntosJugador === 21) {
            nuevaPartidaBtn.disabled = true;
            pedirCartaBtn.disabled = true;
            plantarseBtn.disabled = true;
            turnoBanca();
        }
    }, 65);
}

// Función para el turno de la banca
function turnoBanca() {
    mensajeDisplay.innerText = "Turno de la banca...";
    
    let intervalo = setInterval(() => {
        if (puntosBanca < 21 && puntosBanca < puntosJugador) {
            const carta = baraja.pop(); // Sacar una carta de la baraja
            const valorCarta = obtenerValorCarta(carta);
            puntosBanca += valorCarta;

            // Crear la imagen de la carta y agregarla al contenedor
            const imgCarta = document.createElement('img');
            imgCarta.src = `./cartas/${carta}.png`;
            imgCarta.alt = carta;
            imgCarta.classList = 'carta';
            cartasBancaDiv.appendChild(imgCarta);

            bancaPuntosDisplay.textContent = `Puntos Banca: ${puntosBanca}`;
        } else {
            clearInterval(intervalo); // Detener el turno de la banca
            determinarGanador();
            nuevaPartidaBtn.disabled = false;
        }
    }, 600); // Intervalo entre cartas de la banca

}

// Función para determinar el ganador
function determinarGanador() {
    // Revisar si el jugador se pasó de 21
    if (puntosJugador > 21) {
        victoriasBanca++; // Incrementar contador de la banca
        actualizarContadorVictorias(); // Actualizar pantalla
        bancaPuntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("red");
        mensajeDisplay.innerText = `¡Te has pasado de 21! Has perdido.`;
        return;
    }

    // Comparaciones entre jugador y banca
    if (puntosBanca > 21 && puntosJugador <= 21) {
        victoriasJugador++; // Incrementar contador del jugador
        actualizarContadorVictorias(); // Actualizar pantalla
        puntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("green");
        mensajeDisplay.innerText = "¡La banca se ha pasado de 21! Has ganado.";
    } else if (puntosBanca > puntosJugador) {
        victoriasBanca++; // Incrementar contador de la banca
        actualizarContadorVictorias(); // Actualizar pantalla
        bancaPuntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("red");
        mensajeDisplay.innerText = `¡La banca gana con ${puntosBanca} puntos!`;
    } else if (puntosJugador != 21 && puntosBanca === puntosJugador) {
        victoriasBanca++; // Incrementar contador de la banca en empate
        actualizarContadorVictorias(); // Actualizar pantalla
        puntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("red");
        mensajeDisplay.innerText = `Pierdes por empate a ${puntosJugador} puntos`;
    } else if (puntosJugador == 21 && puntosBanca === puntosJugador) {
        victoriasJugador++; // Incrementar contador del jugador en empate especial
        actualizarContadorVictorias(); // Actualizar pantalla
        puntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("green");
        mensajeDisplay.innerText = `¡Empate de puntos, ganas tú con ${puntosJugador} puntos!`;
    } else {
        victoriasJugador++; // Incrementar contador del jugador
        actualizarContadorVictorias(); // Actualizar pantalla
        puntosDisplay.style.fontWeight = "bold";
        añadirEstilosMensaje("green");
        mensajeDisplay.innerText = `¡Has ganado con ${puntosJugador} puntos! La banca tiene ${puntosBanca}.`;
    }
}

function actualizarContadorVictorias() {
    contadorVictoriasDisplay.innerText = `Victorias Jugador: ${victoriasJugador} | Victorias Banca: ${victoriasBanca}`;
}

function añadirEstilosMensaje(colorTexto) {
    mensajeDisplay.style.fontSize = "2em";
    mensajeDisplay.style.webkitTextFillColor = colorTexto;
    mensajeDisplay.style.webkitTextStroke = "1px white";
}

// Función para plantarse
function plantarse() {
    mensajeDisplay.innerText = `Te has plantado. Tu puntuación final es: ${puntosJugador}`;
    nuevaPartidaBtn.disabled = true;
    pedirCartaBtn.disabled = true;
    plantarseBtn.disabled = true;

    turnoBanca(); // Turno de la banca
}

// Event listeners para los botones
nuevaPartidaBtn.addEventListener('click', nuevaPartida);
pedirCartaBtn.addEventListener('click', pedirCarta);
plantarseBtn.addEventListener('click', plantarse);