import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Pause, Play, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

// 使用本地测试音频
const createAudio = () => {
  const audio = new Audio('/test.mp3');
  audio.volume = 0.5;
  audio.preload = 'auto';
  return audio;
};

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<'initial' | 'loading' | 'stalled' | 'ready'>('initial');
  const audioRef = useRef(createAudio());
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetAudio = useCallback(() => {
    const oldAudio = audioRef.current;
    oldAudio.pause();
    oldAudio.src = '';
    oldAudio.load();

    const newAudio = createAudio();
    audioRef.current = newAudio;
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setLoadingStatus('loading');
    setIsLoading(true);
    setupAudioListeners(newAudio);
  }, []);

  const setupAudioListeners = useCallback((audio: HTMLAudioElement) => {
    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
      setLoadingStatus('ready');
    };

    const handlePause = () => {
      setIsPlaying(false);
      setError(null);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('音频错误:', e);
      setError('播放失败，正在尝试重新加载...');
      setIsPlaying(false);
      setIsLoading(true);
      setLoadingStatus('stalled');

      // 最多重试3次，每次间隔增加
      if (retryCount < 3) {
        const timeout = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          resetAudio();
        }, (retryCount + 1) * 2000);
        retryTimeoutRef.current = timeout;
      } else {
        setError('音频加载失败，请刷新页面重试');
        setLoadingStatus('stalled');
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      setLoadingStatus('ready');
      console.log('音频元数据已加载，时长:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setLoadingStatus('loading');
      console.log('开始加载音频');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      setLoadingStatus('ready');
      console.log('音频可以播放');
    };

    const handleWaiting = () => {
      setIsLoading(true);
      setLoadingStatus('loading');
      console.log('音频缓冲中');
    };

    const handleStalled = () => {
      console.log('音频加载停滞');
      setLoadingStatus('stalled');
      if (!error) {
        setError('音频加载停滞，正在重试...');
        if (retryCount < 3) {
          const timeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            resetAudio();
          }, (retryCount + 1) * 2000);
          retryTimeoutRef.current = timeout;
        } else {
          setError('音频加载失败，请刷新页面重试');
        }
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

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [error, resetAudio, retryCount]);

  useEffect(() => {
    const audio = audioRef.current;
    const cleanup = setupAudioListeners(audio);

    // 尝试预加载音频
    try {
      audio.load();
      console.log('开始预加载音频');
    } catch (err) {
      console.error('预加载失败:', err);
    }

    return cleanup;
  }, [setupAudioListeners]);

  const handleRetry = () => {
    setRetryCount(0);
    resetAudio();
  };

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
            {loadingStatus === 'loading' ? '加载中...' : 
             loadingStatus === 'stalled' ? '加载停滞' :
             `测试音频 ${isExpanded ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(duration)}` : ''}`}
          </span>
          
          {isExpanded && loadingStatus === 'ready' && (
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

          {loadingStatus === 'stalled' ? (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 rounded-full transition-colors"
              onClick={handleRetry}
            >
              <RefreshCw className="h-5 w-5 text-white/60 animate-spin" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 rounded-full transition-colors"
              onClick={togglePlay}
              disabled={loadingStatus !== 'ready'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white animate-pulse" />
              ) : (
                <Play className="h-5 w-5 text-white/60" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-sm text-white/90 animate-fade-in">
          {error}
          {loadingStatus === 'stalled' && retryCount < 3 && (
            <span className="ml-2">重试次数: {retryCount}/3</span>
          )}
        </div>
      )}
    </div>
  );
} 