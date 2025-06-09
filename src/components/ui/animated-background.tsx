import { Music } from 'lucide-react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* 渐变背景 */}
      <div className="absolute w-full h-full disco-gradient opacity-10"></div>
      
      {/* 模糊光晕 */}
      <div className="absolute top-20 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      
      {/* 卡通人物 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <img
          src="/images/singer.svg"
          alt="Singer"
          className="w-64 h-64 animate-dance-bounce"
          style={{ animationDuration: '3s' }}
        />
      </div>
      
      {/* 飘动的音符 */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-dance-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <Music
            className="text-pink-500/30"
            style={{
              width: `${24 + Math.random() * 24}px`,
              height: `${24 + Math.random() * 24}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
} 