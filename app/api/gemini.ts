import axios from 'axios';
import { GEMINI_API_KEY } from '../../env';
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