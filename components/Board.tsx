import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Square } from './Square';

const styles = StyleSheet.create({
  board: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
});

interface BoardProps {
  squares: string[];
  onSquareClick: (index: number) => void;
  boardSize: number;
  squareSize: number;
  fontSize: number;
  winningLine: number[] | null;
}

export function Board({ squares, onSquareClick, boardSize, squareSize, fontSize, winningLine }: BoardProps) {
  const rows = [];

  for (let i = 0; i < boardSize; i++) {
    const rowSquares = [];
    for (let j = 0; j < boardSize; j++) {
      const index = i * boardSize + j;
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onPress={() => onSquareClick(index)}
          size={squareSize}
          fontSize={fontSize}
          isWinning={winningLine?.includes(index)}
        />
      );
    }
    rows.push(
      <View key={i} style={styles.row}>
        {rowSquares}
      </View>
    );
  }

  return <View style={styles.board}>{rows}</View>;
}
