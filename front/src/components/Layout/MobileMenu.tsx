import React from 'react';
import { X, Menu } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    >
      {isOpen ? (
        <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      ) : (
        <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
}