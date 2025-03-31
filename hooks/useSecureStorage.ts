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