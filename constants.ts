import { Theme } from './types';

export const QUESTIONS_PER_LEVEL = 12;
export const TIME_PER_QUESTION = 15;
export const MAX_LIVES = 3;
export const TOTAL_LEVELS = 6;

export const THEMES: Theme[] = [
  // --- STANDARD MODULES ---
  { id: 'cars', name: 'Carros', icon: 'Car', color: 'text-red-400', description: 'Motores, modelos y marcas legendarias.' },
  { id: 'general', name: 'Cultura', icon: 'Globe', color: 'text-blue-400', description: 'Geografía, arte e historia mundial.' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', color: 'text-purple-400', description: 'Historia, consolas y personajes.' },
  { id: 'tech', name: 'Tecnología', icon: 'Cpu', color: 'text-emerald-400', description: 'Innovación, código y hardware.' },
  { id: 'space', name: 'Espacio', icon: 'Rocket', color: 'text-indigo-400', description: 'Planetas, física y el universo.' },
  { id: 'food', name: 'Gastronomía', icon: 'Utensils', color: 'text-orange-400', description: 'Sabores, platos e ingredientes.' },
  { id: 'sports', name: 'Deportes', icon: 'Trophy', color: 'text-yellow-400', description: 'Reglas, atletas y torneos.' },
  { id: 'ocean', name: 'Océano', icon: 'Waves', color: 'text-cyan-400', description: 'Biología marina y geografía.' },
  { id: 'economy', name: 'Economía', icon: 'TrendingUp', color: 'text-green-400', description: 'Finanzas, mercados y monedas.' },
  { id: 'mythology', name: 'Mitología', icon: 'Library', color: 'text-amber-200', description: 'Dioses, héroes y leyendas.' },
  { id: 'medieval', name: 'Historia', icon: 'Crown', color: 'text-rose-400', description: 'Imperios, guerras y reyes.' },
  { id: 'celebs', name: 'Famosos', icon: 'Star', color: 'text-pink-400', description: 'Cine, música y celebridades.' },

  // --- HARDCORE MODULES (PREMIUM ONLY) ---
  { id: 'quantum', name: 'Física Cuántica', icon: 'Atom', color: 'text-violet-500', description: 'Mecánica cuántica y partículas.', isHardcore: true },
  { id: 'neuro', name: 'Neurociencia', icon: 'Brain', color: 'text-pink-600', description: 'Sinapsis, cerebro y nervios.', isHardcore: true },
  { id: 'crypto', name: 'Criptografía', icon: 'Lock', color: 'text-gray-400', description: 'Algoritmos, hash y seguridad.', isHardcore: true },
  { id: 'adv_math', name: 'Matemáticas', icon: 'Sigma', color: 'text-blue-600', description: 'Cálculo, álgebra y teoremas.', isHardcore: true },
  { id: 'philosophy', name: 'Filosofía Hard', icon: 'Scroll', color: 'text-amber-600', description: 'Ontología, ética y lógica pura.', isHardcore: true },
  { id: 'astrophys', name: 'Astrofísica', icon: 'Rocket', color: 'text-indigo-600', description: 'Agujeros negros y relatividad.', isHardcore: true },
  { id: 'bio_chem', name: 'Bioquímica', icon: 'FlaskConical', color: 'text-green-600', description: 'Enzimas, ADN y metabolismo.', isHardcore: true },
  { id: 'art_hist', name: 'Historia Arte', icon: 'Palette', color: 'text-rose-600', description: 'Movimientos oscuros y técnica.', isHardcore: true },
];

export const MOCK_QUESTIONS = [
  {
    id: 'm1',
    text: '¿Cuál es el planeta más grande del sistema solar?',
    options: ['Tierra', 'Marte', 'Júpiter', 'Saturno'],
    correctIndex: 2
  }
];