import { Music } from "lucide-react";

export default function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/50 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center space-x-2">
          <Music className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            舞音社区
          </span>
        </div>
      </div>
    </header>
  );
} 