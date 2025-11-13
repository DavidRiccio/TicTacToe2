Game.tsx - Documentación del Estado
Estados y Variables
Dimensiones y Configuración del Tablero
width, height - Dimensiones de la ventana obtenidas con useWindowDimensions(). Se usan para calcular el tamaño responsivo del tablero y los cuadrados.

boardSize - Tamaño del tablero (3x3, 4x4, 5x5, etc.). Por defecto es 3. Determina cuántas filas y columnas tendrá el tablero.

squares - Array 1D que contiene el estado de cada cuadrado del tablero. Se inicializa con strings vacíos ('') y se llena con 'X' u 'O'. Su longitud es boardSize * boardSize.

Control de Turnos y Juego
xIsNext - Booleano que indica si es el turno de X (true) o de O (false). En modo online, se sincroniza con el servidor.

gameStarted - Booleano que indica si el juego ha comenzado. Controla qué pantalla mostrar (menú de configuración vs tablero de juego).

gameFinished - Booleano que indica si la partida actual ha terminado (hay ganador o empate).

hasUpdatedScore - Bandera para evitar actualizar el marcador múltiples veces cuando termina una partida.

Puntuación (Modo Offline)
scores - Objeto con las victorias de cada jugador: { x: number, o: number }. Solo se usa en modo offline.

Identificación y Modo de Juego
id - ID único del dispositivo asignado por el servidor al iniciar la aplicación. Se usa para identificar al jugador en partidas online.

gameMode - Modo de juego actual: 'offline' (local en el mismo dispositivo) o 'online' (multijugador contra otro dispositivo).

Estado de Partida Online
searchingMatch - Booleano que indica si se está buscando un oponente para una partida online.

matchId - ID de la partida online actual. Se obtiene del servidor cuando se encuentra un oponente.

mySymbol - Símbolo asignado al jugador actual en la partida online ('X' o 'O'). El servidor determina qué símbolo corresponde a cada dispositivo.

isMyTurn - Booleano que indica si es el turno del jugador actual en modo online. Se usa para habilitar/deshabilitar clicks en el tablero.

Referencias para Polling
waitingPollingRef - Referencia al intervalo que hace polling al endpoint /matches/waiting-status mientras se busca oponente.

matchPollingRef - Referencia al intervalo que hace polling al endpoint /matches/{matchId} para sincronizar el estado del tablero durante la partida online.

Variables Calculadas
winner - Resultado de calculateWinner(squares, boardSize). Devuelve 'X', 'O', o null si no hay ganador.

isDraw - Booleano calculado: !winner && squares.every(square => square !== ''). Indica si hay empate (tablero lleno sin ganador).

winningLine - Array de índices que forman la línea ganadora, devuelto por getWinningLine(squares, boardSize). Se usa para resaltar visualmente los cuadrados ganadores.

Flujo de Estados
Modo Offline
Usuario selecciona tamaño → boardSize

Usuario inicia juego → gameStarted = true, gameMode = 'offline'

Clicks alternan → xIsNext cambia, squares se actualiza

Se detecta ganador/empate → gameFinished = true, scores se actualiza

Modo Online
Usuario solicita partida → searchingMatch = true, gameMode = 'online'

waitingPollingRef busca oponente

Se encuentra oponente → matchId, mySymbol se asignan, gameStarted = true

matchPollingRef sincroniza tablero cada segundo

Usuario clicka (si isMyTurn) → POST a servidor → squares se actualiza desde servidor

Servidor detecta ganador → gameFinished = true

Sincronización Cliente-Servidor
El tablero del servidor viene como matriz 2D: board[fila][columna] y se aplana con .flat() para renderizar en el array 1D squares.

Cuando se hace un movimiento online:

Se calcula: row = Math.floor(index / boardSize), col = index % boardSize

Se envía: { device_id, x: row, y: col }

El servidor actualiza board[x][y]

El cliente recibe el board actualizado y lo renderiza