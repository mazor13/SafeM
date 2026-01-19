import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Network, Cpu } from 'lucide-react';

interface LoginIntroProps {
  onComplete: () => void;
}

export const LoginIntro: React.FC<LoginIntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Auto complete after 3 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  // Neural network nodes
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 2,
  }));

  // Connection lines
  const connections = nodes.slice(0, 15).map((node, i) => {
    const target = nodes[Math.floor(Math.random() * nodes.length)];
    return {
      id: `line-${i}`,
      x1: node.x,
      y1: node.y,
      x2: target.x,
      y2: target.y,
      delay: Math.random() * 1.5,
    };
  });

  return (
    <div className="fixed inset-0 bg-[#0E1A35] z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(0,216,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Neural Network Animation */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          {/* Connection Lines */}
          {connections.map((conn) => (
            <motion.line
              key={conn.id}
              x1={`${conn.x1}%`}
              y1={`${conn.y1}%`}
              x2={`${conn.x2}%`}
              y2={`${conn.y2}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
              transition={{
                duration: 2,
                delay: conn.delay,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D8FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00D8FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Neural Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full bg-[#00D8FF]"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: node.size,
              height: node.size,
              boxShadow: '0 0 20px rgba(0,216,255,0.8)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: [0, 1, 0.6],
            }}
            transition={{
              duration: 1.5,
              delay: node.delay,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        {/* Central Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00D8FF] to-[#0EA5E9] mb-8 relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            boxShadow: '0 0 60px rgba(0,216,255,0.6)',
          }}
        >
          {/* Rotating Ring */}
          <motion.div
            className="absolute inset-0 rounded-3xl border-2 border-[#00D8FF]"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              boxShadow: '0 0 30px rgba(0,216,255,0.8)',
            }}
          />

          {/* Inner Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Brain size={48} className="text-[#0E1A35]" />
          </motion.div>

          {/* Orbiting Particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#00D8FF]"
              style={{
                boxShadow: '0 0 10px rgba(0,216,255,0.8)',
              }}
              animate={{
                rotate: 360,
                x: [0, 50 * Math.cos((i * Math.PI) / 2), 0],
                y: [0, 50 * Math.sin((i * Math.PI) / 2), 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-black text-white mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            textShadow: '0 0 30px rgba(0,216,255,0.5)',
          }}
        >
          AEGIS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg text-[#00D8FF] font-semibold mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Initializing Intelligence Core...
        </motion.p>

        {/* Status Messages */}
        <div className="space-y-2 mb-8 min-h-[60px]">
          <motion.div
            className="flex items-center justify-center gap-2 text-[#A9B3C1] text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: progress > 20 ? 1 : 0, x: progress > 20 ? 0 : -20 }}
            transition={{ duration: 0.4 }}
          >
            <Cpu size={16} className="text-[#00D8FF]" />
            <span>Loading Neural Network...</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-2 text-[#A9B3C1] text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: progress > 50 ? 1 : 0, x: progress > 50 ? 0 : -20 }}
            transition={{ duration: 0.4 }}
          >
            <Network size={16} className="text-[#00D8FF]" />
            <span>Connecting to Intelligence Engine...</span>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-2 text-[#A9B3C1] text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: progress > 80 ? 1 : 0, x: progress > 80 ? 0 : -20 }}
            transition={{ duration: 0.4 }}
          >
            <Zap size={16} className="text-[#00D8FF]" />
            <span>Initializing Security Protocols...</span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-[#1C2435] rounded-full overflow-hidden border border-[rgba(0,216,255,0.2)]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00D8FF] to-[#0EA5E9]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{
                boxShadow: '0 0 20px rgba(0,216,255,0.8)',
              }}
            />
          </div>

          {/* Progress Percentage */}
          <motion.p
            className="text-[#00D8FF] text-sm font-bold mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {progress}%
          </motion.p>
        </div>

        {/* Data Stream Effect */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="text-[#00D8FF] text-xs font-mono whitespace-nowrap"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'linear',
              }}
            >
              01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
            </motion.div>
          ))}
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#00D8FF] opacity-30 rounded-tl-3xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-[#00D8FF] opacity-30 rounded-tr-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[#00D8FF] opacity-30 rounded-bl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#00D8FF] opacity-30 rounded-br-3xl"></div>
    </div>
  );
};

export default LoginIntro;
