import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) {
  const { playClick } = useSound();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Vintage Vignette Backdrop */}
      <div
        className="fixed inset-0 bg-noir-950/85 backdrop-blur-sm transition-opacity"
        onClick={() => {
          playClick();
          onClose();
        }}
      />

      {/* Modal Surface */}
      <div
        className={`relative w-full ${maxWidth} bg-noir-900 border border-noir-600 rounded-lg shadow-noir-lg overflow-hidden transform transition-all z-10 my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Antique Gold Top Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-noir-600/70 bg-noir-850">
          <div>
            {subtitle && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-gold block mb-1">
                {subtitle}
              </span>
            )}
            <h3 className="text-xl font-serif font-bold text-cream">
              {title}
            </h3>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-1.5 rounded text-parchment hover:text-cream hover:bg-noir-800 transition-colors"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

