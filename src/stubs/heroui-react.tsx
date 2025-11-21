'use client';

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
      className={`px-4 py-2 rounded ${className}`}
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
  return <div className={`border rounded-lg shadow-sm ${className}`} {...props}>{children}</div>;
};

export const CardBody = ({ children, className = '', ...props }) => {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
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
    <div className={`flex items-center border rounded-md px-3 py-2 ${className}`}>
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
      className={`border rounded-md px-3 py-2 ${className}`}
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
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
  return <hr className={`my-2 ${className}`} {...props} />;
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
  return <div className={`p-4 border-b ${className}`} {...props}>{children}</div>;
};

export const ModalBody = ({ children, className = '', ...props }) => {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
};

export const ModalFooter = ({ children, className = '', ...props }) => {
  return <div className={`p-4 border-t flex justify-end gap-2 ${className}`} {...props}>{children}</div>;
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
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`} {...props}>
      <div 
        className="bg-blue-500 h-2 rounded-full" 
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
    </div>
  );
};

// Table components
export const Table = ({ children, className = '', ...props }) => {
  return <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>{children}</table>;
};

export const TableHeader = ({ children, className = '', ...props }) => {
  return <thead className={className} {...props}>{children}</thead>;
};

export const TableColumn = ({ children, className = '', ...props }) => {
  return <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>{children}</th>;
};

export const TableBody = ({ children, className = '', ...props }) => {
  return <tbody className={`bg-white divide-y divide-gray-200 ${className}`} {...props}>{children}</tbody>;
};

export const TableRow = ({ children, className = '', ...props }) => {
  return <tr className={className} {...props}>{children}</tr>;
};

export const TableCell = ({ children, className = '', ...props }) => {
  return <td className={`px-6 py-4 whitespace-nowrap ${className}`} {...props}>{children}</td>;
};

// Pagination component
export const Pagination = ({ total, initialPage, onChange, className = '', ...props }) => {
  return (
    <div className={`flex items-center justify-between ${className}`} {...props}>
      <button className="px-3 py-1 border rounded">Previous</button>
      <span>Page 1 of {Math.ceil(total / 10)}</span>
      <button className="px-3 py-1 border rounded">Next</button>
    </div>
  );
};

// Switch component
export const Switch = ({ isSelected, onValueChange, className = '', ...props }) => {
  return (
    <button 
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${isSelected ? 'bg-blue-600' : 'bg-gray-200'} ${className}`}
      onClick={() => onValueChange?.(!isSelected)}
      {...props}
    >
      <span 
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${isSelected ? 'translate-x-6' : 'translate-x-1'}`} 
      />
    </button>
  );
};

// Tailwind plugin function
export const heroui = (config = {}) => {
  return function({ addBase, addComponents, addUtilities, theme }) {
    // This is a stub implementation that doesn't actually do anything
    // In a real implementation, this would add Tailwind utilities based on the config
    return {};
  };
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
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Switch
};