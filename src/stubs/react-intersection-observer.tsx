'use client';

import React from 'react';

// Stub implementation of useInView hook
export function useInView(options = {}) {
  const [ref, setRef] = React.useState(null);
  const [inView, setInView] = React.useState(false);
  const [entry, setEntry] = React.useState(null);

  React.useEffect(() => {
    // Simulate entering view after a short delay
    const timer = setTimeout(() => {
      setInView(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const refCallback = React.useCallback((node) => {
    if (node !== null) {
      setRef(node);
    }
  }, []);

  return [refCallback, inView, entry];
}

// Stub implementation of InView component
export function InView({ 
  as = 'div', 
  children, 
  onChange = () => {}, 
  ...props 
}) {
  const [ref, inView] = useInView(props);
  
  React.useEffect(() => {
    onChange(inView);
  }, [inView, onChange]);

  const Component = as;
  
  return (
    <Component ref={ref} {...props}>
      {typeof children === 'function' ? children(inView) : children}
    </Component>
  );
}

export default {
  useInView,
  InView
};