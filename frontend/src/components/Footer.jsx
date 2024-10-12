import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Facebook,
  Twitter,
  Instagram,
  Zap,
  Star,
  Cpu,
  Globe,
  ShoppingCart,
  Truck,
  Shield,
  Users,
  Clock,
  CircuitBoard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const navItems = [
    { name: 'Home', path: '/', icon: Globe },
    { name: 'Products', path: '/products', icon: Star },
    { name: 'Shipping', path: '/shipping', icon: Zap },
  ];

  const socialIcons = [
    { Icon: Facebook, color: '#1877F2' },
    { Icon: Twitter, color: '#1DA1F2' },
    { Icon: Instagram, color: '#E4405F' },
  ];

  const ecommerceFeatures = [
    {
      icon: ShoppingCart,
      title: 'Vast Selection',
      description: 'Over 1 million products',
      stat: '1M+',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day delivery available',
      stat: '24h',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: '100% safe transactions',
      stat: '100%',
    },
    {
      icon: Users,
      title: 'Happy Customers',
      description: 'Millions of satisfied users',
      stat: '5M+',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here to help',
      stat: '24/7',
    },
  ];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 5000);

    const featureInterval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % ecommerceFeatures.length);
    }, 3000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(featureInterval);
    };
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
    <footer className="relative bg-gradient-to-b from-black via-indigo-900 to-gray-900 text-gray-300 overflow-hidden py-16">
      <div className="absolute inset-0">
        <AnimatePresence>
          {[...Array(50)].map((_, i) => (
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
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
            <circle cx="90" cy="10" r="2" fill="currentColor" />
            <circle cx="10" cy="90" r="2" fill="currentColor" />
            <circle cx="90" cy="90" r="2" fill="currentColor" />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <h2
              className={`text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 relative group ${
                glitchEffect ? 'animate-pulse' : ''
              }`}
            >
              {glitchText('ProShop')}
              <Star
                className="absolute -top-4 -left-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={24}
              />
              <Cpu
                className="absolute -bottom-4 -right-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={24}
              />
            </h2>
            <p className="text-gray-400 italic text-lg">
              The Future of E-commerce
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-8">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="relative text-lg font-semibold hover:text-cyan-400 transition duration-300 group flex items-center"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <item.icon
                      size={20}
                      className="mr-2 transition-transform duration-300 group-hover:rotate-180"
                    />
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                    {hoverIndex === index && (
                      <Zap
                        size={16}
                        className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-cyan-400 animate-ping"
                      />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        <motion.div
          className="mb-12 bg-gray-800 bg-opacity-50 rounded-lg p-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-3xl font-bold text-center mb-8 text-cyan-400">
            Why ProShop is the Best in E-commerce
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {ecommerceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-center"
                animate={{
                  scale: index === activeFeature ? 1.1 : 1,
                  boxShadow:
                    index === activeFeature
                      ? '0 10px 20px rgba(0, 0, 0, 0.2)'
                      : 'none',
                }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon
                  size={40}
                  className="mx-auto mb-2 text-cyan-400"
                />
                <h4 className="text-xl font-semibold mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400 mb-2">
                  {feature.description}
                </p>
                <span className="text-2xl font-bold text-cyan-400">
                  {feature.stat}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center space-x-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {socialIcons.map(({ Icon, color }, index) => (
            <Button
              key={index}
              variant="ghost"
              className="relative group p-2 hover:bg-gray-700"
            >
              <Icon
                size={32}
                className="text-gray-400 group-hover:text-gray-100 transition-colors duration-300"
              />
              <span
                className="absolute inset-0 transform scale-0 rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
                }}
              ></span>
            </Button>
          ))}
        </motion.div>
        <motion.div
          className="text-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <p className="text-sm text-gray-400 mb-4">
            &copy; {currentYear} ProShop. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mb-4">
            <Star className="animate-pulse text-yellow-400" size={24} />
            <Zap className="animate-bounce text-cyan-400" size={24} />
            <Star
              className="animate-pulse text-yellow-400"
              size={24}
              style={{ animationDelay: '150ms' }}
            />
          </div>
        </motion.div>
      </div>

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
    </footer>
  );
};

export default Footer;
