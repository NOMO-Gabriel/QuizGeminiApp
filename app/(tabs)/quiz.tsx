import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { generateQuizBatch } from '../api/gemini';
import { QuizQuestion } from '../types/quiz';
import Colors from '../../constants/Colors';

// Définition du mapping entre index et lettres d'options
type OptionIndexMap = { [key: string]: number };
type IndexOptionMap = string[];

export default function QuizScreen() {
  // États pour gérer les questions et le déroulement du quiz
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);

  // Mappages pour convertir entre index et lettres d'options
  const optionToIndex: OptionIndexMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  const indexToOption: IndexOptionMap = ['A', 'B', 'C', 'D'];

  // Chargement des questions au montage du composant
  useEffect(() => {
    loadQuestions();
  }, []);

  // Fonction pour charger les questions depuis l'API
  const loadQuestions = async (): Promise<void> => {
    try {
      setLoading(true);
      const quizQuestions = await generateQuizBatch(10);
      setQuestions(quizQuestions);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Impossible de charger les questions. Veuillez réessayer.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la sélection d'une option
  const handleOptionSelect = (optionIndex: number): void => {
    // Empêcher de changer de réponse après avoir déjà répondu
    if (answeredCorrectly !== null) return;

    setSelectedOption(optionIndex);
    
    const currentQuestion = questions[currentQuestionIndex];
    const correctIndex = optionToIndex[currentQuestion.correctAnswer];
    
    // Vérifier si la réponse est correcte
    if (optionIndex === correctIndex) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(true);
    } else {
      setAnsweredCorrectly(false);
    }
  };

  // Passage à la question suivante
  const goToNextQuestion = (): void => {
    if (currentQuestionIndex < questions.length - 1) {
      // Passer à la question suivante
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setAnsweredCorrectly(null);
    } else {
      // Fin du quiz - naviguer vers l'écran des résultats
      router.push({
        pathname: '/score',
        params: { score, totalQuestions: questions.length }
      });
    }
  };

  // Affichage de l'indicateur de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* Affichage de la question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Options de réponse */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption,
              answeredCorrectly !== null && index === optionToIndex[currentQuestion.correctAnswer] && 
                styles.correctOption,
              answeredCorrectly === false && selectedOption === index && 
                styles.incorrectOption
            ]}
            onPress={() => handleOptionSelect(index)}
            disabled={answeredCorrectly !== null}
          >
            <Text style={styles.optionLetter}>{indexToOption[index]}</Text>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Affichage du feedback après réponse */}
      {answeredCorrectly !== null && (
        <View style={styles.feedbackContainer}>
          <Text style={[
            styles.feedbackText,
            answeredCorrectly ? styles.correctFeedback : styles.incorrectFeedback
          ]}>
            {answeredCorrectly
              ? "Correct! 👏"
              : `Incorrect. La bonne réponse est ${currentQuestion.correctAnswer}.`}
          </Text>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={goToNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex < questions.length - 1 ? "Question suivante" : "Voir le résultat"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Affichage du score actuel */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score actuel: {score}/{currentQuestionIndex + 1}</Text>
      </View>
    </SafeAreaView>
  );
}

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden', // Pour que le remplissage ne dépasse pas
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  questionContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2, // Ombre pour Android
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26, // Espacement des lignes
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: '#E6F0FF',
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: '#E8F5E9',
  },
  incorrectOption: {
    borderColor: Colors.error,
    backgroundColor: '#FFEBEE',
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 30, // Centrer verticalement le texte
    marginRight: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  feedbackContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  correctFeedback: {
    color: Colors.success,
  },
  incorrectFeedback: {
    color: Colors.error,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreContainer: {
    padding: 16,
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});