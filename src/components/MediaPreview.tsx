import React from "react";
import { MediaType } from "@/types/nft";
import { cn } from "@/lib/utils";
import { FaMusic, FaPlay, FaPause } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

interface MediaPreviewProps {
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  className?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaType,
  mediaUrl,
  thumbnailUrl,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!isDragging || !audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!audioRef.current || !progressRef.current) return;
      
      const rect = progressRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = pos * duration;
      
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  const renderMedia = () => {
    switch (mediaType) {
      case MediaType.IMAGE:
        return (
          <img
            src={mediaUrl}
            alt="NFT Preview"
            className={cn("w-full h-full object-cover", className)}
          />
        );
      case MediaType.VIDEO:
        return (
          <video
            src={mediaUrl}
            poster={thumbnailUrl}
            controls
            className={cn("w-full h-full object-cover", className)}
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        );
      case MediaType.AUDIO:
        return (
          <div 
            className={cn("w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-shadow-dark/20 p-6", className)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <FaMusic className="text-4xl text-primary" />
                </div>
              </div>
              
              <div className="relative">
                <audio
                  ref={audioRef}
                  src={mediaUrl}
                  className="hidden"
                />
                <div 
                  ref={progressRef}
                  className="w-full bg-shadow-dark/20 rounded-full h-2 mb-2 cursor-pointer"
                  onClick={handleProgressClick}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleProgressDrag}
                >
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-icons/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
                >
                  {isPlaying ? (
                    <FaPause className="text-white text-xl" />
                  ) : (
                    <FaPlay className="text-white text-xl" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className={cn("w-full h-full bg-shadow-dark/20 flex items-center justify-center text-icons/50", className)}>
            Không có media
          </div>
        );
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden border border-icons shadow-custom", className)}>
      {renderMedia()}
    </div>
  );
};

export default MediaPreview; 