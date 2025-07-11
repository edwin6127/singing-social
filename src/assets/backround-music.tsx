import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicList, setMusicList] = useState<string[]>([]);

  useEffect(() => {
    // 加载 music-list.json
    fetch("/music-list.json")
      .then((res) => res.json())
      .then((list: string[]) => {
        setMusicList(list);
      });
  }, []);

  useEffect(() => {
    if (musicList.length > 0 && audioRef.current) {
      const randomIndex = Math.floor(Math.random() * musicList.length);
      audioRef.current.src = musicList[randomIndex];
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((err) => {
        console.warn("自动播放失败，可能需要用户点击页面后才能播放。", err);
      });
    }
  }, [musicList]);

  return (
    <audio ref={audioRef} autoPlay loop />
  );
}