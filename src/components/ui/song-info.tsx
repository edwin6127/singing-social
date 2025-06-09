import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { Language } from './language-switcher';
import { translations } from '@/lib/i18n';

interface Props {
  language: Language;
}

const songQuotes = {
  zh: [
    "音乐是心灵的语言",
    "让我们用歌声交朋友",
    "分享你的音乐故事",
    "在这里遇见志同道合的音乐人",
    "用歌声传递快乐"
  ],
  en: [
    "Music is the language of the soul",
    "Let's make friends through songs",
    "Share your music story",
    "Meet like-minded musicians here",
    "Spread joy through singing"
  ]
};

export function SongInfo({ language }: Props) {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % songQuotes[language].length);
    }, 4000);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <div className="fixed top-32 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
      <Music className="h-5 w-5 text-pink-400 animate-float" />
      <p className="text-sm font-medium text-white animate-fade-in">
        {songQuotes[language][currentQuote]}
      </p>
    </div>
  );
} 