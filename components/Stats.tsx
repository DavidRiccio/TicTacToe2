import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchStats } from '../lib/conection';

interface Stats {
  wins: string;
  losses: string;
  ratio: string;
}

interface StatsButtonProps {
  deviceId: string;
}

export const StatsButton: React.FC<StatsButtonProps> = ({ deviceId }) => {
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    setShowStats(true);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchStats(deviceId);
      setStats(data);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowStats(false);
    setStats(null);
    setError(null);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>📊 Ver Estadísticas</Text>
      </TouchableOpacity>

      <Modal
        visible={showStats}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.header}>Mis Estadísticas</Text>

            {loading && (
              <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
            )}

            {error && !loading && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {stats && !loading && (
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.wins}</Text>
                  <Text style={styles.statLabel}>Victorias</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.losses}</Text>
                  <Text style={styles.statLabel}>Derrotas</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.ratio}</Text>
                  <Text style={styles.statLabel}>Ratio</Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  loader: {
    marginVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    marginVertical: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  closeButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
