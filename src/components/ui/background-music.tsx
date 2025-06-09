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
  const [volume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 获取歌曲列表
  useEffect(() => {
    fetch('/music-list.json')
      .then(res => res.json())
      .then((list: string[]) => {
        setMusicList(list);
        if (list.length > 0) {
          setCurrentIndex(getRandomIndex(-1, list.length));
        }
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
    audio.addEventListener('ended', handleEnded);

    // 自动播放（需用户有过交互才会生效）
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, musicList, volume]);

  // 当前歌曲名
  const currentSongName =
    currentIndex !== -1 && musicList.length > 0
      ? getSongName(musicList[currentIndex])
      : '';

  // 歌曲名显示在页面右下角
  return currentSongName ? (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 40,
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 14,
        pointerEvents: 'none',
        backdropFilter: 'blur(4px)',
      }}
    >
      正在播放：{currentSongName}
    </div>
  ) : null;
} 