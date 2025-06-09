import { useState, useEffect } from 'react';
import { translations } from '@/lib/i18n';
import { Language } from './language-switcher';
import { Sparkles } from 'lucide-react';

interface Props {
  language: Language;
}

export function DanceTips({ language }: Props) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const tips = translations[language].tips as string[];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
      <div className="flex items-center space-x-2 text-pink-400">
        <Sparkles className="h-5 w-5 animate-pulse" />
        <p className="text-sm font-medium animate-fade-in">
          {tips[currentTipIndex]}
        </p>
      </div>
    </div>
  );
} 