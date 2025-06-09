import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './button';

interface Song {
  title: string;
  artist: string;
  url: string;
}

const testAudio = new Audio('/music/test-loud.mp3');
testAudio.volume = 1;

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePlay = () => {
      console.log('Audio started playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setError(`音频错误：${e.message || '未知错误'}`);
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
      setError(`播放失败：${err instanceof Error ? err.message : '未知错误'}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-right">
        <p className="text-pink-400 text-sm font-medium animate-fade-in">
          测试音频
        </p>
        {error && (
          <p className="text-red-400 text-xs mt-1">
            {error}
          </p>
        )}
        
        {/* 音频控制 */}
        <div className="mt-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 backdrop-blur-sm hover:bg-black/70"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Volume2 className="h-6 w-6 text-pink-500 animate-glow" />
            ) : (
              <VolumeX className="h-6 w-6 text-gray-400" />
            )}
          </Button>
        </div>

        {/* 调试信息 */}
        <div className="mt-4 text-left">
          <p className="text-xs text-gray-400">调试播放器：</p>
          <audio
            controls
            src="/music/test-loud.mp3"
            className="w-full mt-1"
            onPlay={() => console.log('控件播放')}
            onPause={() => console.log('控件暂停')}
            onError={(e) => console.error('控件错误:', e)}
          />
        </div>
      </div>
    </div>
  );
} 