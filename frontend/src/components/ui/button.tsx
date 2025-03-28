// src/components/ui/button.tsx
import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  href,
  disabled,
  ...props
}: ButtonProps) {
  // Base styles
  let variantClasses = '';
  let sizeClasses = '';
  
  // Variant styles
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-primary-600 hover:bg-primary-700 text-white';
      break;
    case 'secondary':
      variantClasses = 'bg-gray-100 hover:bg-gray-200 text-gray-900';
      break;
    case 'outline':
      variantClasses = 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 hover:bg-red-700 text-white';
      break;
  }
  
  // Size styles
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeClasses = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeClasses = 'px-5 py-2.5 text-base';
      break;
  }
  
  // Combined classes
  const buttonClasses = `
    inline-flex items-center justify-center rounded-md font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantClasses} ${sizeClasses} ${className}
  `;
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  // If href is provided, render a Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {isLoading && <LoadingSpinner />}
        {children}
      </Link>
    );
  }
  
  // Otherwise render a button
  return (
    <button className={buttonClasses} disabled={disabled || isLoading} {...props}>
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
}
