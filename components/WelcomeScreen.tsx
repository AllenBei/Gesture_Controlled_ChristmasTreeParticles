import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
      <div className="text-center space-y-8 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-bold font-christmas text-gold tracking-widest mb-4">
          MERRY CHRISTMAS
        </h1>
        <p className="text-white/60 text-lg font-light tracking-widest uppercase">
          Interactive Light Experience
        </p>
        
        <div className="mt-12">
          <button 
            onClick={onStart}
            className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-white/50 transition-all duration-300"
          >
            <div className="absolute inset-0 w-0 bg-red-900 transition-all duration-[250ms] ease-out group-hover:w-full opacity-50"></div>
            <span className="relative text-white font-bold tracking-widest text-xl uppercase">Start Magic</span>
          </button>
        </div>
        
        <div className="mt-16 grid grid-cols-2 gap-8 text-white/40 text-sm max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">🖐</span>
            <span>Open Hand to Explode</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-2">✊</span>
            <span>Fist to Create Tree</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
