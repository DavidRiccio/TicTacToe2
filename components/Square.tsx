import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  square: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    margin: 1,
    borderRadius: 8,
  },
  winning: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
    borderWidth: 2,
  },
  text: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
});

interface SquareProps {
  value: string;
  onPress: () => void;
  size: number;
  fontSize: number;
  isWinning?: boolean;
}

export function Square({ value, onPress, size, fontSize, isWinning }: SquareProps) {
  return (
    <TouchableOpacity
      style={[styles.square, { width: size, height: size }, isWinning && styles.winning]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { fontSize }]}>{value}</Text>
    </TouchableOpacity>
  );
}
