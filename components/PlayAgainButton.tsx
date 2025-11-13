import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PlayAgainButtonProps {
  onPress: () => void;
  gameFinished?: boolean;
}

export function PlayAgainButton({ onPress, gameFinished = false }: PlayAgainButtonProps) {
  const buttonText = gameFinished ? 'Jugar de nuevo' : 'Rendirse';
  
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
