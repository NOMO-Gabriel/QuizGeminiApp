import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { saveNewScore, getTopScores } from '../../hooks/useSecureStorage';
import Colors from '../../constants/Colors';

// Type pour les paramètres de l'URL
type ScoreParams = {
  score: string;
  totalQuestions: string;
};

export default function ScoreScreen() {
  // Récupérer les paramètres passés via la navigation
  const params = useLocalSearchParams<ScoreParams>();
  
  // Convertir les paramètres de chaîne en nombres
  const score = parseInt(params.score || '0', 10);
  const totalQuestions = parseInt(params.totalQuestions || '10', 10);
  
  // États locaux
  const [loading, setLoading] = useState<boolean>(true);
  const [isHighScore, setIsHighScore] = useState<boolean>(false);
  const [rank, setRank] = useState<number | null>(null);

  // Calculer le pourcentage de bonnes réponses
  const percentage = Math.round((score / totalQuestions) * 100);

  // Sauvegarder le score et vérifier s'il s'agit d'un record
  useEffect(() => {
    saveScoreAndCheckRanking();
  }, []);

  const saveScoreAndCheckRanking = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Sauvegarder le score
      await saveNewScore(score);
      
      // Récupérer tous les scores pour déterminer le classement
      const topScores = await getTopScores();
      
      // Vérifier si c'est un top score (parmi les 3 meilleurs)
      const scoreIndex = topScores.indexOf(score);
      if (scoreIndex !== -1) {
        setIsHighScore(true);
        setRank(scoreIndex + 1);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du score:', error);
    } finally {
      setLoading(false);
    }
  };

  // Message de feedback basé sur le score
  const getFeedbackMessage = (): string => {
    if (percentage >= 90) return "Excellent! Tu es un expert!";
    if (percentage >= 70) return "Très bien! Tu as de bonnes connaissances!";
    if (percentage >= 50) return "Pas mal! Tu peux encore t'améliorer.";
    return "Continue à apprendre, tu feras mieux la prochaine fois!";
  };

  // Fonction pour partager le score
  const shareResult = async (): Promise<void> => {
    try {
      await Share.share({
        message: `J'ai obtenu ${score}/${totalQuestions} (${percentage}%) dans le Quiz Gemini! 🎯`,
      });
    } catch (error) {
      console.log('Erreur lors du partage:', error);
    }
  };

  // Redémarrer le quiz
  const restartQuiz = (): void => {
    router.push('/quiz');
  };

  // Retourner à l'écran d'accueil
  const goHome = (): void => {
    router.push('/');
  };

  // Afficher l'indicateur de chargement pendant la sauvegarde
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Sauvegarde de votre score...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carte de score */}
      <View style={styles.scoreCard}>
        <Text style={styles.resultTitle}>Résultat Final</Text>
        
        {/* Affichage du score */}
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.totalQuestions}>/{totalQuestions}</Text>
        </View>
        
        {/* Pourcentage */}
        <Text style={styles.percentageText}>{percentage}%</Text>
        
        {/* Message de feedback */}
        <Text style={styles.feedbackMessage}>{getFeedbackMessage()}</Text>
        
        {/* Message de record si applicable */}
        {isHighScore && (
          <View style={styles.highScoreContainer}>
            <Text style={styles.highScoreText}>
              🏆 Nouveau record! #{rank} au classement
            </Text>
          </View>
        )}
      </View>
      
      {/* Boutons d'actions */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={shareResult}>
          <Text style={styles.buttonText}>Partager</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={restartQuiz}>
          <Text style={styles.buttonText}>Rejouer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={goHome}
        >
          <Text style={styles.buttonText}>Accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 30,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline', // Aligne les textes de tailles différentes par le bas
    marginBottom: 10,
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  totalQuestions: {
    fontSize: 28,
    color: '#666',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  feedbackMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 15,
    lineHeight: 24,
  },
  highScoreContainer: {
    backgroundColor: '#FFF9C4', // Jaune pâle
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  highScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8F00', // Orange
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
  },
  homeButton: {
    backgroundColor: Colors.success || '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});