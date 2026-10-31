import React from 'react';

export default function Badge({
  children,
  variant = 'gold', // 'gold' | 'olive' | 'crimson' | 'muted' | 'noir'
  size = 'md',      // 'sm' | 'md'
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-mono tracking-wider',
    md: 'text-xs px-2.5 py-1 font-mono tracking-wide',
  };

  const variantStyles = {
    gold: 'bg-gold/15 text-gold border border-gold/40',
    olive: 'bg-vintage-success/20 text-[#8cb080] border border-vintage-success/40',
    crimson: 'bg-vintage-danger/20 text-[#cf6d6d] border border-vintage-danger/40',
    muted: 'bg-noir-800 text-parchment border border-noir-600',
    noir: 'bg-noir-900 text-cream border border-noir-600 shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center uppercase font-medium rounded ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
