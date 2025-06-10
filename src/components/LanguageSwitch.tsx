import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

export function LanguageSwitch() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="min-w-[80px]"
      >
        {i18n.language === 'zh' ? 'English' : '中文'}
      </Button>
    </div>
  );
} 