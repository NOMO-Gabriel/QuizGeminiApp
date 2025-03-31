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