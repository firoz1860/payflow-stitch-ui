import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext.tsx';

interface CopyButtonProps {
  textToCopy: string;
  toastLabel?: string;
  title?: string;
  className?: string;
  iconOnly?: boolean;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  toastLabel = 'Copied to clipboard',
  title = 'Copy',
  className = '',
  iconOnly = true,
  label = 'Copy'
}) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        showToast(toastLabel);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      const el = document.createElement('textarea');
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      showToast(toastLabel);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={title}
        className={`p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center justify-center ${className}`}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 animate-in zoom-in-75 duration-150" />
        ) : (
          <Copy className="w-3.5 h-3.5 transition-transform active:scale-90" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all active:scale-95 ${className}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-slate-500" />
      )}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
};
