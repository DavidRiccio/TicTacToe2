# Game.tsx - Documentación del Estado
## Estados y Variables Dimensiones y Configuración del Tablero
``width, height ``- Dimensiones de la ventana obtenidas con

``useWindowDimensions()`` -  Se usan para calcular el tamaño responsivo del tablero y los cuadrados.

```typescript
const { width, height } = useWindowDimensions();
const squareSize = Math.min(width, height) / (boardSize + 1);
```

``boardSize`` - Tamaño del tablero (3x3, 4x4, 5x5, etc.). Por defecto es 3. Determina cuántas filas y columnas tendrá el tablero.
```typescript
const [boardSize, setBoardSize] = React.useState<number>(3);
// Ejemplo de uso para calcular el número total de cuadrados
const totalSquares = boardSize * boardSize; // 3x3 = 9
```


``squares`` - Array 1D que contiene el estado de cada cuadrado del tablero. Se inicializa con strings vacíos ('') y se llena con 'X' u 'O'. Su longitud es boardSize * boardSize.
```typescript
const [squares, setSquares] = React.useState<string[]>(
  Array(boardSize * boardSize).fill('')
);

// Ejemplo de actualización de un cuadrado específico
const handleClick = (index: number) => {
  const newSquares = [...squares]; // Crear copia para no mutar el estado
  newSquares[index] = xIsNext ? 'X' : 'O';
  setSquares(newSquares);
};

```
## Control de Turnos y Juego
``xIsNext`` - Booleano que indica si es el turno de X (true) o de O (false). En modo online, se sincroniza con el servidor.
```typescript
const [xIsNext, setXIsNext] = React.useState<boolean>(true);

// Alternar turno después de un movimiento
const handleMove = (index: number) => {
  // ... lógica de movimiento
  setXIsNext(!xIsNext); // Cambia de X a O o viceversa
};

```
``gameStarted`` - Booleano que indica si el juego ha comenzado. Controla qué pantalla mostrar (menú de configuración vs tablero de juego).
```typescript
const [gameStarted, setGameStarted] = React.useState<boolean>(false);

// Renderizado condicional
return gameStarted ? <GameBoard /> : <ConfigMenu />;

```

``gameFinished`` - Booleano que indica si la partida actual ha terminado (hay ganador o empate).
```typescript
const [gameFinished, setGameFinished] = React.useState<boolean>(false);

useEffect(() => {
  if (winner || isDraw) {
    setGameFinished(true);
  }
}, [winner, isDraw]);


```
``hasUpdatedScore`` - Bandera para evitar actualizar el marcador múltiples veces cuando termina una partida.

```typescript
const [hasUpdatedScore, setHasUpdatedScore] = React.useState<boolean>(false);

useEffect(() => {
  if (gameFinished && !hasUpdatedScore && winner) {
    setScores(prev => ({
      ...prev,
      [winner.toLowerCase()]: prev[winner.toLowerCase() as 'x' | 'o'] + 1
    }));
    setHasUpdatedScore(true);
  }
}, [gameFinished, hasUpdatedScore, winner]);
```

## Puntuación (Modo Offline)
``scores`` - Objeto con las victorias de cada jugador: { x: number, o: number }. Solo se usa en modo offline.

```typescript
interface Score {
  x: number;
  o: number;
}

const [scores, setScores] = React.useState<Score>({ x: 0, o: 0 });

// Actualizar puntuación del ganador
const updateScore = (winner: 'X' | 'O') => {
  setScores(prev => ({
    ...prev,
    [winner.toLowerCase()]: prev[winner.toLowerCase() as 'x' | 'o'] + 1
  }));
};

```
## Identificación y Modo de Juego
``id``- ID único del dispositivo asignado por el servidor al iniciar la aplicación. Se usa para identificar al jugador en partidas online.
```typescript
const [id, setId] = React.useState<string | null>(null);
const hasFetched = React.useRef(false);

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  
  const initDevice = async () => {
    const deviceId = await fetchAddDevice();
    setId(deviceId);
  };
  
  initDevice();
}, []);
```

``gameMode``- Modo de juego actual: 'offline' (local en el mismo dispositivo) o 'online' (multijugador contra otro dispositivo).

```typescript 
type GameMode = 'offline' | 'online';
const [gameMode, setGameMode] = React.useState<GameMode>('offline');

// Cambiar de modo
const startOnlineGame = () => {
  setGameMode('online');
  setSearchingMatch(true);
};
```

Estado de Partida Online
``searchingMatch`` - Booleano que indica si se está buscando un oponente para una partida online.
```typescript
const [searchingMatch, setSearchingMatch] = React.useState<boolean>(false);

// Mostrar pantalla de búsqueda
{searchingMatch && <LoadingSpinner message="Buscando oponente..." />}
```

``matchId`` - ID de la partida online actual. Se obtiene del servidor cuando se encuentra un oponente.
```typescript
const [matchId, setMatchId] = React.useState<string | null>(null);

// Ejemplo de respuesta del servidor
// { match_id: "abc123", your_symbol: "X", board: [[...]], ... }
```

``mySymbol`` - Símbolo asignado al jugador actual en la partida online ('X' o 'O'). El servidor determina qué símbolo corresponde a cada dispositivo.


```typescript
const [mySymbol, setMySymbol] = React.useState<'X' | 'O' | null>(null);

// Validar si un cuadrado pertenece al jugador
const isMySquare = (square: string) => square === mySymbol;
```

``isMyTurn`` - Booleano que indica si es el turno del jugador actual en modo online. Se usa para habilitar/deshabilitar clicks en el tablero.

```typescript
const [isMyTurn, setIsMyTurn] = React.useState<boolean>(false);

const handleSquareClick = (index: number) => {
  if (!isMyTurn || squares[index] !== '' || gameFinished) {
    return; // No permitir el movimiento
  }
  // ... hacer movimiento
};
```

## Referencias para Polling
``waitingPollingRef`` - Referencia al intervalo que hace polling al endpoint /matches/waiting-status mientras se busca oponente.
```typescript
const waitingPollingRef = React.useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (searchingMatch && id) {
    waitingPollingRef.current = setInterval(async () => {
      const response = await fetch(`${url}matches/waiting-status?device_id=${id}`);
      const data = await response.json();
      
      if (data.match_found) {
        clearInterval(waitingPollingRef.current!);
        setMatchId(data.match_id);
        setMySymbol(data.your_symbol);
        setSearchingMatch(false);
        setGameStarted(true);
      }
    }, 1000); // Polling cada segundo
    
    return () => {
      if (waitingPollingRef.current) {
        clearInterval(waitingPollingRef.current);
      }
    };
  }
}, [searchingMatch, id]);
```
``matchPollingRef`` - Referencia al intervalo que hace polling al endpoint /matches/{matchId} para sincronizar el estado del tablero durante la partida online.
```typescript
const matchPollingRef = React.useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
  if (matchId && gameStarted && !gameFinished) {
    matchPollingRef.current = setInterval(async () => {
      const response = await fetch(`${url}matches/${matchId}`);
      const data = await response.json();
      
      // Aplanar matriz 2D a array 1D
      setSquares(data.board.flat());
      setIsMyTurn(data.current_turn === mySymbol);
      
      if (data.winner || data.is_draw) {
        setGameFinished(true);
        clearInterval(matchPollingRef.current!);
      }
    }, 1000);
    
    return () => {
      if (matchPollingRef.current) {
        clearInterval(matchPollingRef.current);
      }
    };
  }
}, [matchId, gameStarted, gameFinished, mySymbol]);
```
## Variables Calculadas
``winner`` - Resultado de calculateWinner(squares, boardSize). Devuelve 'X', 'O', o null si no hay ganador.
```typescript
const winner = calculateWinner(squares, boardSize);

// Función calculateWinner
function calculateWinner(squares: string[], boardSize: number): 'X' | 'O' | null {
  const lines = generateWinningLines(boardSize);
  
  for (let line of lines) {
    const [first, ...rest] = line;
    if (squares[first] && rest.every(index => squares[index] === squares[first])) {
      return squares[first] as 'X' | 'O';
    }
  }
  return null;
}
```

``isDraw ``- Booleano calculado: !winner && squares.every(square => square !== ''). Indica si hay empate (tablero lleno sin ganador).

```typescript
const isDraw = !winner && squares.every(square => square !== '');

// Renderizado
{isDraw && <StatusMessage>¡Empate!</StatusMessage>}
```

``winningLine`` - Array de índices que forman la línea ganadora, devuelto por getWinningLine(squares, boardSize). Se usa para resaltar visualmente los cuadrados ganadores.

```typescript
const winningLine = getWinningLine(squares, boardSize);

// Función getWinningLine
function getWinningLine(squares: string[], boardSize: number): number[] {
  const lines = generateWinningLines(boardSize);
  
  for (let line of lines) {
    const [first, ...rest] = line;
    if (squares[first] && rest.every(index => squares[index] === squares[first])) {
      return line;
    }
  }
  return [];
}

// Uso en renderizado
const isWinningSquare = winningLine.includes(index);
```

## Flujo de Estados
### Modo Offline

```typescript
const handleBoardSizeChange = (size: number) => {
  setBoardSize(size);
  setSquares(Array(size * size).fill(''));
};
```

``Configuración``: Usuario selecciona tamaño → setBoardSize(newSize)

```typescript
const handleBoardSizeChange = (size: number) => {
  setBoardSize(size);
  setSquares(Array(size * size).fill(''));
};
```
``Inicio``: Usuario inicia juego → gameStarted = true, gameMode = 'offline'

```typescript
const startOfflineGame = () => {
  setGameMode('offline');
  setGameStarted(true);
  setSquares(Array(boardSize * boardSize).fill(''));
  setXIsNext(true);
};
```
``Jugabilidad``: Clicks alternan → xIsNext cambia, squares se actualiza

```typescript
const handleOfflineClick = (index: number) => {
  if (squares[index] || gameFinished) return;
  
  const newSquares = [...squares];
  newSquares[index] = xIsNext ? 'X' : 'O';
  setSquares(newSquares);
  setXIsNext(!xIsNext);
};
```
``Finalización``: Se detecta ganador/empate → gameFinished = true, scores se actualiza