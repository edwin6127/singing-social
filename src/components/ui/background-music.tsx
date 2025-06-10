import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Volume1, Pause, Play, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

const AUDIO_SOURCES = [
  '/audio/background.mp3',
  '/audio/background.ogg'
];

export function BackgroundMusic() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 创建音频实例
    const audio = new Audio(AUDIO_SOURCES[currentSource]);
    audio.volume = volume / 100;
    audio.loop = true; // 循环播放
    audioRef.current = audio;

    // 错误处理
    const handleError = () => {
      console.error('音频加载失败，尝试切换源');
      if (currentSource < AUDIO_SOURCES.length - 1) {
        setCurrentSource(prev => prev + 1);
      } else {
        setError(t('player.error.failed'));
      }
    };

    // 自动播放处理
    const handleCanPlay = () => {
      setError(null);
      if (isPlaying) {
        audio.play().catch(() => {
          setError(t('player.error.autoplay'));
        });
      }
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
    };
  }, [currentSource, t]);

  // 音量变化处理
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      setError(t('player.error.playback'));
    }
  };

  const handleRetry = () => {
    if (!audioRef.current) return;
    setCurrentSource(0);
    setError(null);
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-4 bg-black/30 backdrop-blur-sm rounded-full p-2">
      <div className="flex items-center gap-2 min-w-[100px]">
        <VolumeIcon className="h-4 w-4 text-white/60" />
        <Slider
          value={[volume]}
          max={100}
          step={1}
          className="w-20"
          onValueChange={(values) => setVolume(values[0])}
        />
      </div>

      {error ? (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10 rounded-full"
          onClick={handleRetry}
        >
          <RefreshCw className="h-5 w-5 text-white/60" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10 rounded-full"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white/60" />
          )}
        </Button>
      )}

      {error && (
        <div className="absolute bottom-full right-0 mb-2 bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-sm text-white/90 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
} 