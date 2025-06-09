import { useState, useEffect, useRef } from 'react';

function getRandomIndex(excludeIndex: number, length: number) {
  let idx = Math.floor(Math.random() * length);
  while (length > 1 && idx === excludeIndex) {
    idx = Math.floor(Math.random() * length);
  }
  return idx;
}

// 提取文件名（不带扩展名）
function getSongName(path: string) {
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  return decodeURIComponent(file.replace(/\.mp3$/i, ''));
}

export function BackgroundMusic() {
  const [musicList, setMusicList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [volume] = useState(0.5); // 降低默认音量
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 获取歌曲列表
  useEffect(() => {
    setIsLoading(true);
    fetch('/music-list.json')
      .then(res => res.json())
      .then((list: string[]) => {
        setMusicList(list);
        if (list.length > 0) {
          setCurrentIndex(getRandomIndex(-1, list.length));
        }
        setError('');
      })
      .catch(err => {
        console.error('加载音乐列表失败:', err);
        setError('加载音乐列表失败');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // 切换歌曲时创建新 audio
  useEffect(() => {
    if (currentIndex === -1 || musicList.length === 0) return;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(musicList[currentIndex]);
    audio.volume = volume;
    audio.loop = false;
    audioRef.current = audio;

    const handleEnded = () => {
      const nextIdx = getRandomIndex(currentIndex, musicList.length);
      setCurrentIndex(nextIdx);
    };

    const handleError = (e: ErrorEvent) => {
      console.error('音频加载失败:', e);
      setError('音频加载失败，请刷新页面重试');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // 自动播放（需用户有过交互才会生效）
    audio.play().catch(err => {
      console.error('音频播放失败:', err);
      setError('音频播放失败，请点击页面任意位置启用声音');
    });

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, musicList, volume]);

  // 当前歌曲名
  const currentSongName =
    currentIndex !== -1 && musicList.length > 0
      ? getSongName(musicList[currentIndex])
      : '';

  // 显示加载状态或错误信息
  if (isLoading) {
    return (
      <div className="fixed right-4 bottom-4 z-40 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        加载音乐中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed right-4 bottom-4 z-40 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        {error}
      </div>
    );
  }

  // 歌曲名显示在页面右下角
  return currentSongName ? (
    <div className="fixed right-4 bottom-4 z-40 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm">
      正在播放：{currentSongName}
    </div>
  ) : null;
} 