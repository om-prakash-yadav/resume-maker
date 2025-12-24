import React from 'react';

const AiLoader = () => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-lg bg-white/30 backdrop-blur-[2px]">
      {/* Main glowing background */}
      <div className="animate-ai-shimmer absolute inset-0 opacity-60" />
      
      {/* Floating colorful blobs for Gemini effect */}
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="animate-ai-pulse absolute h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="animate-ai-pulse animation-delay-700 absolute h-48 w-48 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="animate-ai-pulse animation-delay-1000 absolute h-48 w-48 rounded-full bg-pink-400/20 blur-3xl" />
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            {/* Gemini-like star/sparkle icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full animate-pulse text-blue-600"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="currentColor"
                className="drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"
              />
            </svg>
          </div>
          <p className="animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-sm font-medium text-transparent">
            AI is crafting your preview...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiLoader;
