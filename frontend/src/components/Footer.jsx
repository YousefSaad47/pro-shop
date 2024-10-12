import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    { name: 'Products', path: '/', icon: Star },
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
      description: 'Over 1M products',
      stat: '1M+',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Same-day available',
      stat: '24h',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: '100% safe',
      stat: '100%',
    },
    {
      icon: Users,
      title: 'Happy Customers',
      description: 'Millions satisfied',
      stat: '5M+',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Always here',
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
    <footer className="relative bg-gradient-to-b from-black via-indigo-900 to-gray-900 text-gray-300 overflow-hidden py-8 px-4">
      <div className="absolute inset-0">
        <AnimatePresence>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-500 rounded-full opacity-20"
              initial={{
                scale: 0,
                x: Math.random() * 100,
                y: Math.random() * 100,
              }}
              animate={{
                scale: Math.random() * 1.5 + 0.5,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
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
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M5 5 L45 5 M5 25 L45 25 M5 45 L45 45 M25 5 L25 45"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="5" cy="5" r="1" fill="currentColor" />
            <circle cx="45" cy="5" r="1" fill="currentColor" />
            <circle cx="5" cy="45" r="1" fill="currentColor" />
            <circle cx="45" cy="45" r="1" fill="currentColor" />
            <circle cx="25" cy="25" r="1.5" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="container mx-auto px-10 md:px-20 relative z-10">
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6 text-center">
            <h2
              className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 relative group ${
                glitchEffect ? 'animate-pulse' : ''
              }`}
            >
              {glitchText('ProShop')}
              <Star
                className="absolute -top-2 -left-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={16}
              />
              <Cpu
                className="absolute -bottom-2 -right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                size={16}
              />
            </h2>
            <p className="text-gray-400 italic text-sm">
              The Future of E-commerce
            </p>
          </div>
          <nav className="w-full">
            <ul className="flex justify-center items-center space-x-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>
                    <Button
                      variant="ghost"
                      className="relative text-sm font-semibold hover:text-cyan-400 transition duration-300 group flex items-center"
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <item.icon
                        size={16}
                        className="mr-1 transition-transform duration-300 group-hover:rotate-180"
                      />
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                      {hoverIndex === index && (
                        <Zap
                          size={12}
                          className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-cyan-400 animate-ping"
                        />
                      )}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </motion.div>

        <motion.div
          className="mb-8 bg-gray-800 bg-opacity-50 rounded-lg p-4 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold text-center mb-4 text-cyan-400">
            Why Choose ProShop
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {ecommerceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-2 text-center"
                animate={{
                  scale: index === activeFeature ? 1.05 : 1,
                  boxShadow:
                    index === activeFeature
                      ? '0 5px 10px rgba(0, 0, 0, 0.2)'
                      : 'none',
                }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon
                  size={24}
                  className="mx-auto mb-1 text-cyan-400"
                />
                <h4 className="text-sm font-semibold mb-0.5">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-400 mb-1">
                  {feature.description}
                </p>
                <span className="text-lg font-bold text-cyan-400">
                  {feature.stat}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center space-x-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {socialIcons.map(({ Icon, color }, index) => (
            <Button
              key={index}
              variant="ghost"
              className="relative group p-1.5 hover:bg-gray-700"
            >
              <Icon
                size={24}
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
          <p className="text-xs text-gray-400 mb-2">
            &copy; {currentYear} ProShop. All rights reserved.
          </p>
          <div className="flex justify-center space-x-2 mb-2">
            <Star className="animate-pulse text-yellow-400" size={16} />
            <Zap className="animate-bounce text-cyan-400" size={16} />
            <Star
              className="animate-pulse text-yellow-400"
              size={16}
              style={{ animationDelay: '150ms' }}
            />
          </div>
        </motion.div>
      </div>

      <Zap
        size={32}
        className="absolute bottom-8 left-8 text-cyan-400 animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <CircuitBoard
        size={32}
        className="absolute top-8 right-8 text-cyan-400 animate-spin"
        style={{ animationDuration: '10s' }}
      />
    </footer>
  );
};

export default Footer;
