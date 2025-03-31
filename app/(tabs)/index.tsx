import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { getTopScores } from '../../hooks/useSecureStorage';
import { Score } from '../types/quiz';
import Colors from '../../constants/Colors';

export default function HomeScreen() {
  // État local pour stocker les meilleurs scores et indiquer le chargement
  const [topScores, setTopScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect s'exécute après le rendu du composant
  useEffect(() => {
    loadTopScores();
    
    return () => {
      // Nettoyage lors du démontage du composant si nécessaire
    };
  }, []); 

  // Fonction pour charger les meilleurs scores
  const loadTopScores = async (): Promise<void> => {
    try {
      setLoading(true);
      const scores = await getTopScores();
      setTopScores(scores);
    } catch (error) {
      console.error('Erreur lors du chargement des scores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour démarrer le quiz
  const startQuiz = (): void => {
    router.push('/quiz');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quiz Gemini</Text>
      <Text style={styles.subtitle}>
        Testez vos connaissances avec 10 questions générées par IA
      </Text>

      {/* Bouton pour commencer le quiz */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={startQuiz}
      >
        <Text style={styles.startButtonText}>Commencer le Quiz</Text>
      </TouchableOpacity>

      {/* Affichage des meilleurs scores */}
      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>Meilleurs scores:</Text>
        
        {loading ? (
          // Indicateur de chargement
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : topScores.length > 0 ? (
          // Liste des scores si disponible
          <FlatList
            data={topScores}
            keyExtractor={(item, index) => `score-${index}`}
            renderItem={({ item, index }) => (
              <View style={styles.scoreItem}>
                <Text style={styles.scoreRank}>#{index + 1}</Text>
                <Text style={styles.scoreValue}>{item} points</Text>
              </View>
            )}
          />
        ) : (
          // Message si aucun score
          <Text style={styles.noScores}>
            Aucun score enregistré. Jouez pour apparaître ici!
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    elevation: 3, // Ombre pour Android
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoresContainer: {
    marginTop: 40,
    width: '100%',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  scoreRank: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: Colors.primary,
  },
  scoreValue: {
    fontSize: 16,
    color: '#333',
  },
  noScores: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginVertical: 20,
  },
});