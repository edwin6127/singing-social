import { Languages } from 'lucide-react';
import { Button } from './button';
import { useState } from 'react';

export type Language = 'zh' | 'en';

interface Props {
  onChange: (lang: Language) => void;
}

export function LanguageSwitcher({ onChange }: Props) {
  const [currentLang, setCurrentLang] = useState<Language>('zh');

  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setCurrentLang(newLang);
    onChange(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm hover:bg-black/70"
      onClick={toggleLanguage}
    >
      <Languages className="h-6 w-6 text-pink-500" />
      <span className="ml-2 text-sm font-medium">{currentLang.toUpperCase()}</span>
    </Button>
  );
} 