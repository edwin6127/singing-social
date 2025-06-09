import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

const testAudio = new Audio('/music/test-loud.mp3');
testAudio.volume = 0.5; // 降低默认音量

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setError('未知错误');
    };

    testAudio.addEventListener('play', handlePlay);
    testAudio.addEventListener('pause', handlePause);
    testAudio.addEventListener('error', handleError);

    return () => {
      testAudio.removeEventListener('play', handlePlay);
      testAudio.removeEventListener('pause', handlePause);
      testAudio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        testAudio.pause();
      } else {
        testAudio.currentTime = 0;
        await testAudio.play();
      }
    } catch (err) {
      console.error('播放错误:', err);
      setError('音频播放失败，请点击页面启用声音');
    }
  };

  return (
    <div className="fixed bottom-20 right-4 flex flex-col items-end space-y-2">
      <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 flex items-center gap-2">
        <span className="text-white/80 text-sm px-2">
          测试音频
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10 rounded-full transition-colors"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Volume2 className="h-5 w-5 text-white animate-pulse" />
          ) : (
            <VolumeX className="h-5 w-5 text-white/60" />
          )}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-sm text-white/90 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
} 