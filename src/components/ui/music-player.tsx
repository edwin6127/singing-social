import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';

const testAudio = new Audio('/music/test-loud.mp3');
testAudio.volume = 0.5; // 降低默认音量

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError('未知错误');
    const handleLoadedMetadata = () => setDuration(testAudio.duration);
    const handleTimeUpdate = () => {
      setProgress((testAudio.currentTime / testAudio.duration) * 100);
    };

    testAudio.addEventListener('play', handlePlay);
    testAudio.addEventListener('pause', handlePause);
    testAudio.addEventListener('error', handleError);
    testAudio.addEventListener('loadedmetadata', handleLoadedMetadata);
    testAudio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      testAudio.removeEventListener('play', handlePlay);
      testAudio.removeEventListener('pause', handlePause);
      testAudio.removeEventListener('error', handleError);
      testAudio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      testAudio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        testAudio.pause();
      } else {
        await testAudio.play();
      }
    } catch (err) {
      console.error('播放错误:', err);
      setError('音频播放失败，请点击页面启用声音');
    }
  };

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    testAudio.volume = values[0] / 100;
  };

  const handleProgressChange = (values: number[]) => {
    const time = (values[0] / 100) * duration;
    testAudio.currentTime = time;
    setProgress(values[0]);
  };

  const formatTime = (seconds: number) => {
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
            测试音频 {isExpanded && formatTime(testAudio.currentTime)} / {isExpanded && formatTime(duration)}
          </span>
          
          {isExpanded && (
            <>
              <div className="flex-1 mx-2">
                <Slider
                  value={[progress]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={(values) => handleProgressChange(values)}
                />
              </div>
              
              <div className="flex items-center gap-2 min-w-[100px]">
                <VolumeIcon className="h-4 w-4 text-white/60" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  className="w-20"
                  onValueChange={(values) => handleVolumeChange(values)}
                />
              </div>
            </>
          )}

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
      </div>
      
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 text-sm text-white/90 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
} 