import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram, Zap, Star, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

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

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/' },
    { name: 'Shipping', path: '/shipping' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500 rounded-full opacity-10 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2
              className={`text-4xl font-bold text-white mb-2 ${
                glitchEffect ? 'animate-pulse' : ''
              }`}
            >
              {glitchText('ProShop')}
            </h2>
            <p className="text-gray-400 italic">
              Futuristic tech at your fingertips
            </p>
          </div>
          <nav className="mb-8 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="relative text-lg font-semibold hover:text-cyan-400 transition duration-300 group"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                    {hoverIndex === index && (
                      <Zap
                        size={16}
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-cyan-400 animate-bounce"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex space-x-6">
            {[Facebook, Twitter, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-cyan-400 transition duration-300 transform hover:scale-125 hover:rotate-12"
              >
                <Icon size={28} />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 text-center relative">
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={() => setGlitchEffect(true)}
              className="bg-gray-800 text-cyan-400 px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 flex items-center space-x-2"
            >
              <span>Glitch</span>
              <Cpu size={16} className="animate-spin" />
            </button>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {currentYear} ProShop. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Star className="animate-pulse text-yellow-400" size={24} />
            <Zap className="animate-bounce text-cyan-400" size={24} />
            <Star
              className="animate-pulse text-yellow-400"
              size={24}
              style={{ animationDelay: '150ms' }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
