
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BallType, DrawnNumber } from './types';
import { SeededRNG } from './utils/rng';
import { analyzeNumbers } from './services/geminiService';
import Ball from './components/Ball';

const WHITE_BALL_COUNT = 5;
const MAX_WHITE = 69;
const MAX_POWERBALL = 26;

const App: React.FC = () => {
  const [numbers, setNumbers] = useState<DrawnNumber[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const historyRef = useRef<DrawnNumber[][]>([]);

  const handleDraw = useCallback(() => {
    if (numbers.length >= WHITE_BALL_COUNT + 1) return;

    setIsDrawing(true);
    const clickTime = Date.now(); // Milliseconds timestamp for seeding
    const rng = new SeededRNG(clickTime);

    setNumbers(prev => {
      let newValue: number;

      if (prev.length < WHITE_BALL_COUNT) {
        // Drawing a white ball (1-69)
        const allWhiteNumbers = Array.from({ length: MAX_WHITE }, (_, i) => i + 1);
        const drawnWhiteValues = prev
          .filter(n => n.type === BallType.WHITE)
          .map(n => n.value);
        const availablePool = allWhiteNumbers.filter(num => !drawnWhiteValues.includes(num));
        
        const randomIndex = rng.nextInt(0, availablePool.length - 1);
        newValue = availablePool[randomIndex];
        
        return [...prev, { value: newValue, type: BallType.WHITE, timestamp: clickTime }];
      } else {
        // Drawing the Powerball (1-26)
        const allPowerballNumbers = Array.from({ length: MAX_POWERBALL }, (_, i) => i + 1);
        const randomIndex = rng.nextInt(0, allPowerballNumbers.length - 1);
        newValue = allPowerballNumbers[randomIndex];
        
        return [...prev, { value: newValue, type: BallType.POWERBALL, timestamp: clickTime }];
      }
    });

    setTimeout(() => setIsDrawing(false), 200);
  }, [numbers]);

  const reset = () => {
    if (numbers.length === WHITE_BALL_COUNT + 1) {
      historyRef.current = [numbers, ...historyRef.current].slice(0, 5);
    }
    setNumbers([]);
    setAnalysis(null);
  };

  useEffect(() => {
    if (numbers.length === WHITE_BALL_COUNT + 1) {
      const getAnalysis = async () => {
        setLoadingAnalysis(true);
        const result = await analyzeNumbers(numbers);
        setAnalysis(result);
        setLoadingAnalysis(false);
      };
      getAnalysis();
    }
  }, [numbers]);

  const isComplete = numbers.length === WHITE_BALL_COUNT + 1;

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-950 via-purple-950/10 to-black">
      {/* Header */}
      <header className="text-center mt-6 md:mt-12">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-600 mb-2">
          POWERBALL DESTINY
        </h1>
        <p className="text-slate-400 text-sm md:text-lg font-light italic tracking-wide">
          Guidance from the Purple Star Astrology
        </p>
      </header>

      {/* Main Stage */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl">
        {/* Ball Container - Moved lower with larger margin top */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 mt-16 md:mt-24">
          {numbers.map((ball, idx) => (
            <Ball key={`${idx}-${ball.value}`} value={ball.value} type={ball.type} />
          ))}
          {Array.from({ length: (WHITE_BALL_COUNT + 1) - numbers.length }).map((_, idx) => (
            <div 
              key={`placeholder-${idx}`}
              className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-dashed border-purple-900/50 flex items-center justify-center opacity-30 shadow-inner"
            >
              <i className="fa-solid fa-star text-purple-500/50 text-xl"></i>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col items-center gap-8">
          {!isComplete ? (
            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className={`
                group relative px-14 py-6 rounded-full font-bold text-xl md:text-2xl transition-all duration-300
                ${isDrawing 
                  ? 'bg-purple-900 scale-95 opacity-80' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] active:scale-95'}
                text-white shadow-xl
              `}
            >
              <span className="flex items-center gap-4">
                {numbers.length < WHITE_BALL_COUNT ? 'Draw White Ball' : 'Draw Powerball'}
                <i className={`fa-solid fa-sparkles ${isDrawing ? 'animate-pulse' : ''}`}></i>
              </span>
              <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ) : (
            <button
              onClick={reset}
              className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-medium transition-all flex items-center gap-3 border border-purple-500/20 shadow-lg"
            >
              <i className="fa-solid fa-rotate-left"></i>
              Consult the Star Again
            </button>
          )}
        </div>

        {/* AI Insight Section */}
        <div className="mt-16 w-full max-w-lg min-h-[160px]">
          {isComplete && (
            <div className="bg-slate-900/60 border border-purple-500/30 p-8 rounded-3xl shadow-2xl backdrop-blur-md animate-float border-t-purple-400/20">
              <div className="flex items-center gap-3 mb-4 text-purple-400 font-bold uppercase tracking-widest text-xs">
                <i className="fa-solid fa-wand-magic-sparkles text-purple-300"></i>
                Star's Reading
              </div>
              {loadingAnalysis ? (
                <div className="flex gap-2 py-2">
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <p className="text-slate-200 leading-relaxed font-serif text-xl italic text-center">
                  "{analysis}"
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Tray */}
      <footer className="w-full max-w-5xl mt-auto pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Ritual Instructions */}
          <div className="bg-slate-900/40 p-8 rounded-2xl border border-purple-500/20 border-l-4 border-l-purple-500 shadow-2xl backdrop-blur-sm">
            <h3 className="text-purple-400 text-sm font-bold uppercase mb-5 tracking-widest flex items-center gap-3">
              <i className="fa-solid fa-star text-purple-500 animate-pulse"></i>
              Unlock the magic of the Purple Star
            </h3>
            <ol className="space-y-4 text-sm md:text-base text-slate-300 list-decimal list-inside marker:text-purple-500 marker:font-bold">
              <li>Clear your mind for total focus.</li>
              <li>State the game time to the Star.</li>
              <li>Sync your draws: For each ball, mentally ask, ‘Tell me the next number,’ as you press the button.</li>
              <li>Complete the cycle all the way to the Powerball.</li>
            </ol>
          </div>

          {/* History */}
          {historyRef.current.length > 0 && (
            <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
              <h3 className="text-slate-400 text-xs font-bold uppercase mb-5 tracking-widest">Past Visions</h3>
              <div className="space-y-3">
                {historyRef.current.map((set, i) => (
                  <div key={i} className="flex gap-3 items-center opacity-70 hover:opacity-100 transition-opacity">
                    {set.map((n, j) => (
                      <span 
                        key={j} 
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${n.type === BallType.POWERBALL ? 'bg-purple-900 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.6)] border border-purple-400/30' : 'bg-slate-700 text-slate-300'}`}
                      >
                        {n.value}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
