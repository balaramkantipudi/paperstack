'use client';

import React from 'react';

export const motion = {
  div: ({ children, initial, animate, transition, ...props }) => {
    return <div {...props}>{children}</div>;
  },
  span: ({ children, ...props }) => <span {...props}>{children}</span>,
  button: ({ children, ...props }) => <button {...props}>{children}</button>,
  a: ({ children, ...props }) => <a {...props}>{children}</a>,
  ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
  li: ({ children, ...props }) => <li {...props}>{children}</li>,
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
  h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
  h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
  h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
  header: ({ children, ...props }) => <header {...props}>{children}</header>,
  nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
};

// Animation hooks
export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {},
});

export const useScroll = () => ({
  scrollY: { current: 0, onChange: () => {} },
});

export const useMotionValueEvent = (motionValue, event, callback) => {
  React.useEffect(() => {
    // This is a stub implementation
  }, [motionValue, event, callback]);
};

// Animation variants
export const AnimatePresence = ({ children }) => <>{children}</>;

// Transition presets
export const easeInOut = {
  type: 'tween',
  ease: [0.42, 0, 0.58, 1],
};

export const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

export default motion;