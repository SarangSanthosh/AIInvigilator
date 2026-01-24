import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  hover = true,
  glass = true,
  style
}) => {
  const baseClasses = 'rounded-2xl p-6 relative overflow-hidden';
  const glassClasses = glass ? 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 shadow-xl';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`} style={style}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
