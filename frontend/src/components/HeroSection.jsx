import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, CircuitBoard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const glitchText = (text) => {
    if (!glitchEffect) return text;
    const glitchChars = '!@#$%^&*()_+{}|:<>?';
    return text
      .split('')
      .map((char) =>
        Math.random() > 0.7
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : char
      )
      .join('');
  };

  return (
    <section className="relative h-[90vh] bg-gradient-to-b from-gray-900 via-indigo-900 to-black rounded-3xl overflow-hidden mb-24">
      <div className="absolute inset-0">
        <AnimatePresence>
          {[...Array(70)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-500 rounded-full opacity-20"
              initial={{
                scale: 0,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                scale: Math.random() * 1.5 + 0.5,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern
            id="circuit"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 10 L90 10 M10 50 L90 50 M10 90 L90 90 M50 10 L50 90"
              stroke="cyan"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="10" cy="10" r="2" fill="cyan" />
            <circle cx="90" cy="10" r="2" fill="cyan" />
            <circle cx="10" cy="90" r="2" fill="cyan" />
            <circle cx="90" cy="90" r="2" fill="cyan" />
            <circle cx="50" cy="50" r="3" fill="cyan" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <motion.div
          className={`mb-8 ${glitchEffect ? 'animate-pulse' : ''}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 leading-tight">
            {glitchText('ProShop')}
          </h1>
          <p className="text-3xl text-cyan-400 font-light">
            Futuristic tech at your fingertips
          </p>
        </motion.div>

        <motion.p
          className="text-2xl mb-12 text-gray-300 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Experience the future of shopping with our cutting-edge products
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <a href="#products-section">
            <Button
              variant="outline"
              className="group px-10 py-6 bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black text-2xl font-semibold rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/50"
              onClick={() => setGlitchEffect(true)}
            >
              Explore Store
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black to-transparent"></div>

      <Zap
        size={50}
        className="absolute bottom-16 left-16 text-cyan-400 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <CircuitBoard
        size={50}
        className="absolute top-16 right-16 text-cyan-400 animate-spin"
        style={{ animationDuration: '10s' }}
      />
    </section>
  );
};

export default HeroSection;
