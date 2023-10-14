'use client';
import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/components/WSContext';

// Aca el back avisa que alguien robó una carta del mazo
// Para el jugador que la robó, se le debe mostrar que carta es (tipo, subtipo, etc) y el tipo de la siguiente
// Para el resto de los jugadores se les debe actualiar los mazos y saber quién tomó una carta del mazo
// Hacen falta ws?
// broadcast?

/*
Pegarle al back
Va a robar la carta (ponerlo en el hand)
Ver el tipo que me devuelve el back y ponerle el tipo a la carta
La comunicacion será por sockets.
*/
