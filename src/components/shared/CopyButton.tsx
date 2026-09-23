import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
  value?: string;
  text?: string;
  label?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value, text, label, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const textToCopy = value ?? text ?? '';

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(`Copied ${label || 'value'} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy ${label || textToCopy}`}
      className={`inline-flex items-center justify-center p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all active:scale-95 cursor-pointer shrink-0 ${className}`}
      aria-label={`Copy ${label || textToCopy}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
};
