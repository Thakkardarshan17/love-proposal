import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Heart,
  Sparkles,
  Send,
  Check,
  Copy,
  PhoneCall,
  Flame
} from 'lucide-react';
import { ProposalConfig } from '../types';

interface WhatsAppAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProposalConfig;
  defaultAnswerType?: 'yes' | 'custom' | 'love';
  onAnswerSent?: () => void;
}

export const WhatsAppAnswerModal: React.FC<WhatsAppAnswerModalProps> = ({
  isOpen,
  onClose,
  config,
  defaultAnswerType = 'yes',
  onAnswerSent
}) => {
  const recipientNumber = config.whatsappNumber || '+91 7201030048';
  const partner = config.partnerName || 'Labdhi';
  const proposer = config.yourName || 'Deep';

  const defaultTemplates = [
    `YES! ❤️ A thousand times YES! I accept your proposal with all my heart! 💍✨ Forever & Always yours, ${partner}!`,
    `YES, my love! 🥰 You made me the happiest person in the world today! I love you so much ${proposer}! 💖`,
    `From this moment and forever, my answer is YES! 💑💍 Let's write our beautiful story together!`,
    `I cried happy tears reading this! 🥹❤️ Yes, I choose you today, tomorrow, and for the rest of my life!`
  ];

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customMessage, setCustomMessage] = useState<string>(defaultTemplates[0]);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const initialText = defaultTemplates[0];
      setCustomMessage(initialText);
      setSelectedTemplateIndex(0);
    }
  }, [isOpen, partner, proposer]);

  if (!isOpen) return null;

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIndex(idx);
    setCustomMessage(defaultTemplates[idx]);
  };

  const handleSendWhatsApp = () => {
    const cleanNum = recipientNumber.replace(/[^0-9]/g, '');
    const finalNumber = cleanNum || '917201030048';
    const encodedText = encodeURIComponent(customMessage.trim());
    const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedText}`;
    
    onAnswerSent?.();
    // Open in new window / tab (or native WhatsApp on mobile)
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(customMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      id="whatsapp-answer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-[#25D366]/40 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[var(--c-text-main)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#25D366]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[var(--c-accent-main)]/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#25D366]/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-[var(--c-bg-darkest)] shadow-[0_0_15px_rgba(37,211,102,0.6)]">
              <MessageCircle className="w-4.5 h-4.5 fill-[var(--c-bg-darkest)] text-[#25D366]" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[var(--c-text-main)] flex items-center gap-1.5">
                <span>Send Answer on WhatsApp</span>
                <Sparkles className="w-3.5 h-3.5 text-[var(--c-accent-gold)]" />
              </h3>
              <p className="text-[11px] text-[#25D366] font-mono">
                To: {proposer} ({recipientNumber})
              </p>
            </div>
          </div>

          <button
            id="close-whatsapp-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[var(--c-accent-light)] hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Romantic Message Templates */}
        <div className="mb-4">
          <label className="block text-[11px] uppercase font-semibold text-[var(--c-accent-light)] tracking-wider mb-2 flex items-center gap-1">
            <Heart className="w-3 h-3 text-[var(--c-accent-main)] fill-[var(--c-accent-main)]" />
            <span>Choose Romantic Response:</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {defaultTemplates.map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(idx)}
                className={`p-2.5 rounded-xl text-left text-xs transition-all border cursor-pointer ${
                  selectedTemplateIndex === idx
                    ? 'bg-[#25D366]/20 border-[#25D366] text-[var(--c-text-main)] shadow-[0_0_12px_rgba(37,211,102,0.3)] font-medium'
                    : 'bg-[var(--c-bg-darkest)]/60 border-white/10 hover:border-white/20 text-[var(--c-text-main)]/80'
                }`}
              >
                <p className="line-clamp-2">{template}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Editable Message Box */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] uppercase font-semibold text-[var(--c-accent-light)] tracking-wider">
              Your Message on WhatsApp:
            </label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[10px] text-[var(--c-accent-light)]/70 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-[#25D366]" />
                  <span className="text-[#25D366]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <textarea
            id="whatsapp-custom-message-input"
            rows={3}
            value={customMessage}
            onChange={e => {
              setCustomMessage(e.target.value);
              setSelectedTemplateIndex(-1);
            }}
            placeholder="Type your personal heartfelt response..."
            className="w-full bg-[var(--c-bg-darkest)] border border-[#25D366]/40 rounded-2xl p-3 text-xs sm:text-sm text-[var(--c-text-main)] focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            id="send-whatsapp-confirm-btn"
            type="button"
            onClick={handleSendWhatsApp}
            className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(37,211,102,0.6)] hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
            <span>Send to {recipientNumber} on WhatsApp</span>
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <p className="text-center text-[10px] text-[var(--c-accent-light)]/60 mt-3">
          Opens WhatsApp with your pre-filled romantic answer ready to send to {proposer}.
        </p>
      </div>
    </div>
  );
};
