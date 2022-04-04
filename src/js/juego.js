const miModulo = (() => {
    'use strict'

    /* LAS IMAGENES DE LAS CARTAS ESTAN EN INGLES
    /* CORAZON (H= HEART); TREBOL (C= CLUBS); DIAMANTES (D = DIAMONS); ESPADA (S = SPADES) */

    let deck         = [];
    const tipos      = ['H', 'C', 'D', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];

    // REFERENCIAS DOM
    const btnPedir   = document.querySelector ('#btnPedir'),
          btnDetener = document.querySelector ('#btnDetener'),
          btnNuevo   = document.querySelector ('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll ('.divCartas'),
          // TOMO TODOS LAS ETIQUETAS SMALL DEL HTML
          puntosHTML = document.querySelectorAll('small');


    // INICIO JUEGO
    const inicializarJuego = ( numJugadores = 2) => {
       deck = crearDeck ();
       puntosJugadores = [];
       for (let i = 0; i < numJugadores; i++){
           puntosJugadores.push (0);
       }
        
        puntosHTML.forEach ( elem => elem.innerText = 0 );
        divCartasJugadores.forEach ( elem => elem.innerHTML = '' );

        btnDetener.disabled = false;
        btnPedir.disabled = false;
    }

    // CREO DECK
    const crearDeck = () => { 

    deck = [];
    for (let i = 2; i <= 10; i++){

    for ( let tipo of tipos ){
        deck.push(i + tipo);
        }
    }

    for ( let tipo of tipos){
        for (let esp of especiales){
            deck.push(esp + tipo);
        }
    }

    /* UNDERSCORE.JS */
    return _.shuffle (deck);;

    }

    
    const pedirCarta = () => {

        if ( deck.length === 0 ){
            throw 'No hay más cartas en el deck';
        }
        return deck.pop(); 
    }

    /* LE ENVIO EL PARAMETRO CARTA PARA SABER SU VALOR */
    const valorCarta = (carta) => {
        /* SUBSTRING ES PREDETERMINADO DE JS Y TE PERMITE TRABAJAR UN STRING COMO ARREGLO, DEFINIENDO DE QUE POSICION A QUE OTRA POSICION QUERES, ASI QUE CON ESTO ME OLVIO DE LA LETRA (POR EJ: 10D, ME QUEDA 10) */
            const valor = carta.substring(0,carta.length-1);
            return ( isNaN ( valor )) ?
            ( valor === 'A' ) ? 11 : 10
            : valor *1;

    }

    // 0 ES EL PRIMER JUGADOR, EL ULTIMO SERA LA COMPUTADORA
    const acumularPuntos = (carta, turno ) => {
            puntosJugadores [turno] = puntosJugadores [turno] + valorCarta(carta);
            puntosHTML[turno].innerText = puntosJugadores [turno];
            return puntosJugadores [turno];
    }

    const crearCarta = (carta, turno) => {
        // TRABAJO LA CREACION DE CARTAS EN EL HTML: CREO CONSTANTE IMGCARTA (SIEMPRE SERA UNA ETIQUETA IMG), LE APLICO EL .SRC Y PONGO EL PATH DE LAS IMGS PERO CON `` PARA QUE PUEDA INTRODUCIR CODIGO JS EN LUGAR DE UNA IMG EN ESPECIFICO (CON ${carta}.png). LE ASIGNO LA CLASE DEL CSS "CARTA" CON classList.add('LA CLASE DE CSS QUE QUIERO APLICAR'). CON EL .APPEND AGREGO LAS CARTAS AL FINAL 
        const imgCarta = document.createElement('img');
            imgCarta.src = `assets/cartas/${carta}.png`;
            imgCarta.classList.add('carta');
            divCartasJugadores[turno].append (imgCarta);

    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosComputadora ] = puntosJugadores;

        setTimeout(() => {
            if (puntosComputadora === puntosMinimos){
                alert('¡Empate! Nadie gana.')
            } else if (puntosMinimos > 21 ) {
                alert('¡La computadora ganó!')
            } else if (puntosComputadora > 21){
                alert('¡Ganaste! La computadora se pasó de 21.')
            } else {
                alert('¡La computadora ganó!')
            }
        }, 140 );
    }

    const turnoComputadora = (puntosMinimos) => {
        
        
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            
            crearCarta (carta, puntosJugadores.length - 1);

        }
        while ( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21) );

        determinarGanador ();
    }

    // EVENTOS
    // ESCUCHO EL CLICK DE ESE BOTON. LE PASO 2 ARGUMENTOS (1. LO QUE QUIERO ESCUCHAR, 2. FUNCION (Normal o flecha) A REALIZAR)
    btnPedir.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta (carta, 0);
        
        if (puntosJugador > 21){
            /* console.log ('¡Perdiste! Te pasaste de 21'); */
            // PROPIEDAD DISABLED PARA BLOQUEAR BOTON (EN ESTE CASO)
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        } else if (puntosJugador === 21) {
            
            /* setTimeout(() => {
                alert ('Ja. ¡Blackjack!');
            }, 100); */
            
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);

        }
        
    })

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    })

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();
    
    })

    // LO UNICO QUE SERA PUBLICO DE MI CODIGO ES ESTA PARTE DEL RETURN, QUE SE LLAMA DESDE EL HTML
    return {
        nuevoJuego: inicializarJuego
    }

})();




