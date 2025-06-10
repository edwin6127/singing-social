import { useTranslation } from 'react-i18next';
import { Button } from './button';

export type Language = 'zh' | 'en';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('zh') ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="bg-white/10 hover:bg-white/20 text-white min-w-[80px] backdrop-blur-sm"
      >
        {i18n.language.startsWith('zh') ? 'English' : '中文'}
      </Button>
    </div>
  );
} 