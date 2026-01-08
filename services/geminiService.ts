import { Question } from '../types';
import { getQuestionsFromDB } from './questionsData';

export const generateQuestions = async (themeId: string, level: number): Promise<Question[]> => {
  // Simulate a tiny delay for UI smoothness (optional, can be 0)
  await new Promise(resolve => setTimeout(resolve, 50));

  try {
    const questions = getQuestionsFromDB(themeId, level);
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};