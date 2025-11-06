import { fetchAddDevice } from '@/lib/conection';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { calculateWinner, getWinningLine } from '../lib/gameLogic';
import { Board } from './Board';
import { PlayAgainButton } from './PlayAgainButton';
import { ScoreBoard } from './ScoreBoard';
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
});

interface Score {
  x: number;
  o: number;
}

export function Game() {
  const { width, height } = useWindowDimensions();
  const [boardSize, setBoardSize] = React.useState(3);
  const [squares, setSquares] = React.useState(Array(9).fill(''));
  const [xIsNext, setXIsNext] = React.useState(true);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [scores, setScores] = React.useState<Score>({ x: 0, o: 0 });
  const [gameFinished, setGameFinished] = React.useState(false);
  const [hasUpdatedScore, setHasUpdatedScore] = React.useState(false);

  const winner = calculateWinner(squares, boardSize);
  const isDraw = !winner && squares.every(square => square !== '');
  const winningLine = getWinningLine(squares, boardSize);

  useEffect(()=> {
    const id = fetchAddDevice();
  });


  const availableWidth = width - 24;
  const availableHeight = height - 200;
  const maxBoardSize = Math.min(availableWidth, availableHeight);
  const squareSize = (maxBoardSize - (boardSize + 1) * 3) / boardSize;
  const fontSize = Math.max(12, squareSize * 0.35);

  React.useEffect(() => {
    if ((winner || isDraw) && !hasUpdatedScore && gameStarted) {
      setGameFinished(true);
      if (winner) {
        setScores(prev => {
          const newScores = { ...prev };
          newScores[winner.toLowerCase() as 'x' | 'o'] += 1;
          return newScores;
        });
      }
      setHasUpdatedScore(true);
    }
  }, [winner, isDraw, gameStarted, hasUpdatedScore]);

  const handleSquareClick = (index: number) => {
    if (winner || squares[index] !== '') return;
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
      setScores(prev => {
        const newScores = { ...prev };
        newScores[opponent.toLowerCase() as 'x' | 'o'] += 1;
        return newScores;
      });
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

  const handleStartGame = () => {
    setGameStarted(true);
    resetGame();
  };

  const handleResetScores = () => {
    setScores({ x: 0, o: 0 });
  };

  if (!gameStarted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>
        
        <ScoreBoard scores={scores} />

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

          <Text style={styles.sizeInfo}>{boardSize}x{boardSize} ({boardSize} en raya)</Text>
        </View>

        <View style={styles.buttonContainer}>
          <PlayAgainButton onPress={handleStartGame} text="Jugar" />
          <TouchableOpacity style={styles.resetScoresBtn} onPress={handleResetScores}>
            <Text style={styles.resetScoresBtnText}>Reiniciar Puntuación</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusText = winner ? `¡${winner} gana!` : isDraw ? '¡Empate!' : `Turno: ${xIsNext ? 'X' : 'O'}`;
  const statusStyle = [styles.gameStatus, winner && styles.statusWinner, isDraw && styles.statusDraw];

  return (
    <View style={styles.gameContainer}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setGameStarted(false)}>
        <Text style={styles.menuButtonText}>← Menú</Text>
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.gameContent}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gameScoreSection}>
          <ScoreBoard scores={scores} small={true} />
        </View>

        <View style={styles.gameButtonSection}>
          <PlayAgainButton onPress={handleReset} text="Reiniciar" />
        </View>

        <View style={styles.gameInfo}>
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
      </ScrollView>
    </View>
  );
}
