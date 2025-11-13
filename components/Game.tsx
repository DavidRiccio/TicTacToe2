import { fetchAddDevice, fetchMakeMove, fetchMatchStatus, fetchSearchMatch, fetchWaitingStatus } from '@/lib/conection';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { calculateWinner, getWinningLine } from '../lib/gameLogic';
import { Board } from './Board';
import { PlayAgainButton } from './PlayAgainButton';
import { ScoreBoard } from './ScoreBoard';
import { StatsButton } from './Stats';

interface Score {
  x: number;
  o: number;
}

type GameMode = 'offline' | 'online';

export function Game() {
  const { width, height } = useWindowDimensions();
  const [boardSize, setBoardSize] = React.useState(3);
  const [squares, setSquares] = React.useState(Array(9).fill(''));
  const [xIsNext, setXIsNext] = React.useState(true);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [scores, setScores] = React.useState({ x: 0, o: 0 });
  const [gameFinished, setGameFinished] = React.useState(false);
  const [hasUpdatedScore, setHasUpdatedScore] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const [gameMode, setGameMode] = React.useState<GameMode>('offline');
  const [searchingMatch, setSearchingMatch] = React.useState(false);
  const [matchId, setMatchId] = React.useState<string | null>(null);
  const [mySymbol, setMySymbol] = React.useState<'X' | 'O' | null>(null);
  const [isMyTurn, setIsMyTurn] = React.useState(false);
  
  const waitingPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const winner = calculateWinner(squares, boardSize);
  const isDraw = !winner && squares.every(square => square !== '');
  const winningLine = getWinningLine(squares, boardSize);

  // Inicializar device ID
  useEffect(() => {
    if (id) return;
    const fetchData = async () => {
      const deviceId = await fetchAddDevice();
      setId(deviceId);
    };
    fetchData();
  }, []);

  // Sincronizar el tamaño del array de squares cuando cambia boardSize
  React.useEffect(() => {
    const expectedLength = boardSize * boardSize;
    if (squares.length !== expectedLength) {
      console.log(`Resizing squares array from ${squares.length} to ${expectedLength}`);
      setSquares(Array(expectedLength).fill(''));
    }
  }, [boardSize]);

  // Función para actualizar el tablero desde el servidor
// Función para actualizar el tablero desde el servidor
// Función para actualizar el tablero desde el servidor
const updateBoardFromServer = (matchStatus: any) => {
  // PRIMERO: Actualizar el tamaño del tablero si es necesario
  if (matchStatus.size && matchStatus.size !== boardSize) {
    console.log(`⚠ Updating board size from ${boardSize} to ${matchStatus.size}`);
    setBoardSize(matchStatus.size);
  }
  
  // SEGUNDO: Actualizar el tablero con debug detallado
  if (matchStatus.board && Array.isArray(matchStatus.board)) {
    console.log('📋 RAW BOARD FROM SERVER:');
    console.log(JSON.stringify(matchStatus.board, null, 2));
    
    matchStatus.board.forEach((row: any[], rowIndex: number) => {
      console.log(`Row ${rowIndex}:`, row.map(cell => cell === '' ? '·' : cell).join(' | '));
    });
    
    let flatBoard = matchStatus.board.flat();
    
    flatBoard = flatBoard.map((cell: any, index: number) => {
      const value = (cell === null || cell === undefined || cell === '') ? '' : String(cell);
      console.log(`Index ${index}: "${value}"`);
      return value;
    });
    
    for (let i = 0; i < matchStatus.size; i++) {
      const row = [];
      for (let j = 0; j < matchStatus.size; j++) {
        const index = i * matchStatus.size + j;
        row.push(flatBoard[index] === '' ? '·' : flatBoard[index]);
      }
      console.log(`Row ${i}:`, row.join(' | '));
    }
    
    setSquares(flatBoard);
  }
  
  // TERCERO: Determinar mi símbolo
  let currentMySymbol = mySymbol;
  
  if (matchStatus.players && id) {
    console.log('👥 Players:', matchStatus.players);
    console.log('🆔 My ID:', id);
    
    if (matchStatus.players[id]) {
      currentMySymbol = matchStatus.players[id] as 'X' | 'O';
      console.log(`✓ I am ${currentMySymbol}`);
      if (!mySymbol) setMySymbol(currentMySymbol);
    }
  }
  
  // CUARTO: Actualizar turno
  if (matchStatus.turn && matchStatus.players) {
    console.log('🔄 Current turn device_id:', matchStatus.turn);
    const turnSymbol = matchStatus.players[matchStatus.turn];
    console.log('🔄 Turn symbol:', turnSymbol);
    
    setXIsNext(turnSymbol === 'X');
    
    if (id && currentMySymbol) {
      const myTurn = matchStatus.turn === id;
      console.log(`✓ Is my turn: ${myTurn}`);
      setIsMyTurn(myTurn);
    }
  }
  
  // Verificar si la partida terminó
  if (matchStatus.winner) {
    setGameFinished(true);
    setHasUpdatedScore(true);
  }
  
};



  // Polling para verificar estado de espera (buscando partida)
  useEffect(() => {
    if (!searchingMatch || !id) return;

    const checkWaitingStatus = async () => {
      try {
        const status = await fetchWaitingStatus(id);
        console.log('Waiting status check:', status);
        
        // Si el servidor indica que la partida está lista
        if (status.match_id || status.matched) {
          // Detener polling de espera
          if (waitingPollingRef.current) {
            clearInterval(waitingPollingRef.current);
            waitingPollingRef.current = null;
          }
          
          // Guardar match_id
          const foundMatchId = status.match_id;
          setMatchId(foundMatchId);
          setSearchingMatch(false);
          
          // Hacer fetch inicial del tablero
          const matchStatus = await fetchMatchStatus(foundMatchId);
          
          // Actualizar el tamaño del tablero según el servidor
          if (matchStatus.size) {
            setBoardSize(matchStatus.size);
          }
          
          // Actualizar el tablero desde el servidor
          updateBoardFromServer(matchStatus);
          
          // Iniciar el juego
          setGameStarted(true);
        }
      } catch (error) {
        console.error('Error checking waiting status:', error);
      }
    };

    // Iniciar polling cada 2 segundos
    waitingPollingRef.current = setInterval(checkWaitingStatus, 2000);

    return () => {
      if (waitingPollingRef.current) {
        clearInterval(waitingPollingRef.current);
        waitingPollingRef.current = null;
      }
    };
  }, [searchingMatch, id]);

  // Polling para sincronizar el tablero durante la partida online
  useEffect(() => {
    if (gameMode !== 'online' || !matchId || !gameStarted) {
      console.log('Polling disabled:', { gameMode, matchId, gameStarted });
      return;
    }

    console.log('Starting match polling for match:', matchId);

    const syncMatchStatus = async () => {
      try {
        const matchStatus = await fetchMatchStatus(matchId);
        updateBoardFromServer(matchStatus);
      } catch (error) {
        console.error('Error syncing match status:', error);
      }
    };

    // Hacer una sincronización inmediata
    syncMatchStatus();

    // Sincronizar cada 1 segundo durante la partida
    matchPollingRef.current = setInterval(syncMatchStatus, 1000);

    return () => {
      if (matchPollingRef.current) {
        console.log('Stopping match polling');
        clearInterval(matchPollingRef.current);
        matchPollingRef.current = null;
      }
    };
  }, [gameMode, matchId, gameStarted]);

  const availableWidth = width - 24;
  const availableHeight = height - 200;
  const maxBoardSize = Math.min(availableWidth, availableHeight);
  const squareSize = (maxBoardSize - (boardSize + 1) * 3) / boardSize;
  const fontSize = Math.max(12, squareSize * 0.35);

  React.useEffect(() => {
    if ((winner || isDraw) && !hasUpdatedScore && gameStarted) {
      setGameFinished(true);
      if (winner && gameMode === 'offline') {
        setScores(prev => {
          const newScores = { ...prev };
          newScores[winner.toLowerCase() as 'x' | 'o'] += 1;
          return newScores;
        });
      }
      setHasUpdatedScore(true);
    }
  }, [winner, isDraw, gameStarted, hasUpdatedScore, gameMode]);
const handleSquareClick = async (index: number) => {
  console.log('==============================================');
  console.log('=== SQUARE CLICKED - DEBUG ===');
  console.log('Index clicked:', index);
  
  if (winner || squares[index] !== '') {
    console.log('❌ Click blocked');
    return;
  }
  
  if (gameMode === 'online' && matchId) {
    if (!isMyTurn) {
      console.log('❌ Not my turn');
      return;
    }
    
    if (!matchId || !id) {
      console.error('❌ Missing match_id or device_id');
      return;
    }
    
    try {
      // Calcular coordenadas desde el índice
      const col = index % boardSize;              // columna (j)
      const row = Math.floor(index / boardSize);  // fila (i)
      
      console.log('📍 COORDINATE CALCULATION:');
      console.log(`  Index clicked: ${index}`);
      console.log(`  Row (i): ${row}`);
      console.log(`  Col (j): ${col}`);
      console.log(`  Want to place at: board[${row}][${col}]`);
      console.log(`  You said: click (3,0) -> appears at (0,3)`);
      console.log(`  So server expects: x=row, y=col`);
      console.log(`  Therefore sending: x=${row}, y=${col}`);
      
      setIsMyTurn(false);
      
      if (matchPollingRef.current) {
        clearInterval(matchPollingRef.current);
        matchPollingRef.current = null;
      }
      
      console.log('📤 SENDING TO SERVER:');
      console.log(`  x: ${row} (row)`);
      console.log(`  y: ${col} (col)`);
      console.log(`  Server should place at: board[${row}][${col}]`);
      
      // Enviar row como x, col como y
      const response = await fetchMakeMove(matchId, id, row, col);
      console.log('✓ Server response:', response);
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const matchStatus = await fetchMatchStatus(matchId);
      updateBoardFromServer(matchStatus);
      
      if (gameMode === 'online' && gameStarted) {
        matchPollingRef.current = setInterval(async () => {
          const status = await fetchMatchStatus(matchId);
          updateBoardFromServer(status);
        }, 1000);
      }
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al hacer movimiento');
      
      setIsMyTurn(true);
      
      if (gameMode === 'online' && gameStarted) {
        matchPollingRef.current = setInterval(async () => {
          const status = await fetchMatchStatus(matchId!);
          updateBoardFromServer(status);
        }, 1000);
      }
    }
    console.log('==============================================');
    return;
  }
  
  // Modo offline
  const newSquares = [...squares];
  newSquares[index] = xIsNext ? 'X' : 'O';
  setSquares(newSquares);
  setXIsNext(!xIsNext);
};



  const resetGame = () => {
    setSquares(Array(boardSize * boardSize).fill(''));
    setXIsNext(true);
    setGameFinished(false);
    setHasUpdatedScore(false);
  };

  const handleReset = () => {
    if (gameFinished) {
      resetGame();
    } else {
      const opponent = xIsNext ? 'O' : 'X';
      if (gameMode === 'offline') {
        setScores(prev => {
          const newScores = { ...prev };
          newScores[opponent.toLowerCase() as 'x' | 'o'] += 1;
          return newScores;
        });
      }
      resetGame();
    }
  };

  const handleBoardSizeChange = (size: number) => {
    setBoardSize(size);
    setSquares(Array(size * size).fill(''));
    setXIsNext(true);
    setGameFinished(false);
    setHasUpdatedScore(false);
  };

  const handleStartOfflineGame = () => {
    setGameMode('offline');
    setGameStarted(true);
    resetGame();
  };

  const handleStartOnlineGame = async () => {
    if (!id) {
      console.error('No device ID available');
      return;
    }

    setGameMode('online');
    setSearchingMatch(true);

    try {
      const matchData = await fetchSearchMatch(id, boardSize);
      console.log('Match request sent:', matchData);
      
      if (matchData.match_id) {
        setMatchId(matchData.match_id);
        setSearchingMatch(false);
        
        const matchStatus = await fetchMatchStatus(matchData.match_id);
        
        if (matchStatus.size) {
          setBoardSize(matchStatus.size);
        }
        
        updateBoardFromServer(matchStatus);
        setGameStarted(true);
      }
    } catch (error) {
      console.error('Error starting online game:', error);
      alert('Error al buscar partida online');
      setSearchingMatch(false);
    }
  };

  const handleCancelSearch = () => {
    if (waitingPollingRef.current) {
      clearInterval(waitingPollingRef.current);
      waitingPollingRef.current = null;
    }
    setSearchingMatch(false);
    setGameMode('offline');
  };

  const handleResetScores = () => {
    setScores({ x: 0, o: 0 });
  };

  const handleBackToMenu = () => {
    if (matchPollingRef.current) {
      clearInterval(matchPollingRef.current);
      matchPollingRef.current = null;
    }
    
    setGameStarted(false);
    setGameMode('offline');
    setMatchId(null);
    setMySymbol(null);
    setIsMyTurn(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fafafa',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    gameContainer: {
      flex: 1,
      backgroundColor: '#fafafa',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 44,
      fontWeight: '800',
      color: '#1a1a1a',
      marginBottom: 16,
    },
    configBox: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 28,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    configLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: 18,
      textAlign: 'center',
    },
    sizeGrid: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    sizeButton: {
      width: 52,
      height: 52,
      borderRadius: 10,
      backgroundColor: '#f0f0f0',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#e0e0e0',
    },
    sizeButtonActive: {
      backgroundColor: '#1a1a1a',
      borderColor: '#1a1a1a',
    },
    sizeButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#666',
    },
    sizeButtonTextActive: {
      color: '#fff',
    },
    sizeInfo: {
      fontSize: 13,
      color: '#999',
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      gap: 10,
      marginTop: 20,
    },
    startButton: {
      backgroundColor: '#10b981',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    startButtonOnline: {
      backgroundColor: '#3b82f6',
    },
    startButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },
    resetScoresBtn: {
      backgroundColor: '#ff6b35',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    resetScoresBtnText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
    menuButton: {
      position: 'absolute',
      top: 12,
      left: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      zIndex: 10,
    },
    menuButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#333',
    },
    gameContent: {
      alignItems: 'center',
      paddingTop: 50,
      paddingBottom: 12,
    },
    gameScoreSection: {
      alignItems: 'center',
      marginBottom: 8,
    },
    gameButtonSection: {
      width: '100%',
      marginBottom: 12,
    },
    gameInfo: {
      alignItems: 'center',
      marginBottom: 16,
      marginTop: 8,
    },
    gameSizeInfo: {
      fontSize: 11,
      color: '#999',
      marginBottom: 4,
    },
    gameStatus: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1a1a1a',
      minHeight: 24,
      textAlign: 'center',
    },
    statusWinner: {
      color: '#10b981',
      fontSize: 18,
    },
    statusDraw: {
      color: '#f59e0b',
      fontSize: 18,
    },
    boardWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 0,
      marginVertical: 0,
    },
    modeIndicator: {
      fontSize: 12,
      color: '#666',
      marginBottom: 4,
      fontWeight: '600',
    },
    searchingContainer: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    searchingText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1a1a1a',
      marginTop: 16,
      marginBottom: 8,
    },
    searchingSubtext: {
      fontSize: 14,
      color: '#666',
      marginBottom: 24,
    },
    cancelButton: {
      backgroundColor: '#ef4444',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 10,
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
    },
  });

  if (searchingMatch) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.searchingText}>Buscando partida...</Text>
          <Text style={styles.searchingSubtext}>Esperando oponente ({boardSize}x{boardSize})</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSearch}>
            <Text style={styles.cancelButtonText}>Cancelar búsqueda</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!gameStarted) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>

        <View style={styles.configBox}>
          <Text style={styles.configLabel}>Selecciona tamaño</Text>
          <View style={styles.sizeGrid}>
            {[3, 4, 5, 6, 7].map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeButton, boardSize === size && styles.sizeButtonActive]}
                onPress={() => handleBoardSizeChange(size)}
              >
                <Text style={[styles.sizeButtonText, boardSize === size && styles.sizeButtonTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sizeInfo}>
            {boardSize}x{boardSize} ({boardSize} en raya)
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartOfflineGame}
          >
            <Text style={styles.startButtonText}>🎮 Jugar Offline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.startButton, styles.startButtonOnline]}
            onPress={handleStartOnlineGame}
          >
            <Text style={styles.startButtonText}>🌐 Buscar Partida Online</Text>
          </TouchableOpacity>

          {id && <StatsButton deviceId={id} />}

          <TouchableOpacity
            style={styles.resetScoresBtn}
            onPress={handleResetScores}
          >
            <Text style={styles.resetScoresBtnText}>Reiniciar Puntuación</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const statusText = winner 
    ? `¡${winner} gana!` 
    : isDraw 
    ? '¡Empate!' 
    : gameMode === 'online'
    ? isMyTurn 
      ? `Tu turno (${mySymbol})` 
      : `Turno del oponente (${xIsNext ? 'X' : 'O'})`
    : `Turno: ${xIsNext ? 'X' : 'O'}`;
  
  const statusStyle = [styles.gameStatus, winner && styles.statusWinner, isDraw && styles.statusDraw];

  return (
    <ScrollView style={styles.gameContainer}>
      <TouchableOpacity style={styles.menuButton} onPress={handleBackToMenu}>
        <Text style={styles.menuButtonText}>← Menú</Text>
      </TouchableOpacity>

      <View style={styles.gameContent}>
        <View style={styles.gameScoreSection}>
          {gameMode === 'offline' && <ScoreBoard scores={scores} />}
        </View>

        <View style={styles.gameInfo}>
          <Text style={styles.modeIndicator}>
            {gameMode === 'online' ? `🌐 Online${matchId ? ` (${matchId.slice(0, 8)})` : ''}` : '🎮 Offline'}
          </Text>
          <Text style={styles.gameSizeInfo}>{boardSize}x{boardSize}</Text>
          <Text style={statusStyle}>{statusText}</Text>
        </View>

        <View style={styles.boardWrapper}>
          <Board
            squares={squares}
            onSquareClick={handleSquareClick}
            boardSize={boardSize}
            squareSize={squareSize}
            fontSize={fontSize}
            winningLine={winningLine}
          />
        </View>

        <View style={styles.gameButtonSection}>
          <PlayAgainButton onPress={handleReset} gameFinished={gameFinished} />
        </View>
      </View>
    </ScrollView>
  );
}
