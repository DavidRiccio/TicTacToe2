import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PlayAgainButtonProps {
  onPress: () => void;
  text?: string;
}

export function PlayAgainButton({ onPress, text = "Jugar de nuevo" }: PlayAgainButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
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
