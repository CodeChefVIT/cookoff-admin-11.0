import React from 'react';
import { Copy } from 'lucide-react';

import useToast from '@/lib/toast';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  content: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ content, className }) => {
  const toast = useToast();

  const handleCopy = () => {
    if (content) {
      navigator.clipboard
        .writeText(content)
        .then(() => toast.create('Copied to Clipboard', 'success'))
        .catch(() => toast.create('Error', 'error'));
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="dark: group rounded-full p-2 transition-colors hover:bg-indigo-50 focus:outline-none focus:ring-2 dark:hover:bg-indigo-900"
    >
      <Copy
        className={cn(
          'h-4 w-4 text-indigo-500 transition-transform hover:text-indigo-600 group-hover:scale-110 dark:text-indigo-400 dark:hover:text-indigo-300',
          className
        )}
      />
    </button>
  );
};
