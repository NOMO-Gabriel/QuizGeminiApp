# Tutoriel React Native pour Débutants avec TypeScript - Application de Quiz avec Expo (Version actualisée)

## Préparation de votre environnement Git

Avant de commencer le développement, vous devez créer une nouvelle branche dans votre dépôt GitHub pour isoler votre travail. Voici comment procéder:

### Création d'une nouvelle branche vide

```bash
# 1. Assurez-vous d'avoir la dernière version de la branche principale
git checkout main  # ou master selon votre configuration
git pull

# 2. Créez une nouvelle branche
git checkout -b quiz-app

# 3. Si vous souhaitez une branche vraiment vide (sans les fichiers actuels)
# Option A - Créer une branche orpheline (sans historique partagé avec main)
git checkout --orphan quiz-app
git rm -rf .  # Supprime tous les fichiers de l'index

# Option B - Garder l'historique mais sans les fichiers
git checkout -b quiz-app
git rm -rf .
git commit -m "Création d'une branche vide pour l'application de quiz"
```

Maintenant que vous avez votre branche prête, passons au développement de l'application!

## Table des matières

1. [Introduction à React Native avec TypeScript](#introduction-à-react-native-avec-typescript)
2. [Installation et configuration](#installation-et-configuration)
3. [Structure du projet](#structure-du-projet)
4. [Composants principaux](#composants-principaux)
5. [Intégration de l'API Gemini](#intégration-de-lapi-gemini)
6. [Gestion des scores](#gestion-des-scores)
7. [Navigation entre les écrans](#navigation-entre-les-écrans)
8. [Styles et thème](#styles-et-thème)
9. [Tests et déploiement](#tests-et-déploiement)
10. [Ressources supplémentaires](#ressources-supplémentaires)

## Introduction à React Native avec TypeScript

### Qu'est-ce que React Native avec TypeScript?

React Native est un framework JavaScript créé par Facebook qui permet de développer des applications mobiles natives pour iOS et Android à partir d'une seule base de code. TypeScript est un surensemble de JavaScript qui ajoute des types statiques, ce qui facilite la détection des erreurs pendant le développement et améliore l'expérience de développement grâce à de meilleurs outils et complétion de code.

### Avantages de TypeScript

1. **Typage statique** - Détecte les erreurs de type à la compilation plutôt qu'à l'exécution
2. **Meilleure documentation** - Les types servent de documentation en temps réel
3. **Intellisense amélioré** - Autocomplétion et suggestions plus précises
4. **Refactoring plus sûr** - Permet de renommer et restructurer le code avec confiance

### Concepts clés à comprendre

1. **Composants** - Ce sont les blocs de construction de votre interface utilisateur, similaires aux éléments HTML dans le développement web
   
2. **Props et interfaces** - Les "properties" sont des paramètres que vous passez aux composants, définis avec des interfaces TypeScript
   
3. **State et hooks typés** - L'état interne d'un composant qui peut changer au fil du temps, avec des types spécifiques
   
4. **TSX** - C'est une extension de syntaxe TypeScript qui ressemble à du HTML et permet de décrire l'interface utilisateur
   
5. **Hooks** - Introduits dans React 16.8, les Hooks comme `useState<T>` et `useEffect` permettent d'utiliser l'état et d'autres fonctionnalités de React sans écrire de classes

### Différences avec le développement web

- Les éléments d'interface ne sont pas des balises HTML mais des composants spécifiques à React Native comme `View` (div), `Text` (span, p), etc.
- Le style utilise une version modifiée de CSS avec certaines propriétés absentes et d'autres ajoutées
- La mise en page utilise principalement Flexbox, qui fonctionne un peu différemment que sur le web

### Pourquoi Expo?

Expo est une plateforme qui simplifie le développement React Native en offrant:
- Une configuration plus facile sans avoir à gérer Xcode ou Android Studio
- Un accès aux API natives courantes via des modules simples
- Un client mobile pour tester rapidement vos applications
- Des outils de déploiement simplifiés

## Installation et configuration

### Installation des outils nécessaires

Avant de commencer, vous aurez besoin de:
1. Node.js (version 16 ou supérieure)
2. npm ou yarn
3. Un éditeur de code (VS Code recommandé)
4. L'application Expo Go sur votre smartphone (pour tester en direct)

### Pour un nouveau projet

Si vous créez un nouveau projet Expo avec TypeScript, vous pouvez utiliser la commande suivante:

```bash
# Cette commande crée un nouveau projet avec TypeScript
npx create-expo-app QuizGeminiApp
```

Les nouvelles versions d'Expo utilisent automatiquement TypeScript et intègrent un système de routage basé sur le système de fichiers.

### Structure initiale du projet

Après la création, votre projet aura cette structure:

```
QuizGeminiApp/
├── app/                # Écrans et navigation basés sur le système de fichiers
│   ├── (tabs)/        # Écrans organisés par onglets (si présent)
│   ├── _layout.tsx    # Configuration de la mise en page
│   ├── index.tsx      # Écran principal/d'accueil
├── assets/            # Images, polices, etc.
├── components/        # Composants réutilisables
├── constants/         # Constantes (couleurs, dimensions, etc.)
│   └── Colors.ts      # Définitions des couleurs
├── hooks/             # Hooks personnalisés
├── .gitignore         # Fichiers à ignorer par Git
├── app.json           # Configuration Expo
├── tsconfig.json      # Configuration TypeScript
├── expo-env.d.ts      # Déclarations de types pour Expo
└── package.json       # Dépendances et scripts
```

### Installation des dépendances supplémentaires

Notre application de quiz aura besoin de plusieurs bibliothèques:

```bash
# Pour le stockage local sécurisé
npx expo install expo-secure-store

# Pour les requêtes HTTP vers l'API Gemini
npm install axios

# Pour les variables d'environnement (clés API)
npx expo install react-native-dotenv

npm install dotenv
```

> **Note**: La navigation est déjà intégrée dans le routeur d'Expo récent basé sur le système de fichiers.

### Configuration des variables d'environnement

Créez un fichier `.env` à la racine de votre projet:

```typescript
GEMINI_API_KEY=votre_clé_api_gemini
```

Créez un fichier `.env.ts` à la racine de votre projet:
```typescript
import * as dotenv from 'dotenv';
dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

```

Ouvrez le fichier `expo-env.d.ts` existant et ajoutez:

```typescript
/// <reference types="expo" />

// Ajoutez cette déclaration pour le module dotenv
declare module 'dotenv' {
  export function config(): void;
}

// Déclaration pour les variables d'environnement dans Node
declare namespace NodeJS {
  interface ProcessEnv {
    GEMINI_API_KEY?: string;
  }
}
```
Dans vos fichiers,vous pouvez maintenat importer votre api key:
```typescript
import { GEMINI_API_KEY } from '../env';
```
## Structure du projet pour notre application de quiz

Pour notre application de quiz, nous allons créer les dossiers et fichiers supplémentaires nécessaires:

```bash
# Créez les dossiers nécessaires
mkdir -p app/api app/types
```

Voici la structure que nous allons créer:

```
QuizGeminiApp/
├── app/                     # Dossier principal des écrans et navigation
│   ├── api/                 # Services d'API
│   │   └── gemini.ts        # Client API Gemini 
│   ├── types/               # Définitions de types TypeScript
│   │   ├── navigation.ts    # Types pour la navigation
│   │   └── quiz.ts          # Types pour le quiz
│   ├── index.tsx            # Écran d'accueil du quiz
│   ├── quiz.tsx             # Écran du quiz
│   └── score.tsx            # Écran des résultats
├── components/              # Composants réutilisables
│   └── Button.tsx           # Bouton personnalisé
├── hooks/                   # Hooks personnalisés
│   └── useSecureStorage.ts  # Hook pour le stockage sécurisé
├── constants/               # Constantes et thèmes
│   └── Colors.ts            # Couleurs de l'application
├── .env                     # Variables d'environnement
└── package.json
```

## Définition des types de base

Créons les types de base pour notre application. Créez le fichier `app/types/quiz.ts`:

```typescript
// Définition des types pour notre application Quiz

// Type pour une question de quiz
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string; // 'A', 'B', 'C', ou 'D'
}

// Type pour une réponse de l'API Gemini
export interface GeminiResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Type pour les scores
export type Score = number;
```

Pour la navigation, nous n'avons pas besoin de créer un fichier spécial car Expo Router gère la navigation pour nous. Les types pour les paramètres peuvent être définis directement dans les composants concernés.

## Composants principaux

### Écran d'accueil

Modifiez ou créez le fichier `app/index.tsx`:

```tsx
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
import { getTopScores } from '../hooks/useSecureStorage';
import { Score } from './types/quiz';
import Colors from '../constants/Colors';

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
```

> **Explication des différences avec la version précédente**:
> 
> 1. **Navigation avec Expo Router**:
>    - Au lieu d'utiliser `navigation.navigate()`, nous utilisons `router.push('/quiz')`
>    - Pas besoin de prop `navigation` car nous utilisons l'API de routage d'Expo
> 
> 2. **Styles**:
>    - Nous utilisons les couleurs du fichier `Colors.ts` existant
>
> 3. **Hook personnalisé**:
>    - Nous importons la fonction `getTopScores` depuis un hook personnalisé dans le dossier hooks

## Intégration de l'API Gemini

Créez le fichier `app/api/gemini.ts` pour interagir avec l'API Gemini:

```typescript
import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import { GeminiResponse, QuizQuestion } from '../types/quiz';

// URL de base de l'API Gemini
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Génère une question de quiz avec Gemini API
 * @param {string} category - Catégorie optionnelle du quiz
 * @returns {Promise<QuizQuestion>}
 */
export const generateQuizQuestion = async (category = 'général'): Promise<QuizQuestion> => {
  try {
    // Construction du prompt pour Gemini
    const prompt = `Génère une question de quiz à choix multiple sur le sujet "${category}" avec exactement 4 options de réponse (A, B, C, D). 
    Fournis la question, les 4 options de réponse et indique la lettre de la réponse correcte. 
    Réponds uniquement au format JSON suivant sans aucun texte additionnel:
    {
      "question": "La question du quiz ici",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A"
    }`;

    // Requête à l'API Gemini
    const response = await axios.post(
      `${API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,  // Contrôle la créativité/aléatoire des réponses (0-1)
          maxOutputTokens: 1024,  // Limite la longueur de la réponse
        }
      }
    );

    // Extraction de la réponse JSON de la réponse de l'API
    const content = response.data.candidates[0].content.parts[0].text;
    
    // Nettoyage et parsing du JSON
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const parsedResponse: GeminiResponse = JSON.parse(cleanedContent);

    return {
      question: parsedResponse.question,
      options: parsedResponse.options,
      correctAnswer: parsedResponse.correctAnswer
    };
  } catch (error) {
    console.error('Erreur lors de la génération de question:', error);
    
    // En cas d'erreur, retourne une question par défaut
    return {
      question: "Quelle est la capitale de la France?",
      options: ["Londres", "Paris", "Berlin", "Madrid"],
      correctAnswer: "B"
    };
  }
};

/**
 * Génère un lot de questions de quiz
 * @param {number} count - Nombre de questions à générer
 * @returns {Promise<QuizQuestion[]>} - Tableau de questions
 */
export const generateQuizBatch = async (count = 10): Promise<QuizQuestion[]> => {
  const questions: QuizQuestion[] = [];
  // Différentes catégories pour varier les questions
  const categories: string[] = [
    'histoire', 'géographie', 'sciences', 'littérature', 
    'sport', 'cinéma', 'musique', 'technologie', 'art', 'nature'
  ];

  try {
    for (let i = 0; i < count; i++) {
      // Sélection d'une catégorie aléatoire
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const question = await generateQuizQuestion(randomCategory);
      questions.push(question);
    }
    return questions;
  } catch (error) {
    console.error('Erreur lors de la génération du lot de questions:', error);
    throw error;
  }
};
```

## Gestion du stockage sécurisé

Créez le fichier `hooks/useSecureStorage.ts` pour gérer le stockage des scores:

```typescript
import * as SecureStore from 'expo-secure-store';
import { Score } from '../app/types/quiz';

// Clé utilisée pour stocker les scores dans SecureStore
const TOP_SCORES_KEY = 'quiz_top_scores';

/**
 * Récupère les meilleurs scores stockés
 * @returns {Promise<Score[]>} Tableau des meilleurs scores
 */
export const getTopScores = async (): Promise<Score[]> => {
  try {
    // Récupérer la chaîne JSON stockée
    const storedScores = await SecureStore.getItemAsync(TOP_SCORES_KEY);
    
    // Si rien n'est stocké, retourner un tableau vide
    if (!storedScores) {
      return [];
    }
    
    // Convertir la chaîne JSON en tableau JavaScript
    return JSON.parse(storedScores) as Score[];
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    return [];
  }
};

/**
 * Sauvegarde un nouveau score et ne garde que les 3 meilleurs
 * @param {Score} newScore - Le nouveau score à sauvegarder
 * @returns {Promise<boolean>} - Succès de l'opération
 */
export const saveNewScore = async (newScore: Score): Promise<boolean> => {
  try {
    // Récupérer les scores actuels
    const currentScores = await getTopScores();
    
    // Ajouter le nouveau score au tableau
    const allScores = [...currentScores, newScore];
    
    // Trier par ordre décroissant (du plus grand au plus petit)
    allScores.sort((a, b) => b - a);
    
    // Garder uniquement les 3 meilleurs scores
    const topScores = allScores.slice(0, 3);
    
    // Sauvegarder les meilleurs scores en format JSON
    await SecureStore.setItemAsync(TOP_SCORES_KEY, JSON.stringify(topScores));
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du score:', error);
    return false;
  }
};
```

## Écran du quiz

Créez le fichier `app/quiz.tsx`:

```tsx
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
import { generateQuizBatch } from './api/gemini';
import { QuizQuestion } from './types/quiz';
import Colors from '../constants/Colors';

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
```

> **Explication des adaptations à Expo Router**:
>
> 1. **Navigation**:
>    - Nous utilisons `router.push()` et `router.back()` au lieu de `navigation.navigate()` et `navigation.goBack()`
>    - Pour passer des paramètres, nous utilisons l'objet `{ pathname: '/score', params: { score, totalQuestions } }`
>
> 2. **Couleurs du thème**:
>    - Nous utilisons les constantes du fichier `Colors.ts` existant
>    - Assurez-vous que votre fichier contient les propriétés `primary`, `success`, et `error`
>
> 3. **Note sur les couleurs**:
>    - Si les couleurs `success` et `error` n'existent pas dans votre fichier `Colors.ts`, vous pouvez les ajouter ou remplacer par des valeurs directes comme `#4CAF50` pour `success` et `#F44336` pour `error`

## Écran des résultats

Créez le fichier `app/score.tsx`:

```tsx
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
import { saveNewScore, getTopScores } from '../hooks/useSecureStorage';
import Colors from '../constants/Colors';

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
```

> **Explication des spécificités d'Expo Router**:
>
> 1. **Récupération des paramètres**:
>    - Nous utilisons le hook `useLocalSearchParams<ScoreParams>()` pour récupérer les paramètres d'URL
>    - Les paramètres sont toujours des chaînes, nous devons donc les convertir en nombres
>
> 2. **Navigation**:
>    - `router.push('/')` pour retourner à l'écran d'accueil
>    - `router.push('/quiz')` pour redémarrer le quiz

## Adaptation du fichier Colors.ts

Si votre fichier `constants/Colors.ts` ne contient pas toutes les couleurs dont nous avons besoin, vous pouvez le mettre à jour. Voici comment il devrait être:

```typescript
// Définition des couleurs pour notre application
const Colors = {
  primary: '#0066CC',
  secondary: '#4CAF50',
  success: '#4CAF50',  // Vert pour les réponses correctes
  error: '#F44336',    // Rouge pour les réponses incorrectes
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#666666',
  border: '#dddddd',
  highlight: '#FFF9C4',
};

export default Colors;
```

## Adaptation à votre projet existant

Votre projet Expo semble utiliser une structure spécifique basée sur les captures d'écran que vous avez partagées, avec:
- Un dossier `app` qui contient des fichiers comme `(tabs)/_layout.tsx`
- Des composants déjà structurés dans `components/ui`
- Des hooks et constantes prédéfinis

### Intégration avec les composants existants

Pour tirer parti des composants existants dans votre projet:

1. **Pour le dossier `components`**:
   - Examinez les composants dans `components/ui` comme `Collapsible.tsx` et `ThemedText.tsx`
   - Utilisez ces composants plutôt que d'en créer de nouveaux
   - Par exemple, remplacez `<Text style={styles.title}>` par `<ThemedText style={styles.title}>`

2. **Pour les hooks**:
   - Utilisez les hooks existants comme `useColorScheme.ts` pour la gestion des thèmes
   - Intégrez notre hook `useSecureStorage` avec la structure existante

3. **Pour la navigation**:
   - Si vous utilisez déjà un système d'onglets `(tabs)`, ajoutez nos écrans dans cette structure
   - Modifiez `_layout.tsx` pour intégrer nos écrans de quiz

### Exemples d'adaptation

**Adaptation du fichier de navigation `app/(tabs)/_layout.tsx`**:

```tsx
import { Tabs } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <TabBarIcon name="question-circle" color={color} />,
        }}
      />
      // Autres onglets existants
    </Tabs>
  );
}
```

**Utilisation des composants de thème existants**:

```tsx
// Dans app/quiz.tsx
import ThemedText from '../components/ThemedText';
import Colors from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function QuizScreen() {
  const colorScheme = useColorScheme();
  // Reste du code en utilisant Colors[colorScheme].background, etc.
  
  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <ThemedText style={styles.questionText}>{currentQuestion.question}</ThemedText>
      {/* Reste du composant */}
    </View>
  );
}
```

## Test et déboggage

Si vous rencontrez des problèmes avec un composant spécifique, voici quelques conseils de débogage pour Expo Router:

1. **Vérifiez la console pour les erreurs**:
   - Les erreurs TypeScript apparaissent généralement dans la console
   - Expo fournit des messages d'erreur utiles

2. **Structure des fichiers**:
   - Assurez-vous que les fichiers sont placés aux bons endroits
   - `index.tsx` sera l'écran d'accueil
   - `quiz.tsx` et `score.tsx` doivent être au même niveau

3. **Variables d'environnement**:
   - Si vous n'arrivez pas à accéder à `GEMINI_API_KEY`, vérifiez que:
     - Vous avez installé react-native-dotenv
     - Vous avez mis à jour `expo-env.d.ts`
     - Vous avez créé le fichier `.env` avec la clé

4. **Problèmes de couleurs**:
   - Si les références aux couleurs produisent des erreurs, utilisez des valeurs directes comme:
     - `#0066CC` au lieu de `Colors.primary`
     - `#4CAF50` au lieu de `Colors.success`

## Déployer votre application

Pour créer une version de production avec Expo EAS:

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à votre compte Expo
eas login

# Configurer le build
eas build:configure

# Créer un build pour Android
eas build --platform android

# Créer un build pour iOS (nécessite un compte Apple Developer)
eas build --platform ios
```

### Avantages de TypeScript pour le déploiement

TypeScript offre des avantages significatifs lors du déploiement d'applications:

1. **Moins de bugs en production**: La vérification des types à la compilation réduit les erreurs dans l'application publiée
2. **Processus de build plus robuste**: Les erreurs sont détectées avant même que le build ne commence
3. **Maintenance à long terme**: La documentation intégrée via les types facilite la maintenance et l'évolution de l'application