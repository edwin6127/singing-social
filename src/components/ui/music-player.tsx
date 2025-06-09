import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1, Pause, Play } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

// 使用本地测试音频
const testAudio = new Audio('/test.mp3');
testAudio.volume = 0.5;
testAudio.preload = 'auto';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(testAudio);

  useEffect(() => {
    const audio = audioRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setError(null);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('音频错误:', e);
      setError('播放失败，请检查网络连接或刷新页面');
      setIsPlaying(false);
      setIsLoading(false);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      console.log('音频元数据已加载，时长:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      console.log('开始加载音频');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      console.log('音频可以播放');
    };

    const handleWaiting = () => {
      setIsLoading(true);
      console.log('音频缓冲中');
    };

    const handleStalled = () => {
      console.log('音频加载停滞');
      if (!error) {
        setError('音频加载停滞，请检查网络连接');
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('stalled', handleStalled);

    // 尝试预加载音频
    try {
      audio.load();
      console.log('开始预加载音频');
    } catch (err) {
      console.error('预加载失败:', err);
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('stalled', handleStalled);
    };
  }, [error]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    
    try {
      if (isLoading) {
        return;
      }

      if (isPlaying) {
        audio.pause();
      } else {
        // 如果音频已经播放完毕，重新开始
        if (audio.ended) {
          audio.currentTime = 0;
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('播放错误:', error);
            setError('播放失败，请点击页面以启用声音');
            setIsPlaying(false);
          });
        }
      }
    } catch (err) {
      console.error('播放错误:', err);
      setError('播放失败，请点击页面以启用声音');
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const audio = audioRef.current;
    const newVolume = values[0];
    setVolume(newVolume);
    audio.volume = newVolume / 100;
  };

  const handleProgressChange = (values: number[]) => {
    const audio = audioRef.current;
    if (isLoading) return;
    const time = (values[0] / 100) * duration;
    audio.currentTime = time;
    setProgress(values[0]);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div 
      className="fixed bottom-20 right-4 flex flex-col items-end space-y-2"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`bg-black/30 backdrop-blur-sm rounded-full transition-all duration-300 ${isExpanded ? 'w-80' : 'w-auto'}`}>
        <div className="p-2 flex items-center gap-2">
          <span className="text-white/80 text-sm px-2 whitespace-nowrap">
            {isLoading ? '加载中...' : `测试音频 ${isExpanded ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(duration)}` : ''}`}
          </span>
          
          {isExpanded && !isLoading && (
            <>
              <div className="flex-1 mx-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={handleProgressChange}
                />
              </div>
              
              <div className="flex items-center gap-2 min-w-[100px]">
                <VolumeIcon className="h-4 w-4 text-white/60" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-20"
                  onValueChange={handleVolumeChange}
                />
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-white/10 rounded-full transition-colors"
            onClick={togglePlay}
            disabled={isLoading}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white animate-pulse" />
            ) : (
              <Play className="h-5 w-5 text-white/60" />
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-sm text-white/90 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
} 