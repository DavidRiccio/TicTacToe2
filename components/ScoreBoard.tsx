import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Score {
  x: number;
  o: number;
}

interface ScoreBoardProps {
  scores: Score;
  small?: boolean;
}

const styles = StyleSheet.create({
  scoreBoard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  scoreCardLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
    fontWeight: '600',
  },
  scoreCardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  scoreCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  scoreCompactItem: {
    alignItems: 'center',
  },
  scoreCompactLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  scoreCompactValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scoreCompactDivider: {
    fontSize: 11,
    color: '#ccc',
  },
});

export function ScoreBoard({ scores, small }: ScoreBoardProps) {
  if (small) {
    return (
      <View style={styles.scoreCompact}>
        <View style={styles.scoreCompactItem}>
          <Text style={styles.scoreCompactLabel}>X</Text>
          <Text style={styles.scoreCompactValue}>{scores.x}</Text>
        </View>
        <Text style={styles.scoreCompactDivider}>vs</Text>
        <View style={styles.scoreCompactItem}>
          <Text style={styles.scoreCompactLabel}>O</Text>
          <Text style={styles.scoreCompactValue}>{scores.o}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.scoreBoard}>
      <View style={styles.scoreCard}>
        <Text style={styles.scoreCardLabel}>Jugador X</Text>
        <Text style={styles.scoreCardValue}>{scores.x}</Text>
      </View>
      <View style={styles.scoreDivider} />
      <View style={styles.scoreCard}>
        <Text style={styles.scoreCardLabel}>Jugador O</Text>
        <Text style={styles.scoreCardValue}>{scores.o}</Text>
      </View>
    </View>
  );
}
