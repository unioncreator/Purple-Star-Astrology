
import React from 'react';
import { BallType } from '../types';

interface BallProps {
  value: number;
  type: BallType;
  delay?: number;
}

const Ball: React.FC<BallProps> = ({ value, type, delay = 0 }) => {
  const isPowerball = type === BallType.POWERBALL;
  
  return (
    <div 
      className={`
        relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center 
        text-2xl md:text-4xl font-bold transition-all duration-700 ball-shadow
        ${isPowerball 
          ? 'bg-gradient-to-br from-red-400 to-red-700 text-white border-2 border-red-300' 
          : 'bg-gradient-to-br from-slate-100 to-slate-300 text-slate-900 border-2 border-slate-200'}
        animate-[bounce_0.5s_ease-out_forwards]
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 rounded-full bg-white opacity-10 blur-sm transform -translate-x-1 -translate-y-1"></div>
      {value}
    </div>
  );
};

export default Ball;
