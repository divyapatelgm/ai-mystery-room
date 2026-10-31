import React from 'react';
import { useSound } from '../../context/SoundContext';

export default function Button({
  children,
  onClick,
  variant = 'gold', // 'gold' | 'outline' | 'danger' | 'ghost' | 'secondary'
  size = 'md',     // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  const { playClick } = useSound();

  const handleClick = (e) => {
    if (disabled || loading) return;
    playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-noir-950';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold tracking-wide',
  };

  const variantStyles = {
    gold: 'bg-gold hover:bg-gold-hover text-noir-950 font-semibold shadow-md hover:shadow-gold-glow focus:ring-gold border border-gold-light/30 active:scale-[0.98]',
    secondary: 'bg-noir-800 hover:bg-noir-700 text-cream border border-noir-600 focus:ring-gold/50 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-noir-800 text-parchment hover:text-cream border border-noir-600 hover:border-gold/50 focus:ring-gold/30',
    danger: 'bg-vintage-danger/90 hover:bg-vintage-danger text-cream border border-red-900/60 shadow-md focus:ring-red-500 active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-noir-800/60 text-parchment hover:text-cream focus:ring-gold/30',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed hover:bg-none hover:shadow-none active:scale-100' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </button>
  );
}
