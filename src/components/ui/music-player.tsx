import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Volume1, Pause, Play, RefreshCw, Wifi, WifiOff, AlertCircle, Settings2 } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { useTranslation } from 'react-i18next';

// 最大自动重试次数
const MAX_AUTO_RETRIES = 3;
// 重试间隔（毫秒）
const RETRY_DELAYS = [2000, 4000, 6000];

// 备用音频源
const AUDIO_SOURCES = [
  '/audio/test.mp3',           // 主源
  '/audio/test.ogg',          // 备用源1（不同格式）
  '/audio/fallback/test.mp3'  // 备用源2（备用目录）
];

// 音频格式
const AUDIO_FORMATS = ['mp3', 'ogg', 'wav'];

interface AudioError {
  type: 'network' | 'format' | 'decode' | 'aborted' | 'unknown';
  message: string;
  code?: number;
  details?: string;
}

const createAudio = (source: string = AUDIO_SOURCES[0]) => {
  const audio = new Audio(source);
  audio.volume = 0.5;
  audio.preload = 'auto';
  return audio;
};

export function MusicPlayer() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<AudioError | null>(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [formatIndex, setFormatIndex] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<'initial' | 'loading' | 'stalled' | 'failed' | 'ready'>('initial');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(true);
  const [showTechInfo, setShowTechInfo] = useState(false);
  const audioRef = useRef(createAudio());
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 诊断音频错误
  const diagnoseAudioError = (error: any): AudioError => {
    if (!navigator.onLine) {
      return {
        type: 'network',
        message: '网络连接已断开',
        details: '请检查网络设置后重试'
      };
    }

    if (error instanceof Event && error.type === 'error') {
      const mediaError = (error.target as HTMLAudioElement).error;
      if (mediaError) {
        switch (mediaError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            return {
              type: 'aborted',
              message: '加载已取消',
              code: mediaError.code,
              details: '音频加载被用户或系统中断'
            };
          case MediaError.MEDIA_ERR_NETWORK:
            return {
              type: 'network',
              message: '网络错误',
              code: mediaError.code,
              details: '尝试加载音频时发生网络错误'
            };
          case MediaError.MEDIA_ERR_DECODE:
            return {
              type: 'decode',
              message: '音频解码错误',
              code: mediaError.code,
              details: '音频文件可能已损坏或格式不受支持'
            };
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            return {
              type: 'format',
              message: '格式不支持',
              code: mediaError.code,
              details: '当前浏览器不支持该音频格式或源无效'
            };
          default:
            return {
              type: 'unknown',
              message: '未知错误',
              code: mediaError.code,
              details: mediaError.message
            };
        }
      }
    }

    return {
      type: 'unknown',
      message: '未知错误',
      details: error?.message || '发生未知错误'
    };
  };

  // 尝试切换音频源
  const tryNextSource = () => {
    const nextSourceIndex = (sourceIndex + 1) % AUDIO_SOURCES.length;
    if (nextSourceIndex !== sourceIndex) {
      setSourceIndex(nextSourceIndex);
      const newAudio = createAudio(AUDIO_SOURCES[nextSourceIndex]);
      audioRef.current = newAudio;
      setupAudioListeners(newAudio);
      return true;
    }
    return false;
  };

  // 尝试切换音频格式
  const tryNextFormat = () => {
    const nextFormatIndex = (formatIndex + 1) % AUDIO_FORMATS.length;
    if (nextFormatIndex !== formatIndex) {
      setFormatIndex(nextFormatIndex);
      const currentSource = AUDIO_SOURCES[sourceIndex];
      const baseSource = currentSource.substring(0, currentSource.lastIndexOf('.'));
      const newSource = `${baseSource}.${AUDIO_FORMATS[nextFormatIndex]}`;
      const newAudio = createAudio(newSource);
      audioRef.current = newAudio;
      setupAudioListeners(newAudio);
      return true;
    }
    return false;
  };

  // 智能重试策略
  const smartRetry = (errorType: string) => {
    switch (errorType) {
      case 'network':
        // 网络错误，等待网络恢复
        return false;
      case 'format':
        // 格式不支持，尝试其他格式
        return tryNextFormat();
      case 'decode':
        // 解码错误，尝试其他源
        return tryNextSource();
      default:
        // 其他错误，尝试重新加载
        return true;
    }
  };

  // 监听网络状态变化
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      setDetailedError(null);
      if (loadingStatus === 'failed') {
        setAutoRetryEnabled(true);
        handleRetry();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      const networkError: AudioError = {
        type: 'network',
        message: '网络连接已断开',
        details: '请检查网络设置后重试'
      };
      setDetailedError(networkError);
      setError(networkError.message);
      setLoadingStatus('failed');
      setAutoRetryEnabled(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadingStatus]);

  const resetAudio = useCallback(() => {
    if (!isOnline) {
      const networkError: AudioError = {
        type: 'network',
        message: '无网络连接',
        details: '请检查网络设置后重试'
      };
      setDetailedError(networkError);
      setError(networkError.message);
      setLoadingStatus('failed');
      return;
    }

    const oldAudio = audioRef.current;
    oldAudio.pause();
    oldAudio.src = '';
    oldAudio.load();

    const newAudio = createAudio(AUDIO_SOURCES[sourceIndex]);
    audioRef.current = newAudio;
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
    setLoadingStatus('loading');
    setIsLoading(true);
    setupAudioListeners(newAudio);
  }, [isOnline, sourceIndex]);

  const setupAudioListeners = useCallback((audio: HTMLAudioElement) => {
    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
      setDetailedError(null);
      setLoadingStatus('ready');
    };

    const handlePause = () => {
      setIsPlaying(false);
      setError(null);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('音频错误:', e);
      
      const audioError = diagnoseAudioError(e);
      setDetailedError(audioError);
      
      if (!isOnline) {
        setError(audioError.message);
        setLoadingStatus('failed');
        setAutoRetryEnabled(false);
      } else {
        const shouldAutoRetry = autoRetryEnabled && retryCount < MAX_AUTO_RETRIES;
        
        if (shouldAutoRetry) {
          // 根据错误类型选择重试策略
          const canRetry = smartRetry(audioError.type);
          
          if (canRetry) {
            setError(`${audioError.message}，正在进行第 ${retryCount + 1}/${MAX_AUTO_RETRIES} 次重试...`);
            setIsPlaying(false);
            setIsLoading(true);
            setLoadingStatus('stalled');

            const timeout = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              resetAudio();
            }, RETRY_DELAYS[retryCount]);
            retryTimeoutRef.current = timeout;
          } else {
            setError(`${audioError.message}，正在尝试其他方案...`);
          }
        } else {
          setError(`${audioError.message}，请尝试以下解决方案：
1. 检查网络连接
2. 刷新页面重试
3. 尝试使用其他浏览器
4. 清除浏览器缓存`);
          setLoadingStatus('failed');
          setAutoRetryEnabled(false);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      setLoadingStatus('ready');
      setRetryCount(0);
      setAutoRetryEnabled(true);
      console.log('音频元数据已加载，时长:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadStart = () => {
      if (!isOnline) {
        setError('无网络连接，请检查网络设置');
        setLoadingStatus('failed');
        return;
      }
      setIsLoading(true);
      setLoadingStatus('loading');
      console.log('开始加载音频');
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      setLoadingStatus('ready');
      setRetryCount(0);
      setAutoRetryEnabled(true);
      console.log('音频可以播放');
    };

    const handleWaiting = () => {
      if (!isOnline) {
        setError('无网络连接，请检查网络设置');
        setLoadingStatus('failed');
        return;
      }
      setIsLoading(true);
      setLoadingStatus('loading');
      console.log('音频缓冲中');
    };

    const handleStalled = () => {
      console.log('音频加载停滞');
      
      if (!isOnline) {
        setError('无网络连接，请检查网络设置');
        setLoadingStatus('failed');
        return;
      }

      const shouldAutoRetry = autoRetryEnabled && retryCount < MAX_AUTO_RETRIES;
      
      if (shouldAutoRetry) {
        setError(`加载停滞，正在进行第 ${retryCount + 1}/${MAX_AUTO_RETRIES} 次重试...`);
        setLoadingStatus('stalled');
        
        const timeout = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          resetAudio();
        }, RETRY_DELAYS[retryCount]);
        retryTimeoutRef.current = timeout;
      } else {
        setError('自动重试次数已用完，请手动重试或刷新页面');
        setLoadingStatus('failed');
        setAutoRetryEnabled(false);
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
  }, [error, resetAudio, retryCount, isOnline, autoRetryEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    const cleanup = setupAudioListeners(audio);

    // 尝试预加载音频
    try {
      if (isOnline) {
        audio.load();
        console.log('开始预加载音频');
      }
    } catch (err) {
      console.error('预加载失败:', err);
    }

    return cleanup;
  }, [setupAudioListeners]);

  const handleRetry = () => {
    if (!isOnline) {
      setError('无网络连接，请检查网络设置');
      return;
    }
    setRetryCount(0);
    setAutoRetryEnabled(true);
    resetAudio();
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    
    try {
      if (isLoading || !isOnline || loadingStatus === 'failed') {
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
            if (!isOnline) {
              setError('无网络连接，请检查网络设置');
            } else {
              setError('播放失败，请点击页面以启用声音');
            }
            setIsPlaying(false);
          });
        }
      }
    } catch (err) {
      console.error('播放错误:', err);
      if (!isOnline) {
        setError('无网络连接，请检查网络设置');
      } else {
        setError('播放失败，请点击页面以启用声音');
      }
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
    if (isLoading || !isOnline || loadingStatus === 'failed') return;
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
          <span className="text-white/80 text-sm px-2 whitespace-nowrap flex items-center gap-1">
            {!isOnline ? (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                {t('player.offline')}
              </>
            ) : loadingStatus === 'loading' ? (
              <>
                <Wifi className="h-4 w-4 text-blue-400 animate-pulse" />
                {t('player.loading')}
              </>
            ) : loadingStatus === 'stalled' ? (
              <>
                <Wifi className="h-4 w-4 text-yellow-400" />
                {t('player.retrying')}
              </>
            ) : loadingStatus === 'failed' ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-400" />
                {t('player.failed')}
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                {`${t('player.playing')} ${isExpanded ? `${formatTime(audioRef.current.currentTime)} / ${formatTime(duration)}` : ''}`}
              </>
            )}
          </span>
          
          {isExpanded && loadingStatus === 'ready' && isOnline && (
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

          {(loadingStatus === 'stalled' || loadingStatus === 'failed' || !isOnline) ? (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 rounded-full transition-colors"
              onClick={handleRetry}
              disabled={!isOnline}
            >
              <RefreshCw className={`h-5 w-5 text-white/60 ${loadingStatus === 'stalled' && isOnline ? 'animate-spin' : ''}`} />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-white/10 rounded-full transition-colors"
              onClick={togglePlay}
              disabled={loadingStatus !== 'ready' || !isOnline}
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
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="h-4 w-4" />
            ) : loadingStatus === 'failed' ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <Wifi className="h-4 w-4" />
            )}
            {error}
          </div>
          
          {loadingStatus === 'stalled' && retryCount < MAX_AUTO_RETRIES && isOnline && (
            <div className="mt-1 text-xs text-white/70">
              {t('player.retryCount', { count: retryCount, max: MAX_AUTO_RETRIES })}
            </div>
          )}
          
          {loadingStatus === 'failed' && isOnline && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  onClick={handleRetry}
                >
                  {t('player.retry')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/10"
                  onClick={() => setShowTechInfo(!showTechInfo)}
                >
                  <Settings2 className="h-4 w-4 mr-1" />
                  {showTechInfo ? t('player.hideDetails') : t('player.showDetails')}
                </Button>
              </div>
              
              {showTechInfo && detailedError && (
                <div className="text-xs text-white/70 bg-black/20 p-2 rounded">
                  <div>{t('player.technical.errorType')}: {t(`player.errorTypes.${detailedError.type}`)}</div>
                  {detailedError.code && <div>{t('player.technical.errorCode')}: {detailedError.code}</div>}
                  {detailedError.details && <div>{t('player.technical.details')}: {t(`player.errorDetails.${detailedError.type}`)}</div>}
                  <div>{t('player.technical.source')}: {AUDIO_SOURCES[sourceIndex]}</div>
                  <div>{t('player.technical.format')}: {AUDIO_FORMATS[formatIndex]}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 