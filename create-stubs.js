const fs = require('fs');
const path = require('path');

// List of dependencies to create stubs for
const dependencies = [
  '@heroui/react',
  '@iconify/react',
  'framer-motion',
  'react-intersection-observer',
  // Add more dependencies here as needed
];

// Create stubs directory if it doesn't exist
const stubsDir = path.join(__dirname, 'src', 'stubs');
if (!fs.existsSync(stubsDir)) {
  fs.mkdirSync(stubsDir, { recursive: true });
}

// Create stub for @heroui/react
const heroUIStub = `'use client';

import React from 'react';

// Basic button component
export const Button = ({ 
  children, 
  color = 'default', 
  variant = 'solid', 
  startContent, 
  endContent, 
  isIconOnly, 
  onPress, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      onClick={onPress} 
      className={\`px-4 py-2 rounded \${className}\`}
      {...props}
    >
      {startContent}
      {children}
      {endContent}
    </button>
  );
};

// Provider component
export const HeroUIProvider = ({ children }) => {
  return <>{children}</>;
};

// Card components
export const Card = ({ children, className = '', ...props }) => {
  return <div className={\`border rounded-lg shadow-sm \${className}\`} {...props}>{children}</div>;
};

export const CardBody = ({ children, className = '', ...props }) => {
  return <div className={\`p-4 \${className}\`} {...props}>{children}</div>;
};

// Input component
export const Input = ({ 
  value, 
  onValueChange, 
  placeholder, 
  startContent, 
  endContent, 
  className = '',
  ...props 
}) => {
  return (
    <div className={\`flex items-center border rounded-md px-3 py-2 \${className}\`}>
      {startContent}
      <input 
        value={value} 
        onChange={(e) => onValueChange?.(e.target.value)} 
        placeholder={placeholder}
        className="flex-grow outline-none bg-transparent"
        {...props}
      />
      {endContent}
    </div>
  );
};

// Select components
export const Select = ({ 
  children, 
  selectedKeys, 
  onChange, 
  className = '',
  ...props 
}) => {
  return (
    <select 
      value={selectedKeys?.[0]} 
      onChange={onChange}
      className={\`border rounded-md px-3 py-2 \${className}\`}
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ children, value, ...props }) => {
  return <option value={value} {...props}>{children}</option>;
};

// Dropdown components
export const Dropdown = ({ children }) => {
  return <div>{children}</div>;
};

export const DropdownTrigger = ({ children }) => {
  return <>{children}</>;
};

export const DropdownMenu = ({ children }) => {
  return <div className="hidden">{children}</div>;
};

export const DropdownItem = ({ children }) => {
  return <div>{children}</div>;
};

// Badge component
export const Badge = ({ 
  children, 
  content, 
  color = 'default', 
  variant = 'solid', 
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${className}\`}
      {...props}
    >
      {content || children}
    </span>
  );
};

// Tooltip component
export const Tooltip = ({ children, content }) => {
  return <div title={content}>{children}</div>;
};

// Tabs components
export const Tabs = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const Tab = ({ children, title }) => {
  return <div>{children}</div>;
};

// Divider component
export const Divider = ({ className = '', ...props }) => {
  return <hr className={\`my-2 \${className}\`} {...props} />;
};

// Checkbox component
export const Checkbox = ({ 
  children, 
  isSelected, 
  onValueChange, 
  color = 'default',
  ...props 
}) => {
  return (
    <label className="flex items-center" {...props}>
      <input 
        type="checkbox" 
        checked={isSelected} 
        onChange={(e) => onValueChange?.(e.target.checked)}
        className="mr-2"
      />
      {children}
    </label>
  );
};

// Modal components
export const Modal = ({ children, isOpen, onOpenChange }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {typeof children === 'function' ? children(() => onOpenChange?.(false)) : children}
    </div>
  );
};

export const ModalContent = ({ children }) => {
  return <div className="bg-white rounded-lg max-w-md w-full">{children}</div>;
};

export const ModalHeader = ({ children, className = '', ...props }) => {
  return <div className={\`p-4 border-b \${className}\`} {...props}>{children}</div>;
};

export const ModalBody = ({ children, className = '', ...props }) => {
  return <div className={\`p-4 \${className}\`} {...props}>{children}</div>;
};

export const ModalFooter = ({ children, className = '', ...props }) => {
  return <div className={\`p-4 border-t flex justify-end gap-2 \${className}\`} {...props}>{children}</div>;
};

// Progress component
export const Progress = ({ 
  value, 
  maxValue = 100, 
  color = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  return (
    <div className={\`w-full bg-gray-200 rounded-full overflow-hidden \${className}\`} {...props}>
      <div 
        className="bg-blue-500 h-2 rounded-full" 
        style={{ width: \`\${(value / maxValue) * 100}%\` }}
      ></div>
    </div>
  );
};

// Export all components
export default {
  Button,
  HeroUIProvider,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress
};`;

// Create stub for @iconify/react
const iconifyStub = `'use client';

import React from 'react';

export const Icon = ({ 
  icon, 
  className = '', 
  ...props 
}) => {
  return (
    <span 
      className={\`inline-block \${className}\`} 
      role="img" 
      aria-label={icon}
      {...props}
    >
      □
    </span>
  );
};

export default Icon;`;

// Create stub for framer-motion
const framerMotionStub = `'use client';

import React from 'react';

export const motion = {
  div: ({ children, initial, animate, transition, ...props }) => {
    return <div {...props}>{children}</div>;
  },
  // Add other HTML elements as needed
};

export default motion;`;

// Create stub for react-intersection-observer
const intersectionObserverStub = `'use client';

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
};`;

// Write stubs to files
fs.writeFileSync(path.join(stubsDir, 'heroui-react.tsx'), heroUIStub);
fs.writeFileSync(path.join(stubsDir, 'iconify-react.tsx'), iconifyStub);
fs.writeFileSync(path.join(stubsDir, 'framer-motion.tsx'), framerMotionStub);
fs.writeFileSync(path.join(stubsDir, 'react-intersection-observer.tsx'), intersectionObserverStub);

console.log('Stubs created successfully!');

// Update next.config.js to include aliases for all stubs
const nextConfigPath = path.join(__dirname, 'next.config.js');
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

// Check if the config already has aliases
if (!nextConfig.includes('config.resolve.alias')) {
  // Add basic alias configuration
  nextConfig = nextConfig.replace(
    'const nextConfig = {',
    `const nextConfig = {
  webpack: (config, { isServer }) => {
    // Define path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },`
  );
}

// Add aliases for all dependencies
let aliasCode = '';
dependencies.forEach(dep => {
  const stubFileName = dep.split('/').pop().toLowerCase();
  aliasCode += `      '${dep}': path.resolve(__dirname, 'src/stubs/${stubFileName}.tsx'),\n`;
});

// Replace existing aliases or add new ones
if (nextConfig.includes('config.resolve.alias')) {
  // Update existing aliases
  const aliasRegex = /(config\.resolve\.alias\s*=\s*\{[^}]*)(})/s;
  nextConfig = nextConfig.replace(aliasRegex, `$1${aliasCode}$2`);
} else {
  // Add new aliases
  nextConfig = nextConfig.replace(
    'const nextConfig = {',
    `const nextConfig = {
  webpack: (config, { isServer }) => {
    // Define path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
${aliasCode}    };

    return config;
  },`
  );
}

// Write updated next.config.js
fs.writeFileSync(nextConfigPath, nextConfig);

console.log('next.config.js updated successfully!');
