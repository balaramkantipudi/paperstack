'use client';

import React from 'react';

export const Icon = ({ 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <span 
      className={`inline-block ${className}`} 
      role="img" 
      aria-label={icon}
      {...props}
    >
      □
    </span>
  );
};

export default Icon;