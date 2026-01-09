import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, PAYPAL_CLIENT_ID } from './services/firebase';

import { THEMES, QUESTIONS_PER_LEVEL, TIME_PER_QUESTION, MAX_LIVES, TOTAL_LEVELS } from './constants';
import { ViewState, GameProgress, GameSession, Question, UserProfile, UserStats, ChatMessage } from './types';
import { generateQuestions } from './services/geminiService';
import { GetIcon } from './components/Icons';
import { AdBanner } from './components/AdBanner';

// -- Initial States --
const INITIAL_STATS: UserStats = {
  totalScore: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  totalWrong: 0,
  totalTimePlayedSeconds: 0,
  gamesPlayed: 0,
  highestIQ: 80
};

const GUEST_PROFILE: UserProfile = {
  name: "Jugador Invitado",
  isPremium: false,
  avatarId: 1
};

// --- ISOLATED PAYPAL COMPONENT ---
const PayPalWrapper = React.memo(({ type, onSuccess }: { type: 'premium' | 'donation', onSuccess: (details: any) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const container = containerRef.current;

    const loadAndRender = async () => {
      try {
        if (!(window as any).paypal) {
           const existingScript = document.getElementById('paypal-sdk-script');
           if (!existingScript) {
              await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.id = 'paypal-sdk-script';
                script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons`;
                script.async = true;
                script.onload = resolve;
                script.onerror = () => reject(new Error("PayPal SDK Load Failed"));
                document.body.appendChild(script);
              });
           } else {
              if (!(window as any).paypal) {
                 await new Promise(resolve => existingScript.addEventListener('load', resolve));
              }
           }
        }

        if (!isMounted || !container) return;
        container.innerHTML = '';
        const pp = (window as any).paypal;
        if (!pp) throw new Error("PayPal object missing");

        const styleConfig = type === 'donation' 
          ? { layout: "horizontal", color: "blue", label: "donate", height: 40, tagline: false }
          : { layout: "horizontal", color: "gold", label: "pay", height: 40, tagline: false };

        await pp.Buttons({
          style: styleConfig,
          fundingSource: type === 'donation' ? pp.FUNDING.PAYPAL : undefined,
          createOrder: (data: any, actions: any) => {
             return actions.order.create({
                 intent: "CAPTURE",
                 purchase_units: [{
                     amount: { currency_code: "USD", value: type === 'premium' ? "5.00" : "3.00" },
                     description: type === 'premium' ? "NeonQuiz Premium" : "NeonQuiz Donation"
                 }]
             });
          },
          onApprove: (data: any, actions: any) => {
             return actions.order.capture().then((details: any) => {
                if(isMounted) onSuccess(details);
             });
          },
          onError: (err: any) => {
            console.error("PayPal Widget Error (See network tab for details)");
          }
        }).render(container);

      } catch (e: any) {
        if (isMounted) {
          console.warn("PayPal Load Error:", e.message);
          setError("No se pudo cargar PayPal.");
        }
      }
    };

    const timer = setTimeout(loadAndRender, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (container) container.innerHTML = '';
    };
  }, [type, onSuccess]);

  if (error) return <div className="text-red-500 text-xs p-2 bg-red-900/20 rounded border border-red-500/50">{error}</div>;
  return <div ref={containerRef} className="min-h-[50px] w-full relative z-0" />;
});

// --- INTERSTITIAL AD COMPONENT ---
const InterstitialAd = ({ onClose }: { onClose: () => void }) => {
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const t = setInterval(() => {
      setTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-fade-in ads-container">
      <div className="absolute top-4 right-4 bg-gray-800 px-4 py-2 rounded-full text-xs font-mono text-gray-400 border border-gray-700">
        Publicidad
      </div>
      
      <div className="w-full max-w-sm aspect-[9/16] bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl relative overflow-hidden flex flex-col items-center justify-center p-8 shadow-2xl">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <GetIcon name="Zap" className="w-20 h-20 text-yellow-400 mb-6 animate-bounce" />
         <h2 className="text-2xl font-bold text-white mb-2 text-center">¡Sube de Nivel!</h2>
         <p className="text-gray-400 text-center mb-8">Desbloquea funciones exclusivas con la versión Premium.</p>
         <div className="w-full bg-blue-600 h-12 rounded-lg flex items-center justify-center font-bold animate-pulse cursor-pointer">
            INSTALAR AHORA
         </div>
      </div>

      <div className="mt-8">
        {timer > 0 ? (
          <div className="text-gray-500 font-mono text-sm">Cerrar en {timer}s</div>
        ) : (
          <button 
            onClick={onClose}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
          >
            CERRAR ANUNCIO X
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // -- View State --
  const [view, setView] = useState<ViewState>('LOGIN');
  const [showChat, setShowChat] = useState(false);
  
  // -- Ad State --
  const [showInterstitial, setShowInterstitial] = useState(false);

  // -- Data State --
  const [user, setUser] = useState<UserProfile>(GUEST_PROFILE);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [progress, setProgress] = useState<GameProgress>({});
  
  // -- Loading States --
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [userDataLoading, setUserDataLoading] = useState(true);
  
  // -- Auth Forms --
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // -- Game Session --
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);

  // -- Chat State --
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  const timerRef = useRef<number | null>(null);
  const sessionStartTime = useRef<number>(0);

  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUserDataLoading(true);
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              uid: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || "Usuario",
              email: firebaseUser.email || "",
              isPremium: data.isPremium || false,
              avatarId: data.avatarId || 1
            });
            setStats({ ...INITIAL_STATS, ...(data.stats || {}) });
            setProgress(data.progress || {});
            setView((currentView) => (currentView === 'LOGIN' || currentView === 'REGISTER') ? 'HOME' : currentView);
          } else {
            const newUser = {
              name: firebaseUser.displayName || "Usuario",
              email: firebaseUser.email,
              isPremium: false,
              avatarId: 1,
              stats: INITIAL_STATS,
              progress: {},
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newUser);
            setUser({ uid: firebaseUser.uid, ...newUser });
            setView('HOME');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        setUser(GUEST_PROFILE);
        setUserDataLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: ChatMessage[] = [];
      snapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as ChatMessage);
      });
      setChatMessages(msgs.reverse());
    });
    return () => unsubscribe();
  }, []);

  // --- ACTIONS ---
  const handlePaymentSuccess = useCallback(async (details: any) => {
    if (!user.uid) return;
    setLoading(true);
    setLoadingMsg("Activando Premium...");
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { isPremium: true });
      setUser(prev => ({ ...prev, isPremium: true }));
      alert(`¡Éxito! Bienvenido al club Premium, ${details.payer.name.given_name || 'Jugador'}.`);
    } catch (e) {
      console.error("Error updating premium status", e);
      alert("Error guardando premium. Contacta soporte.");
    } finally {
      setLoading(false);
    }
  }, [user.uid]);

  const handleDonationSuccess = useCallback(async (details: any) => {
     const name = details?.payer?.name?.given_name || "Amigo";
     alert(`¡Gracias por tu donación, ${name}!`);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail, authPass);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, authPass);
      await updateProfile(cred.user, { displayName: authName });
      await setDoc(doc(db, "users", cred.user.uid), {
        name: authName,
        email: authEmail,
        isPremium: false,
        avatarId: Math.floor(Math.random() * 5) + 1,
        stats: INITIAL_STATS,
        progress: {},
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setUser(GUEST_PROFILE);
    setStats(INITIAL_STATS);
    setProgress({});
    setView('HOME');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(GUEST_PROFILE);
    setView('LOGIN');
  };

  const saveProgressToFirebase = async (newProgress?: GameProgress, newStats?: UserStats) => {
    if (!user.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const payload: any = {};
      if (newProgress) payload.progress = newProgress;
      if (newStats) payload.stats = newStats;
      if (Object.keys(payload).length > 0) {
        await updateDoc(userRef, payload);
      }
    } catch (e) {
      console.error("Error saving progress", e);
    }
  };

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !user.uid) return;
    try {
      await addDoc(collection(db, "chat"), {
        uid: user.uid,
        name: user.name,
        text: chatInput,
        isPremium: user.isPremium,
        avatarId: user.avatarId,
        createdAt: serverTimestamp()
      });
      setChatInput('');
    } catch (e) {
      console.error(e);
    }
  };

  // --- GAME LOGIC ---
  useEffect(() => {
    if (view === 'GAME' && session && !session.isPaused && session.lives > 0 && !isAdPlaying && !showInterstitial) {
      timerRef.current = window.setInterval(() => {
        setSession(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 0) {
             handleAnswer(-1); // Timeout
             return prev;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [view, session?.isPaused, session?.currentQuestionIndex, isAdPlaying, showInterstitial]);

  const startGame = async (themeId: string, level: number) => {
    setLoading(true);
    setLoadingMsg("Generando desafío...");
    try {
      const questions = await generateQuestions(themeId, level);
      setSession({
        themeId,
        level,
        score: 0,
        correctCount: 0,
        questions,
        currentQuestionIndex: 0,
        lives: MAX_LIVES,
        timeLeft: TIME_PER_QUESTION,
        isPaused: false
      });
      sessionStartTime.current = Date.now();
      setView('GAME');
    } catch (e) {
      console.error(e);
      alert("Error iniciando el juego.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for closing Interstitial Ad
  const handleCloseInterstitial = () => {
    setShowInterstitial(false);
    setView('RESULT');
  };

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (!session) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = session.questions[session.currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correctIndex;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      setSession(prev => {
        if (!prev) return null;
        
        let newScore = prev.score;
        let newLives = prev.lives;
        let newCorrect = prev.correctCount;
        
        if (isCorrect) {
          const bonus = Math.ceil(100 * (prev.timeLeft / TIME_PER_QUESTION));
          newScore += (50 + bonus);
          newCorrect++;
        } else {
          if (!user.isPremium) {
            newLives--;
          }
        }

        // Logic for Game Over or Level Complete
        const isGameOver = newLives === 0;
        const isLevelComplete = prev.currentQuestionIndex >= prev.questions.length - 1;

        if (isGameOver) {
           updateStatsLocally(prev, false);
           
           // Interstitial Trigger for Non-Premium
           if (!user.isPremium) {
             setShowInterstitial(true);
           } else {
             setTimeout(() => setView('RESULT'), 100);
           }
           
           return { ...prev, lives: 0 };
        }

        if (isLevelComplete) {
          updateStatsLocally({ ...prev, score: newScore, correctCount: newCorrect }, true); 
          setTimeout(() => handleLevelComplete(prev.themeId, prev.level), 100);
          
          // Interstitial Trigger for Non-Premium
          if (!user.isPremium) {
            setShowInterstitial(true);
          } else {
            setTimeout(() => setView('RESULT'), 100);
          }

          return { ...prev, score: newScore, correctCount: newCorrect };
        }

        // Next Question
        return {
          ...prev,
          score: newScore,
          lives: newLives,
          correctCount: newCorrect,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeLeft: TIME_PER_QUESTION
        };
      });
    }, 1000);
  }, [session, user.isPremium]);

  const updateStatsLocally = (sessionData: GameSession, didWin: boolean) => {
    const timeSpent = Math.floor((Date.now() - (sessionStartTime.current || 0)) / 1000);
    setStats(prev => {
      const prevTotalScore = Number(prev.totalScore || 0);
      const prevTotalQuestions = Number(prev.totalQuestionsAnswered || 0);
      const prevTotalCorrect = Number(prev.totalCorrect || 0);
      const prevTotalWrong = Number(prev.totalWrong || 0);
      const prevTotalTime = Number(prev.totalTimePlayedSeconds || 0);
      const prevGamesPlayed = Number(prev.gamesPlayed || 0);
      const maxLives = Number(MAX_LIVES);
      const sessionLives = Number(sessionData.lives || 0);
      const questionsInSession = didWin ? QUESTIONS_PER_LEVEL : (sessionData.currentQuestionIndex + 1);

      const newStats: UserStats = {
        totalScore: prevTotalScore + Number(sessionData.score),
        totalQuestionsAnswered: prevTotalQuestions + questionsInSession,
        totalCorrect: prevTotalCorrect + Number(sessionData.correctCount),
        totalWrong: prevTotalWrong + (maxLives - sessionLives),
        totalTimePlayedSeconds: prevTotalTime + timeSpent,
        gamesPlayed: prevGamesPlayed + 1,
        highestIQ: prev.highestIQ || 80
      };
      
      const safeTotalQuestions = newStats.totalQuestionsAnswered > 0 ? newStats.totalQuestionsAnswered : 1;
      const acc = newStats.totalCorrect / safeTotalQuestions;
      const levelsSum: number = (Object.values(progress) as number[]).reduce((a: number, b: number) => a + Number(b), 0);
      newStats.highestIQ = Math.round(80 + (acc * 60) + (levelsSum * 1.5));
      
      saveProgressToFirebase(undefined, newStats);
      return newStats;
    });
  };

  const handleLevelComplete = (themeId: string, level: number) => {
    const newProgress = { ...progress };
    const currentUnlocked = newProgress[themeId] || 1;
    if (level === currentUnlocked && level < TOTAL_LEVELS) {
      newProgress[themeId] = level + 1;
      setProgress(newProgress);
      saveProgressToFirebase(newProgress);
    }
  };

  // --- RENDERERS ---

  const renderAuth = (isRegister: boolean) => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20 animate-pulse"></div>
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <h1 className="text-4xl font-black text-center mb-2 neon-text-blue">NEON QUIZ</h1>
        <p className="text-center text-gray-400 mb-8 uppercase tracking-widest text-xs">Login de Acceso</p>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs uppercase text-cyan-400 font-bold">Nombre de Usuario</label>
              <input type="text" className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 outline-none" placeholder="Ej. CyberMaster" value={authName} onChange={e => setAuthName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs uppercase text-cyan-400 font-bold">Email</label>
            <input type="email" className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 outline-none" placeholder="nombre@email.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase text-cyan-400 font-bold">Contraseña</label>
            <input type="password" className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-cyan-400 outline-none" placeholder="••••••••" value={authPass} onChange={e => setAuthPass(e.target.value)} required />
          </div>
          {authError && <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{authError}</div>}
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.5)] mt-4">
            {isRegister ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
          </button>
        </form>
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-700 flex-1"></div>
          <span className="text-gray-500 text-xs uppercase">O</span>
          <div className="h-px bg-gray-700 flex-1"></div>
        </div>
        <button onClick={handleGuestLogin} className="w-full bg-transparent border border-gray-600 hover:border-white text-gray-300 hover:text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
          <GetIcon name="Gamepad2" className="w-5 h-5" />
          JUGAR COMO INVITADO
        </button>
        <div className="mt-6 text-center">
          <button onClick={() => setView(isRegister ? 'LOGIN' : 'REGISTER')} className="text-gray-400 hover:text-white text-sm underline decoration-cyan-500 decoration-2 underline-offset-4">
            {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿Nuevo usuario? Regístrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className={`flex flex-col h-full p-4 space-y-8 animate-fade-in relative ${user.isPremium ? 'bg-gradient-to-b from-black via-gray-900 to-yellow-900/10' : ''}`}>
      <div className="w-full flex justify-end gap-3 z-10">
        {user.isPremium && <GetIcon name="Gem" className="w-6 h-6 text-yellow-400 animate-pulse" />}
        {user.uid && (
          <button onClick={() => setShowChat(true)} className="p-2 bg-gray-800/50 rounded-full border border-gray-700 text-green-400 hover:bg-gray-700 transition-all relative">
            <GetIcon name="MessageCircle" className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          </button>
        )}
        <button onClick={() => setView('PROFILE')} className={`p-2 bg-gray-800/50 rounded-full border ${user.isPremium ? 'border-yellow-400 text-yellow-400' : 'border-gray-700 text-cyan-400'} hover:bg-gray-700 transition-all`}>
          <GetIcon name="User" className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text pb-2 ${user.isPremium ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 neon-text-gold' : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 neon-text-blue'}`}>
            NEON QUIZ
          </h1>
          <p className="text-gray-400 tracking-widest text-sm uppercase">
            {user.isPremium ? 'EDICIÓN PREMIUM' : 'Demuestra lo que sabes'}
          </p>
        </div>
        <button onClick={() => setView('THEME_SELECT')} className={`group relative px-10 py-5 bg-transparent border-2 font-bold text-xl uppercase tracking-wider overflow-hidden hover:text-black transition-colors duration-300 rounded-lg ${user.isPremium ? 'border-yellow-400 text-yellow-400' : 'border-cyan-400 text-cyan-400'}`}>
          <span className={`absolute inset-0 w-full h-full translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 ${user.isPremium ? 'bg-yellow-400' : 'bg-cyan-400'}`}></span>
          <span className="relative z-10 flex items-center gap-2">
            <GetIcon name="Play" /> Jugar Ahora
          </span>
        </button>
        <div className="flex gap-8 mt-8 text-gray-500 text-xs font-mono">
           <div className="flex flex-col items-center"><GetIcon name="Brain" className="w-4 h-4 mb-1 text-purple-400" /><span>IQ: {stats?.highestIQ || 80}</span></div>
           <div className="flex flex-col items-center"><GetIcon name="Trophy" className="w-4 h-4 mb-1 text-yellow-400" /><span>Puntos: {stats?.totalScore || 0}</span></div>
        </div>
        {!user.isPremium && (
          <div className="glass-panel p-4 rounded-lg flex items-center gap-4 max-w-sm border border-yellow-500/30 animate-pulse">
             <GetIcon name="Gem" className="text-yellow-400 w-8 h-8" />
             <div className="text-left">
               <div className="text-yellow-400 font-bold text-sm">¡Desbloquea HardCore!</div>
               <div className="text-xs text-gray-400">8 Módulos extremos + Chat Dorado + Sin Anuncios</div>
             </div>
             <button onClick={() => setView('PROFILE')} className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded hover:bg-yellow-400">VER</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => {
    if (userDataLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
           <GetIcon name="RefreshCw" className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
           <p className="text-cyan-400 font-mono animate-pulse">Cargando perfil...</p>
        </div>
      );
    }
    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 animate-fade-in pb-32">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button onClick={() => setView('HOME')} className="p-2 hover:bg-white/10 rounded-full"><GetIcon name="ArrowLeft" /></button>
             <h2 className="text-2xl font-bold neon-font">Mi Perfil</h2>
          </div>
          <button onClick={handleLogout} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300"><GetIcon name="LogOut" className="w-4 h-4" /> Salir</button>
        </div>
        <div className={`glass-panel p-6 rounded-2xl mb-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden ${user.isPremium ? 'premium-border' : ''}`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 shadow-xl z-10 ${user.isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-600 border-yellow-200 text-white' : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-gray-800'}`}>
             {user.isPremium ? <GetIcon name="Gem" /> : user.avatarId}
          </div>
          <div className="text-center md:text-left z-10">
             <h3 className="text-2xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
               {user.name}
               {user.isPremium && <GetIcon name="CheckCircle" className="w-5 h-5 text-blue-400 bg-white rounded-full" />}
             </h3>
             <p className="text-gray-400 text-sm mb-2">{user.email || 'Cuenta de Invitado'}</p>
             <div className="flex gap-2 justify-center md:justify-start">
               <span className={`text-xs px-2 py-0.5 rounded border ${user.isPremium ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400' : 'bg-gray-800 text-gray-400 border-gray-600'}`}>
                  {user.isPremium ? 'MIEMBRO PREMIUM' : 'MIEMBRO GRATUITO'}
               </span>
             </div>
          </div>
          {user.isPremium && <div className="absolute inset-0 bg-yellow-400/5 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-50 pointer-events-none"></div>}
        </div>
        {user.uid ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
             {!user.isPremium && (
               <div className="glass-panel p-6 rounded-xl border border-yellow-500/50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMENDADO</div>
                 <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2"><GetIcon name="Gem" /> Pasarse a PREMIUM</h3>
                 <ul className="text-sm text-gray-300 space-y-2 mb-4">
                   <li className="flex gap-2"><GetIcon name="CheckCircle" className="w-4 h-4 text-green-400" /> Sin Anuncios molestos</li>
                   <li className="flex gap-2"><GetIcon name="CheckCircle" className="w-4 h-4 text-green-400" /> Vidas Infinitas en el juego</li>
                   <li className="flex gap-2"><GetIcon name="CheckCircle" className="w-4 h-4 text-green-400" /> +8 Módulos HardCore 😈</li>
                   <li className="flex gap-2"><GetIcon name="CheckCircle" className="w-4 h-4 text-green-400" /> Chat Dorado Distintivo</li>
                 </ul>
                 <PayPalWrapper type="premium" onSuccess={handlePaymentSuccess} />
               </div>
             )}
             <div className="glass-panel p-6 rounded-xl border border-gray-700">
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><GetIcon name="Heart" className="text-red-500" /> Donar al Desarrollador</h3>
               <p className="text-sm text-gray-400 mb-4">Ayuda a mantener los servidores y crear más preguntas.</p>
               <PayPalWrapper type="donation" onSuccess={handleDonationSuccess} />
             </div>
          </div>
        ) : (
          <div className="glass-panel p-6 rounded-xl border border-gray-700 mb-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Modo Invitado</h3>
            <p className="text-sm text-gray-400 mb-4">Regístrate para guardar tu progreso, chatear y comprar Premium.</p>
            <button onClick={handleLogout} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all">CREAR CUENTA AHORA</button>
          </div>
        )}
        <h3 className="text-xl font-bold mb-4 neon-font">Estadísticas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-800"><div className="text-2xl font-bold text-purple-400">{stats?.highestIQ || 80}</div><div className="text-xs text-gray-500 uppercase">IQ</div></div>
           <div className="bg-gray-900/50 p-4 rounded-xl text-center border border-gray-800"><div className="text-2xl font-bold text-yellow-400">{stats?.totalScore || 0}</div><div className="text-xs text-gray-500 uppercase">Puntos</div></div>
        </div>
      </div>
    );
  };

  const renderThemeSelect = () => (
    <div className="flex flex-col h-full p-4 animate-fade-in">
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <button onClick={() => setView('HOME')} className="p-2 hover:bg-white/10 rounded-full"><GetIcon name="ArrowLeft" /></button>
        <h2 className="text-2xl font-bold neon-font">Selecciona un Módulo</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
          {THEMES.map(theme => {
            const isLocked = theme.isHardcore && !user.isPremium;
            return (
              <button 
                key={theme.id}
                onClick={() => {
                  if (isLocked) {
                    alert("Este módulo es exclusivo para usuarios Premium. ¡Mejora tu cuenta para acceder!");
                    return;
                  }
                  setSelectedThemeId(theme.id);
                  setView('LEVEL_SELECT');
                }}
                className={`glass-panel p-4 rounded-xl text-left transition-all border relative overflow-hidden group ${isLocked ? 'opacity-50 grayscale border-gray-700' : 'hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ' + (theme.isHardcore ? 'border-purple-500/50' : 'border-gray-700')}`}
              >
                <div className="flex justify-between items-start mb-2">
                   <GetIcon name={theme.icon} className={`w-8 h-8 ${theme.color}`} />
                   {isLocked && <GetIcon name="Lock" className="w-4 h-4 text-gray-400" />}
                   {theme.isHardcore && !isLocked && <GetIcon name="Gem" className="w-4 h-4 text-yellow-400" />}
                </div>
                <h3 className={`font-bold text-lg leading-tight mb-1 ${theme.color}`}>{theme.name}</h3>
                <p className="text-xs text-gray-400">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLevelSelect = () => {
    const theme = THEMES.find(t => t.id === selectedThemeId);
    if (!theme) return null;
    const unlockedLevel = progress[theme.id] || 1;
    return (
      <div className="flex flex-col h-full p-6 animate-fade-in">
        <div className="flex items-center gap-4 mb-8 flex-shrink-0">
           <button onClick={() => setView('THEME_SELECT')} className="p-2 hover:bg-white/10 rounded-full"><GetIcon name="ArrowLeft" /></button>
           <div>
             <h2 className={`text-2xl font-bold ${theme.color}`}>{theme.name}</h2>
             <p className="text-sm text-gray-400">Selecciona Nivel de Dificultad</p>
           </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-2 pb-24">
          <div className="grid grid-cols-1 gap-4 max-w-md mx-auto w-full pb-10">
             {Array.from({ length: TOTAL_LEVELS }).map((_, i) => {
               const level = i + 1;
               const isLocked = level > unlockedLevel;
               return (
                 <button key={level} disabled={isLocked} onClick={() => startGame(theme.id, level)} className={`flex items-center justify-between p-5 rounded-xl border transition-all ${isLocked ? 'bg-gray-900/50 border-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700 hover:border-cyan-400 text-white'}`}>
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isLocked ? 'bg-gray-800' : 'bg-cyan-900 text-cyan-400'}`}>{level}</div>
                     <div className="text-left"><div className="font-bold">NIVEL {level}</div><div className="text-xs text-gray-400">{isLocked ? 'Bloqueado' : 'Disponible'}</div></div>
                   </div>
                   {isLocked ? <GetIcon name="Lock" className="w-5 h-5" /> : <GetIcon name="Play" className="w-5 h-5 text-cyan-400" />}
                 </button>
               );
             })}
          </div>
        </div>
      </div>
    );
  };

  const renderGame = () => {
    if (!session) return null;
    const currentQ = session.questions[session.currentQuestionIndex];
    const progressPercent = ((session.currentQuestionIndex) / session.questions.length) * 100;
    
    return (
      <div className="flex flex-col h-full relative overflow-hidden">
        <div className="flex-shrink-0 p-4 flex justify-between items-center bg-black/40 backdrop-blur-sm border-b border-white/10">
           <div className="flex items-center gap-2">
             <div className="bg-red-500/20 p-2 rounded text-red-400 font-mono font-bold flex items-center gap-2">
               <GetIcon name="Heart" className="w-4 h-4 fill-current" /> {user.isPremium ? '∞' : session.lives}
             </div>
             <div className="bg-yellow-500/20 p-2 rounded text-yellow-400 font-mono font-bold flex items-center gap-2">
               <GetIcon name="Trophy" className="w-4 h-4" /> {session.score}
             </div>
           </div>
           <div className={`relative w-12 h-12 flex items-center justify-center rounded-full border-4 font-bold text-lg ${session.timeLeft <= 5 ? 'border-red-500 text-red-500 animate-pulse' : 'border-cyan-500 text-cyan-500'}`}>
              {session.timeLeft}
           </div>
        </div>
        <div className="flex-shrink-0 h-1 bg-gray-800 w-full">
          <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center p-6 pb-24 max-w-3xl mx-auto w-full">
             <div className="text-center mb-8">
               <span className="text-xs font-mono text-cyan-400 tracking-widest mb-2 block">PREGUNTA {session.currentQuestionIndex + 1} / {session.questions.length}</span>
               <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">{currentQ.text}</h2>
             </div>
             <div className="grid grid-cols-1 gap-3 pb-8">
               {currentQ.options.map((opt, idx) => {
                 let btnClass = "p-4 rounded-xl border-2 text-lg font-medium transition-all transform hover:scale-[1.02] active:scale-95 text-left relative overflow-hidden ";
                 if (feedback) {
                    if (idx === currentQ.correctIndex) {
                      btnClass += "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                    } else {
                      btnClass += "bg-gray-800 border-gray-700 opacity-50";
                    }
                 } else {
                    btnClass += "bg-gray-800/50 border-gray-600 hover:border-cyan-400 hover:bg-gray-700";
                 }
                 return (
                   <button key={idx} disabled={feedback !== null} onClick={() => handleAnswer(idx)} className={btnClass}>
                     <span className="opacity-50 mr-3 font-mono">{String.fromCharCode(65 + idx)}.</span>
                     {opt}
                     {feedback && idx === currentQ.correctIndex && <GetIcon name="CheckCircle" className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-6 h-6" />}
                     {feedback === 'wrong' && idx !== currentQ.correctIndex && feedback && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 font-bold"></span>}
                   </button>
                 );
               })}
             </div>
          </div>
        </div>
        <div className="flex-shrink-0 p-4 text-center text-gray-500 text-xs uppercase tracking-widest bg-black/50">
           {session.themeId.toUpperCase()} • NIVEL {session.level}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    if (!session) return null;
    const isWin = session.lives > 0 && session.currentQuestionIndex >= session.questions.length - 1;
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in relative overflow-hidden pb-20">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center border border-white/10 relative z-10">
          <GetIcon name={isWin ? "Trophy" : "X"} className={`w-20 h-20 mx-auto mb-6 ${isWin ? 'text-yellow-400 animate-bounce' : 'text-red-500'}`} />
          <h2 className={`text-4xl font-black mb-2 ${isWin ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500' : 'text-white'}`}>{isWin ? '¡NIVEL COMPLETADO!' : 'GAME OVER'}</h2>
          <p className="text-gray-400 mb-8">{isWin ? 'Has dominado este tema.' : 'Te quedaste sin vidas. ¡Inténtalo de nuevo!'}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-black/40 p-3 rounded-lg"><div className="text-xs text-gray-500 uppercase">Puntuación</div><div className="text-2xl font-bold text-yellow-400">{session.score}</div></div>
             <div className="bg-black/40 p-3 rounded-lg"><div className="text-xs text-gray-500 uppercase">Aciertos</div><div className="text-2xl font-bold text-green-400">{session.correctCount}/{session.questions.length}</div></div>
          </div>
          <div className="space-y-3">
             {isWin && (
               <button 
                 onClick={() => {
                    const theme = THEMES.find(t => t.id === session.themeId);
                    const nextLevel = session.level + 1;
                    if (nextLevel <= TOTAL_LEVELS) {
                      startGame(session.themeId, nextLevel);
                    } else {
                      setView('THEME_SELECT');
                    }
                 }}
                 className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
               >
                 <GetIcon name="Play" className="w-5 h-5" /> SIGUIENTE NIVEL
               </button>
             )}
             <button onClick={() => startGame(session.themeId, session.level)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><GetIcon name="RefreshCw" className="w-5 h-5" /> REINTENTAR</button>
             <button onClick={() => setView('HOME')} className="w-full bg-transparent border border-gray-600 text-gray-400 hover:text-white font-bold py-3 rounded-lg">VOLVER AL MENÚ</button>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-md h-[80vh] rounded-2xl flex flex-col shadow-2xl relative overflow-hidden">
        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
           <h3 className="font-bold flex items-center gap-2"><GetIcon name="MessageCircle" className="text-green-400" /> Chat Global</h3>
           <button onClick={() => setShowChat(false)} className="p-1 hover:bg-gray-700 rounded-full"><GetIcon name="X" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
          {chatMessages.length === 0 && <div className="text-center text-gray-500 mt-10">Sé el primero en escribir...</div>}
          {chatMessages.map(msg => {
            const isMe = msg.uid === user.uid;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.isPremium ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>{msg.isPremium ? <GetIcon name="Gem" className="w-3 h-3" /> : msg.avatarId}</div>
                 <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${isMe ? 'bg-cyan-900/50 text-white rounded-tr-none' : 'bg-gray-800 text-gray-200 rounded-tl-none'}`}>
                    <div className="flex items-center gap-2 mb-1"><span className={`font-bold text-xs ${msg.isPremium ? 'text-yellow-400' : 'text-gray-400'}`}>{msg.name}</span>{msg.isPremium && <GetIcon name="CheckCircle" className="w-3 h-3 text-blue-400" />}</div>
                    {msg.text}
                 </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={sendChatMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
           <input type="text" className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-sm focus:border-cyan-400 outline-none text-white" placeholder="Escribe un mensaje..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
           <button type="submit" disabled={!chatInput.trim()} className="p-2 bg-cyan-600 rounded-full hover:bg-cyan-500 disabled:opacity-50"><GetIcon name="Send" className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );

  return (
      <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden">
        {!user.isPremium && view !== 'LOGIN' && view !== 'REGISTER' && (
          <>
            <AdBanner position="top" />
            <div className="ads-container flex justify-center py-1 opacity-50 min-h-[10px]"></div>
          </>
        )}
        <main className="flex-1 relative overflow-y-auto scrollbar-hide flex flex-col">
          {loading && (
            <div className="absolute inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center p-4">
              <GetIcon name="RefreshCw" className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-400 font-mono animate-pulse">{loadingMsg || "Cargando..."}</p>
            </div>
          )}
          {view === 'LOGIN' && renderAuth(false)}
          {view === 'REGISTER' && renderAuth(true)}
          {view === 'HOME' && renderHome()}
          {view === 'PROFILE' && renderProfile()}
          {view === 'THEME_SELECT' && renderThemeSelect()}
          {view === 'LEVEL_SELECT' && renderLevelSelect()}
          {view === 'GAME' && renderGame()}
          {view === 'RESULT' && renderResult()}
          {showChat && renderChat()}
          {showInterstitial && <InterstitialAd onClose={handleCloseInterstitial} />}
        </main>
        {!user.isPremium && view !== 'LOGIN' && view !== 'REGISTER' && (
          <>
            <div className="ads-container flex justify-center py-1 opacity-50 min-h-[10px]"></div>
            <AdBanner position="bottom" />
          </>
        )}
      </div>
  );
}