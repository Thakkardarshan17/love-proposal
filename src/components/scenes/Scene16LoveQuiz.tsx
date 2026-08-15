import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Star, ArrowRight } from 'lucide-react';
import { ProposalConfig } from '../../types';

interface Scene16LoveQuizProps {
  config: ProposalConfig;
  onNext: () => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's the most beautiful thing about our relationship?",
    options: [
      { text: "The way we understand each other", score: 10 },
      { text: "Our endless laughter together", score: 10 },
      { text: "How we support each other's dreams", score: 10 },
      { text: "The deep, unspoken connection we share", score: 10 }
    ]
  },
  {
    id: 2,
    question: "If our love was a destination, where would it be?",
    options: [
      { text: "A cozy cabin under the northern lights", score: 10 },
      { text: "A sunlit beach with endless horizons", score: 10 },
      { text: "A magical castle in a fairy tale", score: 10 },
      { text: "Wherever you are, that's my home", score: 10 }
    ]
  },
  {
    id: 3,
    question: "What promise resonates the most with you today?",
    options: [
      { text: "To always be your safe space", score: 10 },
      { text: "To choose you, every single day", score: 10 },
      { text: "To never stop making you smile", score: 10 },
      { text: "To grow old and beautiful together", score: 10 }
    ]
  }
];

export function Scene16LoveQuiz({ config, onNext }: Scene16LoveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (optionScore: number, index: number) => {
    setSelectedOption(index);
    
    // Add a slight delay before moving to next question
    setTimeout(() => {
      setScore(prev => prev + optionScore);
      setSelectedOption(null);
      
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowSummary(true);
      }
    }, 800);
  };

  const getScoreMessage = () => {
    return "Your hearts are perfectly aligned. A beautiful journey awaits!";
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-svh w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-[#1C0B13] via-[#2A101B] to-[#12080D] overflow-hidden z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg z-10"
      >
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-[#2A101B]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#E8899D]/30 shadow-[0_0_40px_rgba(232,137,157,0.15)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1C0B13]">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#E8899D] to-[#D8A06C]"
                  initial={{ width: `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8899D] to-[#D8A06C] p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#1C0B13] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#E8899D] animate-pulse" fill="currentColor" />
                  </div>
                </div>
              </div>

              <span className="inline-block px-3 py-1 bg-[#E8899D]/20 text-[#F7B8C5] text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-[#E8899D]/30">
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </span>
              
              <h3 className="text-xl sm:text-2xl font-serif text-[#FFF3EF] mb-8 leading-relaxed">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                    whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                    onClick={() => selectedOption === null && handleOptionSelect(option.score, idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                      selectedOption === idx 
                        ? 'bg-gradient-to-r from-[#E8899D]/20 to-[#D8A06C]/20 border-[#E8899D] text-[#FFF3EF] shadow-[0_0_15px_rgba(232,137,157,0.3)]' 
                        : 'bg-[#1C0B13]/50 border-[#E8899D]/20 text-[#F7B8C5] hover:border-[#E8899D]/50 hover:bg-[#1C0B13]'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-medium">{option.text}</span>
                    {selectedOption === idx && (
                      <Sparkles className="w-4 h-4 text-[#D8A06C]" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="bg-gradient-to-b from-[#2A101B]/90 to-[#1C0B13]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-[#E8899D]/40 shadow-[0_0_50px_rgba(232,137,157,0.25)] text-center relative overflow-hidden"
            >
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#E8899D]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#D8A06C]/20 rounded-full blur-3xl" />
              
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                  className="w-24 h-24 mb-6 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E8899D] to-[#D8A06C] rounded-full animate-spin-slow opacity-20 blur-md" />
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E8899D] to-[#D8A06C] p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#1C0B13] flex items-center justify-center">
                      <Star className="w-12 h-12 text-[#D8A06C]" fill="currentColor" />
                    </div>
                  </div>
                </motion.div>

                <h2 className="text-3xl sm:text-4xl font-serif text-[#FFF3EF] mb-2 drop-shadow-md">
                  Perfect Match
                </h2>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-mono tracking-widest text-[#E8899D] uppercase font-bold">
                    {config.yourName} &amp; {config.partnerName}
                  </span>
                </div>

                <div className="bg-[#1C0B13]/80 rounded-2xl p-6 mb-8 border border-[#E8899D]/20">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E8899D] to-[#D8A06C] mb-2">
                    {score}%
                  </div>
                  <p className="text-sm text-[#F7B8C5]/90 italic leading-relaxed">
                    "{getScoreMessage()}"
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onNext}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#E8899D] to-[#D8A06C] text-[#12080D] rounded-full font-bold text-sm tracking-wider uppercase shadow-[0_4px_15px_rgba(232,137,157,0.4)] flex items-center gap-2 transition-all hover:shadow-[0_6px_20px_rgba(232,137,157,0.6)]"
                >
                  <span>Continue Our Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
